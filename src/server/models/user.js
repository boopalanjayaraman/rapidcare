const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create user schema
const userSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pwdsalt:{
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    createdDateValue: {
        type: Number //// yyyymmdd
    },
    socialSecurityNumber : {
        type: String
    },
    accountName: {
        type: String,
        default: ''
    },
    roleInfo: {
        isUser: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isPartnerDoctor : {
            type: Boolean,
            default: false
        }
    },
    mailVerified: {
        type: Boolean,
        default: false
    },
    identityVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
      type: Boolean,
      default: true  
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String // individual / business
    },
    mobilePhoneContact: {
        number: {
            type : String,
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        otp: {
            type : String
        },
        expiresBy: {
            type: Date
        },
    },
    profileInfo: {
        title: {
            type: String
        },
        address: {
            type: String
        },
        zipcode: {
            type: String
        },
        photoIdentityInfo: {
            id: {
                type: String
            },
            imageDocumentId: {
                type: mongoose.Schema.Types.ObjectId 
            },
            type: {
                type: String 
            }
        },
        licenseInfo:{
            id: {
                type: String
            },
            imageDocumentId: {
                type: mongoose.Schema.Types.ObjectId 
            },
            type: {
                type: String 
            }
        },
        businessInfo : { 
            businessId: {
                type: mongoose.Schema.Types.ObjectId, 
            }
        }
    },
    pwdResetAttributes: {
        token: {
            type: String,
        },
        token2: {
            type: String,
        },
        expiresBy: {
            type: Date
        },
        generatedOn: {
            type: Date
        },
        generatedOnString: {
            type: String
        }
    },
    incorrectPwdAttempts : {
        type : Number,
        default: 0
    },
    lastLoggedInOn : {
        type: Date
    },
    loginLocked: {
        type : Boolean,
        default: false
    },
    mailconfirmationAttributes: {
        token: {
            type: String
        },
        generatedOn: {
            type: Date
        }
    },
    bio : {
        type: String
    },
    preferences : {
        selectedCountry : {
            type: String
        },
        selectedCity : {
            type: String
        },
        selectedCurrency : {
            type: String
        }
    },
    paymentMethodInfo: {
        type: mongoose.Schema.Types.ObjectId, 
    }
});

var User = mongoose.model("users", userSchema);

module.exports = User;