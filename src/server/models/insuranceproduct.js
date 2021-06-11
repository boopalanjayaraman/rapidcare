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
    }  
});

var InsuranceProduct = mongoose.model("insuranceproducts", insuranceProductSchema);

module.exports = InsuranceProduct;