const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create claim schema
const claimSchema = new Schema({
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
    },
    holderId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
    },
    insuranceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "insuranceorders" 
    },
    claimType : {
        type: String //// medical / life
    },
    dateOfOccurrence : {
        type: Date, 
    },
    documents:[{
        name: {
            type: String
        },
        type: {
            type: String // video / identity document / medical reports / certificate
        }
    }],
    status : {
        type: String //// initiated / in-review / review-complete / approved / rejected.
    },
    isActive: {
        type: Boolean,
        default: true  
    },
    raisedBy : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
    },
    raisedOn : {
        type: Date,
        default: Date.now,
    },
    isNominee: {
        type : Boolean
    },
    isPartnerDoctor: {
        type: Boolean
    },
    photoDocumentName: {
        type: String
    },
    claimAmount : {
        type : Number
    },
    approvedAmount : {
        type : Number
    },
    currency : {
        type: String
    },
    reviewInfo : {
        review1 : {
            type : String //// approved / needinfo
        },
        review2: {
            type : String //// approved / needinfo
        },
        remarks1 : {
            type : String,
        },
        remarks2 : {
            type: String,
        }
    },
    reviewer1 : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
    },
    reviewer2 : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
    },
    antiFraudAlgorithms :[
        {
            algoName: {
                type: String
            },
            outcome: {
                type: String
            },
            executedOn : {
                type: Date
            }
        }
    ],
    closingRemarks : {
        type: String
    }
});

var Claim = mongoose.model("claims", claimSchema);

module.exports = Claim;