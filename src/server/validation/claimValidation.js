const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");

function validateClaim(data, currentUser){
    // initialize errors object
    let errors = {};

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

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

module.exports = { validateClaim, validateCreatePayout };