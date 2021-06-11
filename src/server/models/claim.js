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
    policyId: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    description : {
        type: String
    },
    documents:[{
        id: {
            type: String
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId 
        },
        type: {
            type: String // video / voicetext / id documents / medical reports / certificates
        },
        description: {
            type: String 
        },
        generated: {
            type: Boolean
        }
    }],
    status : {
        type: String
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
    photoDocumentId: {
        type: mongoose.Schema.Types.ObjectId 
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