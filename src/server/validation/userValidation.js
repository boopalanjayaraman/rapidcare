const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");


function validateUpdateUserInput(userData, currentUser, isAdminAction){
    // initialize errors object
    let errors = {};

    if(isEmpty(userData.updateInfo)){
        errors.exception = "updateInfo field is required.";
    }

    //// either same user can update / an admin can do it.
    if(!Validator.equals(userData._id.toString(), currentUser._id.toString())
        && !currentUser.roleInfo.isAdmin){
            errors.exception = "User is not authorized to perform this action.";
    }

    if(isAdminAction
        && !currentUser.roleInfo.isAdmin){ 
            errors.exception = "User is not authorized to perform the administrative action.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

function ValidateEditProfileInput(userData, currentUser){
    let errors = {};

    if(isEmpty(userData.updateInfo)){
        errors.exception = "updateInfo field is required.";
    }

    //// either same user can update / an admin can do it.
    if(!Validator.equals(userData._id.toString(), currentUser._id.toString())
        && !currentUser.roleInfo.isAdmin){
            errors.exception = "User is not authorized to perform this action.";
    }

    let address = isEmpty(userData.profileInfo.address) ? "" : userData.profileInfo.address;
    let zipcode = isEmpty(userData.profileInfo.zipcode) ? "" : userData.profileInfo.zipcode;

    if(Validator.isEmpty(address)){
        errors.address = "address field is required.";
    }
    if(Validator.isEmpty(zipcode)){
        errors.zipcode = "zipcode field is required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

function validateGetUsers(criteria, currentUser){
    // initialize errors object
    let errors = {};

    // for now no validations
    let scenario =  isEmpty(criteria.scenario)? "" : criteria.scenario;

    //// perform required field validations
    if(Validator.isEmpty(scenario)){
        errors.exception = "scenario field is required for getting users.";
    }
    else if(scenario !== constants.scenario_approveUsers) {
        errors.exception = 'Invalid scenario value';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

function validateGetUsersPermissions(criteria, currentUser){
    // initialize errors object
    let errors = {};

    let scenario = criteria.scenario;

    if(scenario === constants.scenario_unlockUsers
            && currentUser.roleInfo.isAdmin == false){
        errors.exception = 'The user is not authorized to perform this (administrative) operation.';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

function validateForgotPassword(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data.email = isEmpty(data.email) ? "" : data.email;
    
    //// perform validations
    if(Validator.isEmpty(data.email)){
        errors.email = "LoginId (Email) field is required.";
    }
    else if(!Validator.isEmail(data.email)){
        errors.email = "Invalid LoginId (Email) value.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

function validateChangePassword(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data.email = isEmpty(data.email) ? "" : data.email;
    data.token1 = isEmpty(data.token1) ? "" : data.token1;
    data.token2 = isEmpty(data.token2) ? "" : data.token2;
    data.password = isEmpty(data.password) ? "" : data.password;
    data.password2 = isEmpty(data.password2) ? "" : data.password2;

    //// perform validations

    if(Validator.isEmpty(data.email)){
        errors.email = "LoginId (Email) field is required.";
    }
    else if(!Validator.isEmail(data.email)){
        errors.email = "Invalid LoginId (Email) value.";
    }

    if(Validator.isEmpty(data.token1)){
        errors.exception = "Token1 field is required to change password.";
    }

    if(Validator.isEmpty(data.token2)){
        errors.exception = "Token2 field is required to change password.";
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

    //// strong password check. isStrongPassword method has a bug for "@" symbol.
    //// Min 1 upper case, 1 lower case, 1 number, 8 characters policy.
    if(!Validator.matches(data.password, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.~_+]).{8,}$")){
        errors.password = "Password is not strong enough. [Should have a minimum length of 8 characters and contain minimum 1 upper case letter, 1 lower case letter, 1 number, and 1 symbol.]";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};


function validateCreateBeneficiary(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    let category = isEmpty(data.category) ? "" : data.category;
    let country = isEmpty(data.country) ? "" : data.country;
    let currency = isEmpty(data.currency) ? "" : data.currency;
    let entityType = isEmpty(data.entityType) ? "" : data.entityType;
    let firstName = isEmpty(data.firstName) ? "" : data.firstName;
    let lastName = isEmpty(data.lastName) ? "" : data.lastName;
    let payoutMethodType = isEmpty(data.payoutMethodType) ? "" : data.payoutMethodType;
    let beneficiaryCategory = isEmpty(data.beneficiaryCategory) ? "" : data.beneficiaryCategory;
    
    //// perform validations
    if(Validator.isEmpty(category)){
        errors.category = "category field is required.";
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
    else if(Validator.isEmpty(firstName)){
        errors.firstName = "firstName field is required.";
    }
    else if(Validator.isEmpty(lastName)){
        errors.lastName = "lastName field is required.";
    }
    else if(Validator.isEmpty(payoutMethodType)){
        errors.payoutMethodType = "payoutMethodType field is required.";
    }
    else if(Validator.isEmpty(beneficiaryCategory)){
        errors.beneficiaryCategory = "beneficiaryCategory field is required.";
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    };


};


module.exports = { validateUpdateUserInput, ValidateEditProfileInput, 
                    validateGetUsers, validateGetUsersPermissions, validateChangePassword, validateForgotPassword,
                    validateCreateBeneficiary };