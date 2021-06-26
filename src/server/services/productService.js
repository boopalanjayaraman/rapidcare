const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const InsuranceProductModel = require("../models/insuranceproduct");
//// load validations
const { validateGetProducts } = require("../validation/productValidation");

const isEmpty = require("is-empty");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");


class ProductService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);

    }


    //// getProducts method
    async getProducts(criteria, currentUser){

        this.logService.info('ProductService - entered getProducts operation', { info: criteria });
        
        //// perform form validation
        let { errors, isValid } = validateGetProducts(criteria, currentUser);
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
        return InsuranceProductModel.find(query)
        .sort({ friendlyId : 'asc'})
        .limit(limit)
        .then(prods => {
            if(!prods){
                response.errors.exception = "Products information not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            response.result = prods;
            this.logService.info('Products info is fetched.', {count: response.result.length});
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get products info for unknown reasons.";
            this.logService.error('Runtime Error occurred during get products op.', { ...err, currentUser: currentUser});
            return response;
        });
    }


    getQueryForScenario(criteria, currentUser){
        let query = {};
        let lastFriendlyId = criteria.lastFriendlyId ? criteria.lastFriendlyId : 0;
        let country = criteria.country ? criteria.country : "in"; // default IN.

        if(criteria.scenario === constants.scenario_browseProducts){
            query = {
                    $and : [
                            { 
                                "country" : country
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

};

module.exports = ProductService;