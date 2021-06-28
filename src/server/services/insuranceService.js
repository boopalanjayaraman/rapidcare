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
                age: data.holderInfo.age,
                socialSecurityNumber : data.holderInfo.socialSecurityNumber,
                contactPhoneNumber: data.holderInfo.contactPhoneNumber,
                userId : data.holderInfo.userId
            },
            healthDeclarationInfo : {
                rightAge: data.healthDeclarationInfo.rightAge,
                ped :  data.healthDeclarationInfo.ped,
                smoking :  data.healthDeclarationInfo.smoking,
                drinking :  data.healthDeclarationInfo.drinking,
                previouslyInsured :  data.healthDeclarationInfo.previouslyInsured,
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
                    holderId : data.holderId,
                    policyProduct: data.policyProduct,
                    sumAssured : data.sumAssured,
                    policyCost: data.policyCost,
                    premiumInterval: data.premiumInterval,
                    currentStartDate: data.currentStartDate,
                    currentEndDate: data.currentEndDate,
                    isRenewed: data.isRenewed,
                    status: "new",
                    paymentStatus: "pending",
                    policyInfo: policyInfo._id // generated id.
                });

                //// save the newInsuranceOrder details to db
                return newInsuranceOrder.save()
                .then(insurance => {
                    response.result = { _id: insurance._id, action: "created" };

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

    //// updatePaymentStatus method
    async updatePaymentStatus(data, currentUser) {
        //TODO: implement this method
        return "";
    }

    //// getCheckoutUrl method
    async getCheckoutUrl(data, currentUser) {
        //TODO: implement this method
        return "";
    }

};

module.exports = InsuranceService;