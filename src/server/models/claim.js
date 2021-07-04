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
    holderInfo : {
        socialSecurityNumber : {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        }
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    claimType : {
        type: String //// medical / death
    },
    documents:[{
        id: {
            type: String
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId 
        },
        type: {
            type: String // video / identity document / medical reports / certificate
        },
        description: {
            type: String 
        },
        generated: {
            type: Boolean
        }
    }],
    status : {
        type: String //// initiated / in-review / processed / disbursed / rejected.
    },
    isActive: {
        type: Boolean,
        default: true  
    },
    raisedBy : {
        type: mongoose.Schema.Types.ObjectId, 
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
    photoDocumentId: {
        type: mongoose.Schema.Types.ObjectId 
    },
    claimAmount : {
        type : Number
    },
    approvedAmount : {
        type : Number
    },
    reviewInfo : {
        review1 : {
            type : String //// approved / needinfo
        },
        review2: {
            type : String //// approved / needinfo
        }
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
    ]
});

var Claim = mongoose.model("claims", claimSchema);

module.exports = Claim;