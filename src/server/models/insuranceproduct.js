const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create product schema
const insuranceProductSchema = new Schema({
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
    description: {
        type: String,
        required: true
    },
    productUserType: {
        type: String // individual / business
    },
    productType: {
        type: String // health / term / accident / workerCompensation / complexMedicalProcedure / smallBusinessHealth
    },
    minPrice: {
        type: Number
    },
    currency: {
        type: String // "INR", "GBP"
    },
    minDuration : {
        type: String // "weekly", "daily"
    },
    party : {
        type: String // insured party - "self", "other"
    },
    country : {
        type : String // "IN", "GB", "US"
    }
});

var InsuranceProduct = mongoose.model("insuranceproducts", insuranceProductSchema);

module.exports = InsuranceProduct;