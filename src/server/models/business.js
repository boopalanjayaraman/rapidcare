const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create business schema
const businessSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    },
    name: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address: {
        type: String
    },
    certificateInfo:{
        id: {
            type: String
        },
        imageDocumentId: {
            type: mongoose.Schema.Types.ObjectId 
        },
        type: {
            type: String 
        }
    },
    paymentMethodInfo: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    isActive: {
        type: Boolean,
        default: true  
    }
});

var Business = mongoose.model("businesses", businessSchema);

module.exports = Business;