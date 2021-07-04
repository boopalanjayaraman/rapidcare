const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");


function validateCreatePayout(data, currentUser){
    // initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    let amount = isEmpty(data.amount) ? "" : String(data.amount);
    let country = isEmpty(data.country) ? "" : data.country;
    let currency = isEmpty(data.currency) ? "" : data.currency;
    let entityType = isEmpty(data.entityType) ? "" : data.entityType;
    let beneficiary_id = isEmpty(data.beneficiary_id) ? "" : data.beneficiary_id;
    let description = isEmpty(data.description) ? "" : data.description;
    let payoutMethodType = isEmpty(data.payoutMethodType) ? "" : data.payoutMethodType;
    
    //// perform validations
    if(Validator.isEmpty(amount)){
        errors.amount = "amount field is required.";
    }
    else if(Validator.isEmpty(country)){
        errors.country = "country field is required.";
    }
    else if(Validator.isEmpty(currency)){
        errors.currency = "currency field is required.";
    }
    else if(Validator.isEmpty(entityType)){
        errors.entityType = "entityType field is required.";
    }
    else if(Validator.isEmpty(beneficiary_id)){
        errors.beneficiary_id = "beneficiary_id field is required.";
    }
    else if(Validator.isEmpty(description)){
        errors.description = "description field is required.";
    }
    else if(Validator.isEmpty(payoutMethodType)){
        errors.payoutMethodType = "payoutMethodType field is required.";
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    };
}


function validateGetClaims(criteria, currentUser){
    // initialize errors object
    let errors = {};

    // for now no validations
    let scenario =  isEmpty(criteria.scenario)? "" : criteria.scenario;

    //// perform required field validations
    if(Validator.isEmpty(scenario)){
        errors.exception = "scenario field is required for getting claims.";
    }
    else if((scenario !== constants.scenario_getUserClaims)
            && (scenario !== constants.scenario_getPendingClaims)) {
        errors.exception = 'Invalid scenario value';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}


function validateGetClaimInfo(data, currentUser){
    // initialize errors object
    let errors = {};

    // for now no validations
    let _id =  isEmpty(data._id)? "" : data._id;

    //// perform required field validations
    if(Validator.isEmpty(_id)){
        errors.exception = "_id field is required for getting a claim info.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}


function validateRaiseClaim(data, currentUser){
    // initialize errors object
    let errors = {};

    // for now no validations
    let sumAssured = isEmpty(data.sumAssured)? "" : String(data.sumAssured);
    let policyPrice = isEmpty(data.policyPrice)? "" : String(data.policyPrice);
    let premiumInterval = isEmpty(data.premiumInterval)? "" : data.premiumInterval;
    let currentStartDate = isEmpty(data.currentStartDate)? "" : data.currentStartDate;
    let currentEndDate = isEmpty(data.currentEndDate)? "" : data.currentEndDate;
    //let holderInfo = isEmpty(data.holderInfo)? "" : data.holderInfo;
    //let healthDeclarationInfo = isEmpty(data.healthDeclarationInfo)? "" : data.healthDeclarationInfo;
    let socialSecurityNumber = isEmpty(data.holderInfo.socialSecurityNumber)? "" : data.holderInfo.socialSecurityNumber;
    let holderId = isEmpty(data.holderInfo._id)? "" : data.holderInfo._id;
    let fullName = isEmpty(data.holderInfo.name)? "" : data.holderInfo.name;

    //// perform required field validations
    if(Validator.isEmpty(sumAssured)){
        errors.exception = "sumAssured field is required for buying an insurance.";
    }

    if(Validator.isEmpty(policyPrice)){
        errors.exception = "policyPrice is required for buying an insurance.";
    }

    if(Validator.isEmpty(premiumInterval)){
        errors.exception = "premiumInterval field is required for buying an insurance.";
    }

    if(Validator.isEmpty(currentStartDate)){
        errors.exception = "currentStartDate field is required for buying an insurance.";
    }

    if(Validator.isEmpty(currentEndDate)){
        errors.exception = "currentEndDate field is required for buying an insurance.";
    }

    
    if(isEmpty(data.holderInfo)){
        errors.exception = "holderInfo field is required for buying an insurance.";
    }

    if(isEmpty(data.healthDeclarationInfo)){
        errors.exception = "healthDeclarationInfo field is required for buying an insurance.";
    }

    if(Validator.isEmpty(socialSecurityNumber)){
        errors.exception = "socialSecurityNumber field is required for buying an insurance.";
    }

    if(Validator.isEmpty(holderId)){
        errors.exception = "holderId field is required for buying an insurance.";
    }

    if(Validator.isEmpty(fullName)){
        errors.fullName = "Name field is required.";
    }

    if(data.healthDeclarationInfo.overweight == null
        || data.healthDeclarationInfo.ped == null
        || data.healthDeclarationInfo.ped2 == null
        || data.healthDeclarationInfo.smoking == null
        || data.healthDeclarationInfo.alcoholic == null
        || data.healthDeclarationInfo.undergoneProcedure == null)
    {
        errors.healthDeclaration = "Health Declarations are required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = { validateCreatePayout, validateGetClaims, validateGetClaimInfo, validateRaiseClaim };