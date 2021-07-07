const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const ClaimModel = require("../models/claim");

//// load validations
const { validateCreatePayout, validateGetClaims, validateGetClaimInfo, validateRaiseClaim, validateReviewClaim } = require("../validation/claimValidation");

const isEmpty = require("is-empty");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");
const UserService = require("./userService");
const InsuranceService = require("./insuranceService");

const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const axios = require("axios");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: configuration.awsConfig.accessKeyId,
    secretAccessKey: configuration.awsConfig.secretAccessKey,
    region: configuration.awsConfig.region
});

class ClaimService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);
        this.userService = container.get(UserService);
        this.insuranceService = container.get(InsuranceService);
    }

    //// create rapyd payout method
    async createPayout(data, currentUser){
        this.logService.info('entered createPayout in claimService.', {input: data});

        let { errors, isValid } = validateCreatePayout(data);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        //// get the basic configurations
        let http_method = constants.rapydConstants.http_post_method;               
        let create_payout_url_path = constants.rapydConstants.http_create_payout_url;
        let full_post_url = configuration.rapydConfig.sandbox_base_url + create_payout_url_path;

        let salt =  crypto.randomBytes(12).toString("hex");   
        let timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();

        let access_key = configuration.rapydConfig.access_key;     
        let secret_key = configuration.rapydConfig.secret_key;  
        let body = '';  

        //// form the request body
        let request_data = {
                ewallet : configuration.rapydConfig.primary_account_wallet,
                payout_amount: data.amount,
                sender_country : data.country ? data.country.toUpperCase() : "US",
                sender_currency : data.currency ? data.currency.toUpperCase() : "USD", 
                sender_entity_type: constants.rapydConstants.beneficiary_entity_type_company,
                beneficiary_entity_type : data.entityType ? data.entityType : "individual",
                payout_method_type : data.payoutMethodType,
                beneficiary_country : data.country ? data.country.toUpperCase() : "US",
                payout_currency: data.currency ? data.currency.toUpperCase() : "USD",
                beneficiary: data.beneficiary_id,
                description : data.description 
            };

        this.logService.info('create payout -  request_data.', {request_data: request_data});

        //// generate signature
        body = JSON.stringify(request_data);
        let to_sign = http_method + create_payout_url_path + salt + timestamp + access_key + secret_key + body;

        let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

        const headers = {
            'content-Type': 'application/json',
            'access_key' : access_key,
            'salt' : salt,
            'timestamp' : timestamp,
            'signature' : signature
        };

        this.logService.info('create payout -  headers.', {headers: headers});

        //// post it to rapyd
        return  axios.post(full_post_url, request_data, {headers : headers})
            .then((resp) => {
                response.result = { status: resp.status, payout_data : resp.data.data };

                this.logService.info('create payout is done.', response.result);
                return response;
            })
            .catch((err) => {
                this.logService.error('Error occurred in createPayout operation.', err);
                response.errors.exception = "Error occurred in createPayout operation.";
                return response;
            });
    }

    //// getClaimInfo method
    async getClaimInfo(data, currentUser){

        this.logService.info('claimsService - entered getClaimInfo operation', { info: data });
        
        //// perform form validation
        let { errors, isValid } = validateGetClaimInfo(data, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary validations are done.');

        //// find returns a promise so returning it - this is an async method.
        return ClaimModel.findById(data._id)
        .populate('holderId', this.getUserProjectionArray())
        .populate('raisedBy', this.getUserProjectionArray())
        .populate('reviewer1', this.getUserProjectionArray())
        .populate('reviewer2', this.getUserProjectionArray())
        .populate('insuranceId')
        .sort({ friendlyId : 'asc'})
        .then(claim => {
            if(!claim){
                response.errors.exception = "claim  information is not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            response.result = claim;
            this.logService.info('claim info is fetched.', { _id: claim._id });
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get claim info for unknown reasons.";
            this.logService.error('Runtime Error occurred during get claim op.', { ...err, currentUser: currentUser});
            return response;
        });
    }

    //// getClaims method
    async getClaims(criteria, currentUser){

        this.logService.info('ClaimService - entered getClaims operation', { info: criteria });
        
        //// perform form validation
        let { errors, isValid } = validateGetClaims(criteria, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary validations are done.');

        let query = {};
        let skip = criteria.skip? criteria.skip : 0;
        let limit = criteria.limit? criteria.limit : 25;

        query = this.getQueryForScenario(criteria, currentUser);

        this.logService.info('the query to be used for the scenario: ', { queryObj: query});

        //// find returns a promise so returning it - this is an async method.
        return ClaimModel.find(query)
        .populate('holderId', this.getUserProjectionArray())
        .populate('raisedBy', this.getUserProjectionArray())
        .populate('reviewer1', this.getUserProjectionArray())
        .populate('reviewer2', this.getUserProjectionArray())
        .populate('insuranceId')
        .sort({ createdDate : 'desc'})
        .limit(limit)
        .then(claims => {
            if(!claims){
                response.errors.exception = "claims information not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            response.result = claims;
            this.logService.info('claims info is fetched.', {count: response.result.length});
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get claims for unknown reasons.";
            this.logService.error('Runtime Error occurred during get claims op.', { ...err, currentUser: currentUser});
            return response;
        });
    }


    getQueryForScenario(criteria, currentUser){
        let query = {};
        let lastFriendlyId = criteria.lastFriendlyId ? criteria.lastFriendlyId : Infinity;

        if(criteria.scenario === constants.scenario_getUserClaims){
            query = {
                    $and : [
                            {  
                                holderId : currentUser.id
                            },
                            {
                                friendlyId : {
                                    $gt : lastFriendlyId //// since it is sorted in ascending order
                                }
                            }
                    ]
                };
        }
        else if(criteria.scenario === constants.scenario_getPendingClaims){
            query = {
                    $and : [
                            {
                                $or : [
                                    {
                                        status : constants.claimStatus_initiated
                                    },
                                    {
                                        status : constants.claimStatus_inreview
                                    },
                                    {
                                        status : constants.claimStatus_review_complete
                                    }
                                ]
                            },
                            {
                                friendlyId : {
                                    $gt : lastFriendlyId //// since it is sorted in ascending order
                                }
                            }
                        ]
                };
        }
        else if(criteria.scenario === constants.scenario_getReviewClaims){
            query = {
                    $and : [
                            {
                                $or : [
                                    {
                                        status : constants.claimStatus_initiated
                                    },
                                    {
                                        status : constants.claimStatus_inreview
                                    }
                                ]
                            },
                            {
                                friendlyId : {
                                    $gt : lastFriendlyId //// since it is sorted in ascending order
                                }
                            }
                        ]
                };
        }
        
        return query;
    }

    getUserProjectionArray(){
        return [
            'friendlyId', 
            'name', 
            'email', 
            'userType',
        ];
    }


    //// raiseClaim method
    async raiseClaim(data, currentUser) {

        this.logService.info('entered raiseClaim in claimService.', {data: data});
        //// perform form validation
        let { errors, isValid } = validateRaiseClaim(data, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response; 
        }

        this.logService.info('primary validations are done.');
        //// check and perform validations & create accordingly

        //// get insurance info 
        const insuranceOrderResponse = await this.insuranceService.getInsuranceInfo({_id: data.insuranceOrderId}, currentUser);
        if(isEmpty(insuranceOrderResponse.result) || !isEmpty(insuranceOrderResponse.errors)){
            this.logService.info('Given insurance order does not exist.');
            response.errors.insuranceOrderId = 'Given insurance order does not exist.';
            return response;
        }
        let fetchedInsuranceOrder = insuranceOrderResponse.result;
        if(fetchedInsuranceOrder.holderId._id.toString() !== data.holderInfo._id){
            this.logService.info('Given insurance id does not match with the holder information.');
            response.errors.insuranceOrderId = 'Given insurance id does not match with the holder information.';
            return response; 
        }
        if(fetchedInsuranceOrder.policyProduct.productType === constants.productType_term
            && data.claimType != constants.claimType_life)
        {
            this.logService.info('Given insurance id does not match with the claim type.');
            response.errors.insuranceOrderId = 'Given insurance id does not match with the claim type.';
            return response; 
        }
        else if(fetchedInsuranceOrder.policyProduct.productType === constants.productType_health
            && data.claimType != constants.claimType_medical)
        {
            this.logService.info('Given insurance id does not match with the claim type.');
            response.errors.insuranceOrderId = 'Given insurance id does not match with the claim type.';
            return response; 
        }

        this.logService.info('secondary validations are done.');

        let sumClaimed = fetchedInsuranceOrder.sumClaimed ? fetchedInsuranceOrder.sumClaimed : 0;
        let sumAssured = fetchedInsuranceOrder.sumAssured;
        //// TODO: validation of nominee 
        //// TODO: check if the claim amount is greater than the available amount.

        //// get two random partner doctor ids.
        const randomDoctorsResponse = await this.userService.getRandomPartnerDoctors(currentUser);
        if(isEmpty(randomDoctorsResponse.result) || !isEmpty(randomDoctorsResponse.errors)){
            this.logService.info('Could not assign reviewers temporarily. Please try again later / contact administrator.');
            response.errors.exception = 'Could not assign reviewers temporarily. Please try again later / contact administrator.';
            return response;
        }
        let randomDoctors = randomDoctorsResponse.result;

        //// create the claim and assign the reviewer doctors automatically.
        let friendlyId = await this.idCounterService.getNewId(constants.idCounter_claims);
        if(friendlyId == -1){
            throw "Could not generate a new friendly Id for claim.";
        }

         
        var newClaim = new ClaimModel({
            _id: new mongoose.Types.ObjectId(),
            friendlyId: friendlyId,
            name : data.name,
            raisedOn: Date.now(),
            holderId : data.holderInfo._id,
            insuranceId: data.insuranceOrderId,
            claimType : data.claimType,
            dateOfOccurrence: data.dateOfOccurrence,
            status: "initiated",
            raisedBy : currentUser._id,
            isNominee: data.claimRelationship === constants.claimRelationship_nominee,
            isPartnerDoctor: data.claimRelationship === constants.claimRelationship_partnerdoctor,
            claimAmount: data.claimAmount,
            reviewInfo:  {
                review1: "",
                review2: ""
            },
            reviewer1: randomDoctors.reviewer1,
            reviewer2: randomDoctors.reviewer2
        });

        //// save the newClaim details to db
        return newClaim.save()
        .then(claim => {
            response.result = { _id: claim._id, action: "created", 
                                claimData : claim,
                                };

            //// async - mail the owner confirmation.
            this.emailService.sendRaiseClaim(currentUser, claim);

            this.logService.info('new claim order is raised.', response.result);
            //// return result
            return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in newclaim operation.', err);
            response.errors.exception = "Error occurred in newclaim operation. Could not save for unknown reasons.";
            return response;
        });
    }

    //// reviewClaim method
    async reviewClaim(data, currentUser) {

        this.logService.info('entered reviewClaim in claimService.', {data: data});
        //// perform form validation
        let { errors, isValid } = validateReviewClaim(data, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response; 
        }

        this.logService.info('primary validations are done.');
        //// check and perform validations & create accordingly
        //// get claim info 
        const claimResponse = await this.getClaimInfo({_id: data._id}, currentUser);
        if(isEmpty(claimResponse.result) || !isEmpty(claimResponse.errors)){
            this.logService.info('Given claim info does not exist.');
            response.errors.exception = 'Given claim info does not exist.';
            return response;
        }
        let fetchedClaim = claimResponse.result;
        if(fetchedClaim.reviewInfo.reviewer1 !== currentUser._id &&
            fetchedClaim.reviewInfo.reviewer2 !== currentUser._id){
            this.logService.info('User is not allowed to submit review remarks for this claim.');
            response.errors.exception = 'User is not allowed to submit review remarks for this claim.';
            return response; 
        }
        if(fetchedClaim.status !== constants.claimStatus_initiated &&
            fetchedClaim.status !== constants.claimStatus_inreview){
            this.logService.info('this claim is not in a state for review. ');
            response.errors.exception = 'this claim is not in a state for review.';
            return response; 
        }

        this.logService.info('secondary validations are done.');

        let updateInfo =  {};

        //// change the claim status based on the reviewer's statuses.
        if(fetchedClaim.reviewInfo.reviewer1 === currentUser._id){
            updateInfo = {
                'reviewInfo.review1' : data.reviewStatus,
                'reviewInfo.remarks1' : data.remarks,
            };
            if(fetchedClaim.reviewInfo.review2 === constants.reviewStatus_approved){
                updateInfo['status'] = constants.claimStatus_review_complete;
            }
            else{
                updateInfo['status'] = constants.claimStatus_inreview;
            }
        }
        if(fetchedClaim.reviewInfo.reviewer2 === currentUser._id){
            updateInfo = {
                'reviewInfo.review2' : data.reviewStatus,
                'reviewInfo.remarks2' : data.remarks,
            };
            if(fetchedClaim.reviewInfo.review1 === constants.reviewStatus_approved){
                updateInfo['status'] = constants.claimStatus_review_complete;
            }
            else{
                updateInfo['status'] = constants.claimStatus_inreview;
            }
        }

        //// update claim details to db
        return ClaimModel.updateOne({_id: data._id}, { "$set": updateInfo })
        .then(updated => {
                response.result = { _id: data._id, action: "updated" };
                this.logService.info('the claim is updated with the review remarks.', response.result);

                //// trigger payout for doctor /// call rapyd api
                this.handleReviewPayment(claimData, currentUser);

                //// return result
                return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in reviewClaim operation.', err);
            response.errors.exception = "Error occurred in reviewClaim operation. Could not save for unknown reasons.";
            return response;
        });
    }


    
    //// processClaim method
    async processClaim(data, currentUser) {

        this.logService.info('entered processClaim in claimService.', {data: data});
        //// perform form validation
        let { errors, isValid } = validateProcessClaim(data, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response; 
        }

        this.logService.info('primary validations are done.');
        //// check and perform validations & create accordingly
        //// get claim info 
        const claimResponse = await this.getClaimInfo({_id: data._id}, currentUser);
        if(isEmpty(claimResponse.result) || !isEmpty(claimResponse.errors)){
            this.logService.info('Given claim info does not exist.');
            response.errors.exception = 'Given claim info does not exist.';
            return response;
        }
        let fetchedClaim = claimResponse.result;
        if(!currentUser.isAdmin){
            this.logService.info('User is not allowed to submit process this claim.');
            response.errors.exception = 'User is not allowed to submit process this claim.';
            return response; 
        }
        if(fetchedClaim.status !== constants.claimStatus_inreview &&
            fetchedClaim.status !== constants.claimStatus_review_complete){
            this.logService.info('this claim is not in a state for processing. ');
            response.errors.exception = 'this claim is not in a state for processing.';
            return response; 
        }

        this.logService.info('secondary validations are done.');

        let updateInfo =  {};

        //// change the claim status based on the reviewer's statuses.
        updateInfo = {
            'status' : data.status,
            'closingRemarks' : data.closingRemarks,
            'approvedAmount' : data.approvedAmount
        };

        //// update claim details to db
        return ClaimModel.updateOne({_id: data._id}, { "$set": updateInfo })
        .then(async (updated) => {
                response.result = { _id: data._id, action: "updated" };
                this.logService.info('the claim is updated with the review remarks.', response.result);

                if(data.status === constants.claimStatus_approved){
                    //// disburse the amount - call rapyd api
                    await this.handleDisbursal(updated, currentUser);
                }
                //// return result
                return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in reviewClaim operation.', err);
            response.errors.exception = "Error occurred in reviewClaim operation. Could not save for unknown reasons.";
            return response;
        });
    }

    //// process Claim disbursal method - INTERNAL method
    async handleDisbursal(claimData, currentUser) {

        let insuranceId = claimData.insuranceId._id;
        let holderId = claimData.insuranceId.holderId;
        let payee = {};

        const userInfoResponse = await this.userService.getUserPaymentInfo({_id: holderId}, currentUser);
        if(isEmpty(userInfoResponse.result) || !isEmpty(userInfoResponse.errors)){
            this.logService.info('Given user with payment info does not exist.');
            response.errors.exception = 'Given user with payment info does not exist.';
            return response;
        }
        let fetchedHolderInfo = userInfoResponse.result;

        //// decide the payee
        if(claimData.claimType === constants.claimType_life){
            //// pay the nominee for life claims.
            //// get the nominee payment information.
            const nomineeInfoResponse = await this.userService.getUserPaymentInfo({ _id: fetchedHolderInfo.nomineeInfo.userId }, currentUser);
            if(isEmpty(nomineeInfoResponse.result) || !isEmpty(nomineeInfoResponse.errors)){
                this.logService.info('Given nominee user with payment info does not exist.');
                response.errors.exception = 'Given nominee user with payment info does not exist.';
                return response;
            }
            payee = nomineeInfoResponse.result;

            this.logService.info('nominee is the payee.', { payee: payee});
        }
        if(claimData.claimType === constants.claimType_medical){
            //// pay the holder for medical claims
            payee = fetchedHolderInfo;
            this.logService.info('holder is the payee.', { payee: payee});
        }

        //// Decide the payout mode
        let payoutMethodType = "";
        let beneficiary_id = "";

        if(payee.paymentMethodInfo.rapydCardBeneficiaryId != null
            && payee.paymentMethodInfo.rapydCardBeneficiaryId != ''){
                payoutMethodType = payee.paymentMethodInfo.rapydCardPayoutMethod;
                beneficiary_id = payee.paymentMethodInfo.rapydCardBeneficiaryId;
        }
        if(payee.paymentMethodInfo.rapydBankBeneficiaryId != null
            && payee.paymentMethodInfo.rapydBankBeneficiaryId != ''){
                payoutMethodType = payee.paymentMethodInfo.rapydBankPayoutMethod;
                beneficiary_id = payee.paymentMethodInfo.rapydBankBeneficiaryId;
        }

        //// create the payout
        let payoutData = {
            amount : claimData.approvedAmount.toFixed(2),
            payoutMethodType : payoutMethodType,
            beneficiary_id : beneficiary_id,
            description : "DISBURSAL/CLAIM/" + claimData.friendlyId,
            country : null, //// leaving this empty since SANDBOX wont support IN / INR
            currency: null //// leaving this empty since SANDBOX wont support IN / INR
        };

        //// call create payout 
        await this.createPayout(payoutData, currentUser);

    }

    //// process Claim disbursal method - INTERNAL method
    async handleReviewPayment(claimData, currentUser) {

        let payee = {};

        const reviewerInfoResponse = await this.userService.getUserPaymentInfo({_id: currentUser._id}, currentUser);
        if(isEmpty(reviewerInfoResponse.result) || !isEmpty(reviewerInfoResponse.errors)){
            this.logService.info('Given user with payment info does not exist.');
            response.errors.exception = 'Given user with payment info does not exist.';
            return response;
        }
        payee = reviewerInfoResponse.result;
        let review_fee = 0.0;

        //// decide the payee
        if(claimData.claimType === constants.claimType_life){
            review_fee = constants.rapydConstants.review_fee_lifeClaim;
        }
        if(claimData.claimType === constants.claimType_medical){
            review_fee = constants.rapydConstants.review_fee_medicalClaim;
        }

        //// Decide the payout mode
        let payoutMethodType = "";
        let beneficiary_id = "";

        if(payee.paymentMethodInfo.rapydCardBeneficiaryId != null
            && payee.paymentMethodInfo.rapydCardBeneficiaryId != ''){
                payoutMethodType = payee.paymentMethodInfo.rapydCardPayoutMethod;
                beneficiary_id = payee.paymentMethodInfo.rapydCardBeneficiaryId;
        }
        if(payee.paymentMethodInfo.rapydBankBeneficiaryId != null
            && payee.paymentMethodInfo.rapydBankBeneficiaryId != ''){
                payoutMethodType = payee.paymentMethodInfo.rapydBankPayoutMethod;
                beneficiary_id = payee.paymentMethodInfo.rapydBankBeneficiaryId;
        }

        //// create the payout
        let payoutData = {
            amount : review_fee.toFixed(2),
            payoutMethodType : payoutMethodType,
            beneficiary_id : beneficiary_id,
            description : "REVIEW_FEE/CLAIM/" + claimData.friendlyId,
            country : null, //// leaving this empty since SANDBOX wont support IN / INR
            currency: null //// leaving this empty since SANDBOX wont support IN / INR
        };

        //// call create payout 
        await this.createPayout(payoutData, currentUser);
    }

    //// adds claim documents
    async uploadDocuments(reqBody, currentUser) {

        this.logService.info('entered uploadDocuments in claimService.', {reqBody: reqBody  });

        let response = { errors: {}, result: null };

        let claimId = reqBody.claimId;
        let documentName = reqBody.fileKey;

        this.logService.info('uploaded documents info : ', {claimId: claimId, documentName: documentName});

        let updateInfo =  {};
        let document = { name: documentName, type : reqBody.documentType? reqBody.documentType : ""};
        //// change the claim status based on the reviewer's statuses.
        updateInfo = {
            $push: { documents: document }
        };

        //// update claim details to db
        return ClaimModel.updateOne({_id: claimId}, updateInfo)
        .then(async (updated) => {
                response.result = { _id: reqBody.claimId, action: "updated", documentName: documentName };
                this.logService.info('the claim is updated with the document details.', response.result);
                //// return result
                return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in reviewClaim operation.', err);
            response.errors.exception = "Error occurred in uploadDocuments operation. Could not save for unknown reasons.";
            return response;
        });
    }

    //// gets the list of claim documents
    async getDocuments(claimData, currentUser) {
        this.logService.info('entered uploadDocuments in claimService.', {claimData: claimData});

        let response = { errors: {}, result: null };

        if(isEmpty(claimData)
        || !claimData.claimId
        || isEmpty(claimData.claimId)){
            this.logService.info('Claim Id is required for gettin documents.');
            response.errors.exception = "Claim Id is required for gettin documents.";
            return response;
        }

        //// TODO: validate if the user is related to claim Info -- holder, raisedBy, reviwers, admin.

        let claimId = claimData.claimId;

        //// update claim details to db
        return ClaimModel.findOne({_id: claimId})
        .then((claim) => {
                if(!claim){
                    this.logService.info('the claim is not found.', {_id: claimId});
                    response.errors.exception = "the claim is not found.";
                    return response;
                }
                response.result = claim.documents;
                this.logService.info('the claim is fetched with the document details.', response.result);
                //// return result
                return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in getDocuments operation.', err);
            response.errors.exception = "Error occurred in getDocuments operation.";
            return response;
        });
    }

    //// get the claim document
    async getDocument(claimData, currentUser) {

        this.logService.info('entered getDocument in claimService.', {claimData: claimData});
        //// call document service
        let response = { errors: {}, result: null };

        if(isEmpty(claimData)
        || !claimData.documentName
        || isEmpty(claimData.documentName)){
            this.logService.info('Document Name is required.');
            response.errors.exception = "Document Name is required.";
            return response;
        }

        //// TODO: validate if the user is related to claim Info -- holder, raisedBy, reviwers, admin.

        var params = {
            Key: claimData.documentName,
            Bucket: configuration.awsConfig.bucketName
        };

        return s3.getObject(params).promise().then((data) =>{
            if(data.Body){
                response.result =  data.Body;
                this.logService.info('the claim document is fetched from the s3 bucket.');
                return response;
            }
            return response;

        }).catch((err) => {
            this.logService.error('Error occurred in getDocument operation.', err);
            response.errors.exception = "Error occurred in getDocument operation.";
            return response;
        });
    }

    //// deletes the claim document
    async deleteDocument(claimData, currentUser) {
        //// call document service
        return { errors: {}, result: null };
    }
};


module.exports = ClaimService;