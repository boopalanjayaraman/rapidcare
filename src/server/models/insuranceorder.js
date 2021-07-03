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
        ref: "users",
        required: true
    },
    holderId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    policyProduct : {
        type:  String, //
        ref: "insuranceproducts",
    },
    sumAssured : {
        type : Number,
        required: true
    },
    sumClaimed : {
        type : Number
    },
    policyPrice: {
        type: Number,
        required: true
    },
    feeCollected : {
        type : Boolean
    },
    riskFactor: {
        type: Number,
    },
    country: { //// for quick access, this can be accessed by policy product too.
        type: String,
    },
    currency: { //// for quick access, this can be accessed by policy product too.
        type: String,
    },
    policyInfo: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "policyinfos",
        required: true,
    },
    premiumInterval: {
        type: String,
        required: true
    },
    currentStartDate: {
        type: Date
    },
    currentEndDate : {
        type: Date
    },
    isRenewed : {
        type : Boolean
    },
    autoRenew : {
        type : Boolean,
        default: false,
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
    },
    status : {
        type: String,
        required: true
    },
    paymentStatus : {
        type: String,
    },
    paymentCompleteToken : {
        type: String,
    },
    paymentErrorToken : {
        type: String,
    }
});

var InsuranceOrder = mongoose.model("insuranceorders", insuranceOrderSchema);

module.exports = InsuranceOrder;