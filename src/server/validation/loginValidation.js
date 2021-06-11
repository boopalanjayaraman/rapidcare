const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data){
    // initialize errors object
    let errors = {};

    // convert empty objects into empty strings
    data.loginId = isEmpty(data.loginId)? "" : data.loginId;
    data.password = isEmpty(data.password)? "" : data.password;

    // perform validations
    if(Validator.isEmpty(data.loginId)){
        errors.loginId = "Login Id (e-mail) field is required.";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};