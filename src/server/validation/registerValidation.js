const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");

module.exports = function validateRegisterInput(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data.username = isEmpty(data.username) ? "" : data.username;
    data.loginId = isEmpty(data.loginId) ? "" : data.loginId;
    data.password = isEmpty(data.password) ? "" : data.password;
    data.password2 = isEmpty(data.password2) ? "" : data.password2;
    data.userType =  isEmpty(data.userType) ? "" : data.userType;
    data.socialSecurityNumber =  isEmpty(data.socialSecurityNumber) ? "" : data.socialSecurityNumber;
    data.dateOfBirth =  isEmpty(data.dateOfBirth) ? "" : String(data.dateOfBirth);

    //// perform validations
    if(Validator.isEmpty(data.username)){
        errors.username = "UserName field is required.";
    }

    if(Validator.isEmpty(data.loginId)){
        errors.loginId = "LoginId (Email) field is required.";
    }
    else if(!Validator.isEmail(data.loginId)){
        errors.loginId = "Invalid LoginId (Email) value.";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required.";
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password field is required.";
    }

    if(!Validator.isLength(data.password, {min:8, max:20})){
        errors.password = "Password must contain at least 8 characters, and should be less than 20 characters.";
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match."
    }

    if(Validator.isEmpty(data.socialSecurityNumber)){
        errors.socialSecurityNumber = "social Security Number field is required.";
    }

    if(Validator.isEmpty(data.dateOfBirth)){
        errors.dateOfBirth = "date Of Birth field is required.";
    }


    //// strong password check. isStrongPassword method has a bug for "@" symbol.
    //// Min 1 upper case, 1 lower case, 1 number, 8 characters policy.
    if(!Validator.matches(data.password, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.~_+]).{8,}$")){
        errors.password = "Password is not strong enough. [Should have a minimum length of 8 characters and contain minimum 1 upper case letter, 1 lower case letter, 1 number, and 1 symbol.]";
    }

    if(Validator.isEmpty(data.userType)){
        errors.userType = "User Type field is required.";
    }

    if(!Validator.equals(data.userType, constants.userType_individual)
     && !Validator.equals(data.userType, constants.userType_business)
     && !Validator.equals(data.userType, constants.userType_partnerdoctor)) {
        errors.userType = "Invalid userType.";
    } 

    return {
        errors,
        isValid: isEmpty(errors)
    };

};