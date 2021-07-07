const Validator = require("validator");
const isEmpty = require("is-empty");
const constants = require("../config/constants");


function validateSavePaymentMethod(data, currentUser){
    // initialize errors object
    let errors = {};

    // for now no validations
    let _id =  isEmpty(data._id)? "" : data._id;
    let method =  isEmpty(data.method)? "" : data.method;
    let payoutMethodType =  isEmpty(data.payoutMethodType)? "" : data.payoutMethodType;
    let firstName =  isEmpty(data.firstName)? "" : data.firstName;
    let lastName =  isEmpty(data.lastName)? "" : data.lastName;

    let cardNumber =  isEmpty(data.cardNumber)? "" : data.cardNumber    ;
    let cardExpirationMonth =  isEmpty(data.cardExpirationMonth)? "" : data.cardExpirationMonth;
    let cardExpirationYear =  isEmpty(data.cardExpirationYear)? "" : data.cardExpirationYear;

    let accountNumber =  isEmpty(data.accountNumber)? "" : data.accountNumber;

    //// perform required field validations
    if(Validator.isEmpty(_id)){
        errors.exception = "_id field is required for saving a payment method.";
    }
    if(Validator.isEmpty(method)){
        errors.exception = "method field is required for saving a payment method.";
    }
    if(Validator.isEmpty(payoutMethodType)){
        errors.exception = "payoutMethodType field is required for saving a payment method.";
    }
    if(Validator.isEmpty(firstName)){
        errors.exception = "firstName field is required for saving a payment method.";
    }
    if(Validator.isEmpty(lastName)){
        errors.exception = "lastName field is required for saving a payment method.";
    }
    
    if(method !== constants.payment_method_card
        && method !== constants.payment_method_bank){
            errors.exception = "invalid value for method.";
    }

    if(method == constants.payment_method_card){
        if(Validator.isEmpty(cardNumber)){
            errors.exception = "cardNumber field is required for saving a payment method.";
        } 
        if(Validator.isEmpty(cardExpirationMonth)){
            errors.exception = "cardExpirationMonth field is required for saving a payment method.";
        } 
        if(Validator.isEmpty(cardExpirationYear)){
            errors.exception = "cardExpirationYear field is required for saving a payment method.";
        }  
    }

    if(method == constants.payment_method_bank){
        if(Validator.isEmpty(accountNumber)){
            errors.exception = "accountNumber field is required for saving a payment method.";
        }    
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = { validateSavePaymentMethod  };