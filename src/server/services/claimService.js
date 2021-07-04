const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const ClaimModel = require("../models/claim");

//// load validations
const { validateCreatePayout } = require("../validation/claimValidation");

const isEmpty = require("is-empty");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");

const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const axios = require("axios");


class ClaimService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);
        
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

};

module.exports = ClaimService;