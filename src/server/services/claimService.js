const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const ClaimModel = require("../models/claim");

//// load validations
const { validateCreatePayout, validateGetClaims, validateGetClaimInfo, validateRaiseClaim } = require("../validation/claimValidation");

const isEmpty = require("is-empty");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");
const UserService = require("./userService");

const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const axios = require("axios");


class ClaimService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);
        this.userService = container.get(UserService);
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
                                        status : "initiated"
                                    },
                                    {
                                        status : "in-review"
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
        let { errors, isValid } = validateRaiseClaim(data);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary validations are done.');
        //// check and perform validations & create accordingly

        let friendlyId = await this.idCounterService.getNewId(constants.idCounter_claims);
        if(friendlyId == -1){
            throw "Could not generate a new friendly Id for claim.";
        }

        //// get two random partner doctor ids.
        const randomDoctorsResponse = await this.userService.getRandomPartnerDoctors(currentUser);
        if(isEmpty(randomDoctorsResponse.result) || !isEmpty(randomDoctorsResponse.errors)){
            this.logService.info('Could not assign reviewers temporarily. Please try again later / contact administrator.');
            response.errors.exception = 'Could not assign reviewers temporarily. Please try again later / contact administrator.';
            return response;
        }
        let randomDoctors = randomDoctorsResponse.result;

        //// create the claim and assign the reviewer doctors automatically.

        var newClaim = new ClaimModel({
            _id: new mongoose.Types.ObjectId(),
            friendlyId: friendlyId,
            raisedOn: Date.now(),
            holderId : data.holderInfo._id,
            insuranceId: data.insuranceId,
            claimType : data.claimType,
            status: "initiated",
            raisedBy : currentUser._id,
            isNominee: data.isNominee,
            isPartnerDoctor: data.isPartnerDoctor,
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
};

module.exports = ClaimService;