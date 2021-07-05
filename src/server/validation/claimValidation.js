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
    let claimRelationship = isEmpty(data.claimRelationship)? "" : data.claimRelationship;
    let claimType = isEmpty(data.claimType)? "" : data.claimType;
    let claimAmount = isEmpty(data.claimAmount)? "" : String(data.claimAmount);
    let holderInfo = isEmpty(data.holderInfo)? "" : data.holderInfo;
    let holderId = isEmpty(data.holderInfo._id)? "" : data.holderInfo._id;
    let insuranceOrderId = isEmpty(data.insuranceOrderId)? "" : data.insuranceOrderId;
    let dateOfOccurrence = isEmpty(data.dateOfOccurrence)? "" : String(data.dateOfOccurrence);

    //// perform required field validations
    if(Validator.isEmpty(claimAmount)){
        errors.exception = "claim Amount field is required for raising a claim.";
    }

    if(Validator.isEmpty(claimType)){
        errors.claimType = "claimType field is required for raising a claim.";
    }

    if(claimType !== constants.claimType_medical
        && claimType !== constants.claimType_life){
            errors.claimType = "Invalid value for claim type.";
    }

    if(Validator.isEmpty(claimRelationship)){
        errors.claimRelationship = "claim Relationship field is required for raising a claim.";
    }

    if(claimRelationship !== constants.claimRelationship_self
        && claimRelationship !== constants.claimRelationship_nominee
        && claimRelationship !== constants.claimRelationship_partnerdoctor){
            errors.claimRelationship = "Invalid value for claim relationship.";
    }

    if((claimRelationship === constants.claimRelationship_partnerdoctor)
        && (currentUser.isPartnerDoctor === false || currentUser.isPartnerDoctor === undefined)){
            errors.claimRelationship = "Invalid value for claim relationship. User is not a partner doctor.";
    }

     
    if(Validator.isEmpty(dateOfOccurrence)){
        errors.exception = "dateOfOccurrence field is required for raising a claim.";
    }

    if(Validator.isEmpty(insuranceOrderId)){
        errors.exception = "insuranceOrderId field is required for raising a claim.";
    }
    
    if(isEmpty(data.holderInfo)){
        errors.exception = "holderInfo field is required for raising a claim.";
    }
 
    if(Validator.isEmpty(holderId)){
        errors.exception = "holderId field is required for raising a claim.";
    }

    if(claimType === constants.claimType_life
        && holderId === currentUser._id){
            errors.exception = "policy holder cannot raise a life claim. (A nominee or a partner doctor can).";
    } 

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = { validateCreatePayout, validateGetClaims, validateGetClaimInfo, validateRaiseClaim };