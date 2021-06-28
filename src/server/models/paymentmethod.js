const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create paymentMethod schema
const paymentMethodSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    },
    accountName: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
      type: Boolean,
      default: true  
    },
    methodType: {
        type: String // rapydwallet 
    }
});

var PaymentMethod = mongoose.model("paymentmethods", paymentMethodSchema);

module.exports = PaymentMethod;