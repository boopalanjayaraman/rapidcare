const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create insurance order schema
const insuranceOrderSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    }, 
    ownerId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true
    },
    policyProduct : {
        type:  String, //
    },
    sumAssured : {
        type : Number,
        required: true
    },
    policyCost: {
        type: Number,
        required: true
    },
    policyInfo: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true
    },
    premiumInterval: {
        type: String,
        required: true
    },
    currentStartDate: {
        type: Date,
        default: Date.now,
    },
    currentEndDate : {
        type: Date,
        default: Date.now,
    },
    isRenewed : {
        type : Boolean
    },
    periodDates : [
        {
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            } 
        }
    ],
    createdDate: {
        type: Date,
        default: Date.now,
    },
    createdDateValue: {
        type: Number //// yyyymmdd
    }
});

var InsuranceOrder = mongoose.model("insuranceorders", insuranceOrderSchema);

module.exports = InsuranceOrder;