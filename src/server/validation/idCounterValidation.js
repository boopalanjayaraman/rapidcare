const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");

module.exports = function validateIdCounterInput(modelId){
    // initialize errors object
    let errors = {};

    // convert empty objects into empty strings
    modelId = isEmpty(modelId)? "" : modelId;

    // perform validations
    if(Validator.isEmpty(modelId)){
        errors._id = "_id field is required.";
    }

    if(!Validator.equals(modelId, constants.idCounter_users)
       && !Validator.equals(modelId, constants.idCounter_businesses) 
       && !Validator.equals(modelId, constants.idCounter_claims) 
       && !Validator.equals(modelId, constants.idCounter_documents) 
       && !Validator.equals(modelId, constants.idCounter_insuranceorders) 
       && !Validator.equals(modelId, constants.idCounter_insuranceproducts) 
       && !Validator.equals(modelId, constants.idCounter_nominees) 
       && !Validator.equals(modelId, constants.idCounter_policyinfos)
       && !Validator.equals(modelId, constants.idCounter_products)){
        errors._id = "Invalid _id field for IdCounter."
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};