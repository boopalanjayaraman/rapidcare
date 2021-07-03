const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const InsuranceOrderModel = require("../models/insuranceorder");
const PolicyInfoModel = require("../models/policyinfo");
//// load validations
const { validateGetInsuranceInfo, validateGetInsurances, validateBuyInsurance, 
        validateUpdatePaymentStatus, validateGetCheckoutUrl } = require("../validation/orderValidation");

const isEmpty = require("is-empty");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");

const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const axios = require("axios");

class InsuranceService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);
        
    }


    //// getInsuranceInfo method
    async getInsuranceInfo(data, currentUser){

        this.logService.info('InsuranceService - entered getInsuranceInfo operation', { info: data });
        
        //// perform form validation
        let { errors, isValid } = validateGetInsuranceInfo(data, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary validations are done.');

        //// find returns a promise so returning it - this is an async method.
        return InsuranceOrderModel.findById(data._id)
        .sort({ friendlyId : 'asc'})
        .then(order => {
            if(!order){
                response.errors.exception = "insurance order information is not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            response.result = order;
            this.logService.info('insurance order info is fetched.', { _id: order._id });
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get insurance info for unknown reasons.";
            this.logService.error('Runtime Error occurred during get insurance op.', { ...err, currentUser: currentUser});
            return response;
        });
    }

    //// getInsurances method
    async getInsurances(criteria, currentUser){

        this.logService.info('InsuranceService - entered getInsurances operation', { info: criteria });
        
        //// perform form validation
        let { errors, isValid } = validateGetInsurances(criteria, currentUser);
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
        return InsuranceOrderModel.find(query)
        .populate('ownerId', this.getUserProjectionArray())
        .populate('holderId', this.getUserProjectionArray())
        .populate('policyProduct')
        .populate('policyInfo')
        .sort({ createdDate : 'desc'})
        .limit(limit)
        .then(insurances => {
            if(!insurances){
                response.errors.exception = "insurances information not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            response.result = insurances;
            this.logService.info('insurances info is fetched.', {count: response.result.length});
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get insurances for unknown reasons.";
            this.logService.error('Runtime Error occurred during get insurances op.', { ...err, currentUser: currentUser});
            return response;
        });
    }


    getQueryForScenario(criteria, currentUser){
        let query = {};
        let lastFriendlyId = criteria.lastFriendlyId ? criteria.lastFriendlyId : Infinity;

        if(criteria.scenario === constants.scenario_getUserInsurances){
            query = {
                    $and : [
                            { 
                                $or : [
                                    {
                                        ownerId : currentUser.id
                                    },
                                    {
                                        holderId : currentUser.id
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

    //// buyInsurance method
    async buyInsurance(data, currentUser) {

        this.logService.info('entered buyInsurance in InsuranceService.', {title: data.title});
        //// perform form validation
        let { errors, isValid } = validateBuyInsurance(data);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary validations are done.');
        //// check opportunity type and perform validations & create accordingly

        let friendlyId = await this.idCounterService.getNewId(constants.idCounter_insuranceorders);
        if(friendlyId == -1){
            throw "Could not generate a new friendly Id for insurance order.";
        }

        let friendlyIdPolicyInfo = await this.idCounterService.getNewId(constants.idCounter_policyinfos);
        if(friendlyIdPolicyInfo == -1){
            throw "Could not generate a new friendly Id for PolicyInfo.";
        }

        var newPolicyInfo = new PolicyInfoModel({
            _id: new mongoose.Types.ObjectId(),
            friendlyId: friendlyIdPolicyInfo,
            holderInfo : {
                name : data.holderInfo.name,
                dateOfBirth : data.holderInfo.dateOfBirth,
                socialSecurityNumber : data.holderInfo.socialSecurityNumber,
                userId : data.holderInfo._id
            },
            healthDeclarationInfo : {
                overweight: data.healthDeclarationInfo.overweight,
                ped :  data.healthDeclarationInfo.ped,
                ped2 :  data.healthDeclarationInfo.ped2,
                smoking :  data.healthDeclarationInfo.smoking,
                alcoholic :  data.healthDeclarationInfo.alcoholic,
                undergoneProcedure :  data.healthDeclarationInfo.undergoneProcedure
            }
        });


        return newPolicyInfo.save()
        .then(policyInfo => {

                var newInsuranceOrder = new InsuranceOrderModel({
                    _id: new mongoose.Types.ObjectId(),
                    ownerId: currentUser.id.toString(),
                    friendlyId: friendlyId,
                    createdDate: Date.now(),
                    holderId : data.holderInfo._id,
                    policyProduct: data.policyProduct,
                    sumAssured : data.sumAssured,
                    policyPrice: data.policyPrice,
                    riskFactor : data.riskFactor,
                    premiumInterval: data.premiumInterval,
                    currentStartDate: data.currentStartDate,
                    currentEndDate: data.currentEndDate,
                    isRenewed: data.isRenewed,
                    autoRenew: data.autoRenew,
                    country: data.country,
                    currency: data.currency,
                    status: "new",
                    paymentStatus: "pending",
                    policyInfo: policyInfo._id // generated id.
                });

                //// save the newInsuranceOrder details to db
                return newInsuranceOrder.save()
                .then(insurance => {
                    response.result = { _id: insurance._id, action: "created", 
                                        insuranceData : insurance,
                                        policyInfoData : policyInfo
                                     };

                    //// async - TODO: mail the owner confirmation.
                    this.logService.info('new insurance order is created.', response.result);
                    //// return result
                    return response;
                })
                .catch(err => {
                    this.logService.error('Error occurred in buyInsurance operation.', err);
                    response.errors.exception = "Error occurred in buyInsurance (insurance order) operation. Could not save for unknown reasons.";
                    return response;
                });
        })
        .catch(err => {
            this.logService.error('Error occurred in buyInsurance (policyInfo) operation.', err);
            response.errors.exception = "Error occurred in buyInsurance (policyInfo) operation. Could not save for unknown reasons.";
            return response;
        });

        
    }

    //// getInsurancePrice method
    async getInsurancePrice(data, currentUser) {
        
        this.logService.info('entered getInsurancePrice in insuranceService.', {input: data});
        let response = {errors: {}, result: null};

        let param = {};
        param['age'] = data.age ?  Number(data.age) : 41; //median
        param['is_overweight'] = data.no_overweight ? (Number(data.no_overweight) ==1? 0: 1) : 0;
        param['has_ped'] = data.ped ? Number(data.ped) : 0;
        param['has_ped2'] = data.ped2 ? Number(data.ped2) : 0;
        param['is_smoking'] = data.smoking ? Number(data.smoking) : 0;
        param['is_alcoholic'] = data.alcoholic ? Number(data.alcoholic) : 0;
        param['has_undergone_procedure'] = data.undergoneProcedure ? Number(data.undergoneProcedure) : 0;

        let basePrice = data.basePrice ? Number(data.basePrice) : 0;
        
        //// post it to rapyd
        return  axios.get(configuration.UnderwritingAiUrl, {params: param} )
            .then((resp) => {

                this.logService.info('risk factor is fetched.', resp.data);

                let risk_factor_resp = JSON.parse(JSON.stringify(resp.data)); //// this is necessary to get it right.
                response.result = {
                        risk_factor : risk_factor_resp.risk_factor,
                        price: basePrice + (basePrice * risk_factor_resp.risk_factor)
                    };

                this.logService.info('risk factor is fetched and insurance price is calculated.', response.result);
                return response;
            })
            .catch((err) => {
                this.logService.error('Error occurred in getInsurancePrice operation.', err);
                response.errors.exception = "Error occurred in getInsurancePrice operation.";
                return response;
            });

    }

    //// updatePaymentStatus method
    async updatePaymentStatus(data, currentUser) {
        this.logService.info('entered updatePaymentStatus in insuranceService.', {input: data});
        let response = {errors: {}, result: null};

        //// get insurance info 
        const insuranceOrderResponse = await this.getInsuranceInfo({_id: data._id}, currentUser);
        if(isEmpty(insuranceOrderResponse.result) || !isEmpty(insuranceOrderResponse.errors)){
            this.logService.info('Given insurance order does not exist.');
            response.errors.insuranceOrderId = 'Given insurance order does not exist.';
            return response;
        }
        let fetchedInsuranceOrder = insuranceOrderResponse.result;

        let updateInfo = {};
        
        if(data.paymentCompleteToken && (data.paymentCompleteToken === fetchedInsuranceOrder.paymentCompleteToken))
        {
            //// success flow.
            //// Primary account is for claim pool and other things mainly. The flat Service fee of the business is being collected into a separate wallet
            await this.collectInsuranceServiceFee(insuranceOrderResponse.result, currentUser);

            //// collect fee into company service fee wallet.
            updateInfo['$set'] = { paymentStatus : 'success', 
                                    status : 'active', 
                                    sumClaimed : 0.0, 
                                    feeCollected : true
                                };
        }
        else if(data.paymentErrorToken && (data.paymentErrorToken === fetchedInsuranceOrder.paymentErrorToken))
        {
            updateInfo['$set'] = { paymentStatus : 'failure'};
        }
        else{
            response.errors.exception = 'The tokens do not match with the insurance order';
            return response;
        }
        
        return InsuranceOrderModel.updateOne({_id: data._id}, updateInfo)
        .then(order => {
            response.result = { _id: order._id, action: "updated" }; 
            this.logService.info('the insurance order is updated with payment status.', response.result);
            //// return result
            return response;
        })
        .catch(err => {
            this.logService.error('Error occurred.', err);
            response.errors.exception = "Error occurred. Could not update payment status for unknown reasons.";
            return response;
        });
    }

    //// this is internal method and should not be exposed publicly
    async collectInsuranceServiceFee(data, currentUser) {

        this.logService.info('entered collectInsuranceServiceFee in insuranceService.', {input: data});

        let response = {errors: {}, result: null};

        if(data.feeCollected !== true){

            //// get the basic configurations
            var http_method = constants.rapydConstants.http_post_method;               
            var account_transfer_url_path = constants.rapydConstants.http_account_transfer_url;
            var full_post_url = configuration.rapydConfig.sandbox_base_url + account_transfer_url_path;

            var salt =  crypto.randomBytes(12).toString("hex");   
            var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();

            var access_key = configuration.rapydConfig.access_key;     
            var secret_key = configuration.rapydConfig.secret_key;  
            var body = '';  

            let service_fee = (data.policyPrice * constants.rapydConstants.service_fee).toFixed(2);

            //// form the request body
            var request_data = {
                amount : service_fee,
                currency : data.currency ? data.currency.toUpperCase() : "USD",
                source_ewallet : configuration.rapydConfig.primary_account_wallet,
                destination_ewallet : configuration.rapydConfig.service_fee_wallet
            };

            this.logService.info('account transfer -  request_data.', {request_data: request_data});

            //// generate signature
            body = JSON.stringify(request_data);
            var to_sign = http_method + account_transfer_url_path + salt + timestamp + access_key + secret_key + body;

            var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
            signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

            const headers = {
                'content-Type': 'application/json',
                'access_key' : access_key,
                'salt' : salt,
                'timestamp' : timestamp,
                'signature' : signature,
                'idempotency' : 'ser_fee_' + data._id
            };

            this.logService.info('account transfer -  headers.', {headers: headers});

            //// post it to rapyd
            return  axios.post(full_post_url, request_data, {headers : headers})
                .then(async (resp) => {
                    response.result = { transaction_id : resp.data.data.id };

                    this.logService.info('account transfer -  response.', {resp: resp.data});
                    this.logService.info('initiating account transer accept response.');

                    //// accept the transfer with the id.
                    await this.acceptInternalTransfer(response.result, currentUser);

                    this.logService.info('account transfer is done.', response.result);
                    return response;
                })
                .catch((err) => {
                    this.logService.error('Error occurred in collectInsuranceServiceFee operation.', err);
                    response.errors.exception = "Error occurred in collectInsuranceServiceFee operation.";
                    return response;
                });
        }
        else{
            this.logService.info('Service fee has been already collected. And hence skipping this transaction.');
        }
    }

    async acceptInternalTransfer(data, currentUser) {

        this.logService.info('entered acceptInternalTransfer in insuranceService.', {input: data});

        let response = {errors: {}, result: null};

        //// get the basic configurations
        var http_method = constants.rapydConstants.http_post_method;               
        var account_transfer_response_url_path = constants.rapydConstants.http_account_transfer_response_url;
        var full_post_url = configuration.rapydConfig.sandbox_base_url + account_transfer_response_url_path;

        var salt =  crypto.randomBytes(12).toString("hex");   
        var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();

        var access_key = configuration.rapydConfig.access_key;     
        var secret_key = configuration.rapydConfig.secret_key;  
        var body = '';  

        //// form the request body
        var request_data = {
            id : data.transaction_id,
            status : "accept"
        };

        this.logService.info('account transfer - accept response -  request_data.', {request_data: request_data});

        //// generate signature
        body = JSON.stringify(request_data);
        var to_sign = http_method + account_transfer_response_url_path + salt + timestamp + access_key + secret_key + body;

        var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

        const headers = {
            'content-Type': 'application/json',
            'access_key' : access_key,
            'salt' : salt,
            'timestamp' : timestamp,
            'signature' : signature
        };

        this.logService.info('account transfer accept response -  headers.', {headers: headers});

        //// post it to rapyd
        return  axios.post(full_post_url, request_data, {headers : headers})
            .then((resp) => {
                response.result = { status: resp.status, transaction_data : resp.data.data };

                this.logService.info('account transfer accepting response is done.', response.result);
                return response;
            })
            .catch((err) => {
                this.logService.error('Error occurred in acceptInternalTransfer operation.', err);
                response.errors.exception = "Error occurred in acceptInternalTransfer operation.";
                return response;
            });
        
    }

    //// getCheckoutUrl method
    async getCheckoutUrl(data, currentUser) {

        let response = {errors: {}, result: null};


        //// get the basic configurations
        var http_method = constants.rapydConstants.http_post_method;               
        var checkout_url_path = constants.rapydConstants.http_checkout_url;
        var full_post_url = configuration.rapydConfig.sandbox_base_url + checkout_url_path;

        var salt =  crypto.randomBytes(12).toString("hex");   
        var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();

        var access_key = configuration.rapydConfig.access_key;     
        var secret_key = configuration.rapydConfig.secret_key;  
        var body = '';   

        //// generate unique urls
        var transactionCompletionUniqueId = crypto.randomBytes(16).toString("hex");
        var transactionErrorUniqueId = crypto.randomBytes(16).toString("hex");
        var transactionCompletionPage = data.insuranceOrderId + "/" + transactionCompletionUniqueId;
        var transactionCompletionUrl = configuration.rapydConfig.completionPage_base_url + "/" + transactionCompletionPage;
        var transactionErrorPage =  data.insuranceOrderId + "/" + transactionErrorUniqueId;
        var errorPage_Url = configuration.rapydConfig.errorPage_base_url + "/" + transactionErrorPage;

        //// update the order with payment tokens for verifying.
        let updateInfo = {
            insuranceOrderId: data.insuranceOrderId,
            transactionCompletionUniqueId: transactionCompletionUniqueId,
            transactionErrorUniqueId: transactionErrorUniqueId
        };
        try{
            this.updateInsuranceOrderForPaymentTokens(updateInfo);
        }
        catch(error){
            this.logService.error('Error occurred in updating insurance order for payment url tokens.', err);
        }
        

        //// form the request body
        var request_data = {
            amount : data.amount,
            complete_payment_url : transactionCompletionUrl,
            country :  data.country ? data.country.toUpperCase() : "US", 
            currency : data.currency ? data.currency.toUpperCase() : "USD",
            error_payment_url : errorPage_Url,
            merchant_reference_id : data.referenceId,
            cardholder_preferred_currency: true,
            language: "en",  
            metadata: {
                merchant_defined: true
            },
             
            payment_method_type_categories : data.country ? 
                                            constants.rapydConstants.paymentTypeCategories[data.country.toLowerCase()] : 
                                            constants.rapydConstants.paymentTypeCategories['us'],
            payment_method_types_exclude: []
        };

        this.logService.info('getCheckoutUrl -  request_data.', {request_data: request_data});

        //// generate signature
        body = JSON.stringify(request_data);
        var to_sign = http_method + checkout_url_path + salt + timestamp + access_key + secret_key + body;

        var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

        const headers = {
            'content-Type': 'application/json',
            'access_key' : access_key,
            'salt' : salt,
            'timestamp' : timestamp,
            'signature' : signature
        };

        this.logService.info('getCheckoutUrl -  headers.', {headers: headers});

        //// post it to rapyd
        return  axios.post(full_post_url, request_data, {headers : headers})
            .then((resp) => {
                response.result = { checkout_url : resp.data.data.redirect_url };

                this.logService.info('getCheckoutUrl is created.', response.result);
                return response;
            })
            .catch((err) => {
                this.logService.error('Error occurred in getCheckoutUrl operation.', err);
                response.errors.exception = "Error occurred in getCheckoutUrl operation.";
                return response;
            });
    }

    //// this is internal method and should not be exposed publicly
    async updateInsuranceOrderForPaymentTokens(data){
        this.logService.info('entered updateInsuranceOrderForPaymentTokens in InsuranceService.', {input: data});

        let response = {errors: {}, result: null};

        let updateInfo = {};
        updateInfo['$set'] = { paymentCompleteToken : data.transactionCompletionUniqueId, 
                                    paymentErrorToken: data.transactionErrorUniqueId };

        return InsuranceOrderModel.updateOne({_id: data.insuranceOrderId}, updateInfo)
        .then(order => {
            response.result = { _id: order._id, action: "updated" }; 
            this.logService.info('the insurance order is updated with payment tokens.', response.result);
            //// return result
            return response;
        })
        .catch(err => {
            this.logService.error('Error occurred.', err);
            response.errors.exception = "Error occurred. Could not update for unknown reasons.";
            return response;
        });
    }

};

module.exports = InsuranceService;