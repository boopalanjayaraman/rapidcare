const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create policyInfo schema
const policyInfoSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    },
    holderInfo : {
        name: {
            type : String
        },
        age : {
            type: Number,
        },
        dateOfBirth : {
            type: Date
        },
        socialSecurityNumber : {
            type: String
        },
        contactPhoneNumber : {
            type : String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        photo :{
            type: mongoose.Schema.Types.ObjectId, // document collection
            ref: "documents",
        }
    },
    healthDeclarationInfo : {
        rightAge : {
            type: Boolean
        },
        ped : {
            type: Boolean
        },
        smoking : {
            type: Boolean
        },
        drinking : {
            type: Boolean
        },
        previouslyInsured : {
            type: Boolean
        },
        undergoneProcedure : {
            type: Boolean
        }
    },
    nomineeInfo: { //// additional storage from my profile nominee
        name: {
            type: String
        },
        socialSecurityNumber : {
            type: String
        },
        contactPhoneNumber : {
            type : String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        }
    }
});

var PolicyInfo = mongoose.model("policyinfos", policyInfoSchema);

module.exports = PolicyInfo;