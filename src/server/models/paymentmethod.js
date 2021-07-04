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
    rapydCustomerId : {
        type: String,
    },
    rapydCardBeneficiaryId : {
        type: String,
    },
    rapydBankBeneficiaryId : {
        type: String,
    },
    rapydCardPayoutMethod : {
        type: String,
    },
    rapydBankPayoutMethod : {
        type: String,
    },
    rapydWalletId: {
        type: String // rapydwallet 
    },
    isActive: {
      type: Boolean,
      default: true  
    }
});

var PaymentMethod = mongoose.model("paymentmethods", paymentMethodSchema);

module.exports = PaymentMethod;