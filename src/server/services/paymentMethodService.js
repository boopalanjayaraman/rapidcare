const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const PaymentMethodModel = require("../models/paymentmethod");

const { validateCreateBeneficiary } = require("../validation/userValidation");
const { validateSavePaymentMethod } = require("../validation/paymentMethodValidation");

const isEmpty = require("is-empty");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");
 
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const axios = require("axios");

class PaymentMethodService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);
    }

    //// create payment method
    //// This is an internal method
    async createPaymentMethod(data, currentUser) {

        this.logService.info('entered createPaymentMethod in PaymentMethodService.', {data: data});
         
        let response = {errors : { }, result: null}; 

        let friendlyId = await this.idCounterService.getNewId(constants.idCounter_paymentmethods);
        if(friendlyId == -1){
            throw "Could not generate a new friendly Id for payment method.";
        }
 
        var newPaymentMethod = new PaymentMethodModel({
            _id: new mongoose.Types.ObjectId(),
            friendlyId: friendlyId,
            createdDate: Date.now(),
        });

        //// save the newPaymentMethod details to db
        return newPaymentMethod.save()
        .then(paymentMethod => {
            response.result = { _id: paymentMethod._id, action: "created", 
                                    paymentMethodData : paymentMethod
                                };

            this.logService.info('new payment method is created.', response.result);
            //// return result
            return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in createPaymentMethod operation.', err);
            response.errors.exception = "Error occurred in createPaymentMethod  operation. Could not save for unknown reasons.";
            return response;
        });
        
    }

    //// create rapyd beneficiary method
    async createBeneficiary(data, currentUser){
        this.logService.info('entered createBeneficiary in paymentMethodService.', {input: data});

        let { errors, isValid } = validateCreateBeneficiary(data);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response; 
        }

        //// get the basic configurations
        let http_method = constants.rapydConstants.http_post_method;               
        let create_beneficiary_url_path = constants.rapydConstants.http_create_beneficiary_url;
        let full_post_url = configuration.rapydConfig.sandbox_base_url + create_beneficiary_url_path;

        let salt =  crypto.randomBytes(12).toString("hex");   
        let timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();

        let access_key = configuration.rapydConfig.access_key;     
        let secret_key = configuration.rapydConfig.secret_key;  
        let body = '';  

        //// form the request body
        let request_data = {
                category : data.category,
                country : data.country ? data.country.toUpperCase() : "US",
                currency : data.currency ? data.currency.toUpperCase() : "USD", 
                entity_type : data.entityType ? data.entityType : "individual",
                first_name : data.firstName,
                last_name : data.lastName,
                payout_method_type : data.payoutMethodType,
            };

        if(data.beneficiaryCategory === constants.rapydConstants.beneficiary_category_card){
            request_data['card_number'] = data.cardNumber;
            request_data['card_expiration_month'] = data.cardExpirationMonth;
            request_data['card_expiration_year'] = data.cardExpirationYear;
        }
        else if(data.beneficiaryCategory === constants.rapydConstants.beneficiary_category_bank){
            request_data['account_number'] = data.accountNumber;
        }

        this.logService.info('create beneficiary -  request_data.', {request_data: request_data});

        //// generate signature
        body = JSON.stringify(request_data);
        let to_sign = http_method + create_beneficiary_url_path + salt + timestamp + access_key + secret_key + body;

        let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

        const headers = {
            'content-Type': 'application/json',
            'access_key' : access_key,
            'salt' : salt,
            'timestamp' : timestamp,
            'signature' : signature
        };

        this.logService.info('create beneficiary -  headers.', {headers: headers});

        //// post it to rapyd
        return  axios.post(full_post_url, request_data, {headers : headers})
            .then((resp) => {
                response.result = { status: resp.status, beneficiary_data : resp.data.data };

                this.logService.info('create beneficiary is done.', response.result);
                return response;
            })
            .catch((err) => {
                this.logService.error('Error occurred in createBeneficiary operation.', err);
                response.errors.exception = "Error occurred in createBeneficiary operation.";
                return response;
            });
    }

    //// save payment method
    async savePaymentMethod(data, currentUser) {

        this.logService.info('entered savePaymentMethod in PaymentMethodService.', {data: data});

        let { errors, isValid } = validateSavePaymentMethod(data);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }
 
        let updateInfo = {};

        if(data.method === constants.payment_method_card){
            data['beneficiaryCategory'] = constants.rapydConstants.beneficiary_category_card;
            data['category'] = constants.rapydConstants.beneficiary_category_card;
            
            const { errors, result } = await this.createBeneficiary(data, currentUser);

            let beneficiary_id = result.beneficiary_data.id;
            updateInfo = {
                rapydCardBeneficiaryId : beneficiary_id,
                rapydCardPayoutMethod : data.payoutMethodType
            };
        }
        else if(data.method === constants.payment_method_bank){
            data['beneficiaryCategory'] = constants.rapydConstants.beneficiary_category_bank;
            data['category'] = constants.rapydConstants.beneficiary_category_bank;

            const { errors, result } = await this.createBeneficiary(data, currentUser);

            let beneficiary_id = result.beneficiary_data.id;
            updateInfo = {
                rapydBankBeneficiaryId : beneficiary_id,
                rapydBankPayoutMethod : data.payoutMethodType
            };
        }
        else if(data.method === 'rapydwallet'){
            updateInfo = {
                rapydWalletId : data.rapydWalletId
            };
        }

        //// save the newPaymentMethod details to db
        return PaymentMethodModel.updateOne({ _id : data._id}, {"$set": updateInfo})
        .then(paymentMethod => {
            response.result = { 
                                _id: paymentMethod._id, 
                                    action: "updated", 
                                    paymentMethodData : paymentMethod
                                };

            this.logService.info('payment method is updated.', response.result);
            //// return result
            return response;
        })
        .catch(err => {
            this.logService.error('Error occurred in savePaymentMethod operation.', err);
            response.errors.exception = "Error occurred in savePaymentMethod  operation. Could not save for unknown reasons.";
            return response;
        });
        
    }

};

module.exports = PaymentMethodService;