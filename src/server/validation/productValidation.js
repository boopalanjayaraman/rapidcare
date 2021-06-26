const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");

function validateGetProducts(criteria, currentUser){
    // initialize errors object
    let errors = {};

    // for now no validations
    let scenario =  isEmpty(criteria.scenario)? "" : criteria.scenario;

    //// perform required field validations
    if(Validator.isEmpty(scenario)){
        errors.exception = "scenario field is required for getting products.";
    }
    else if(scenario !== constants.scenario_browseProducts) {
        errors.exception = 'Invalid scenario value';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}


module.exports = { validateGetProducts };