const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create document schema
const documentSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    }
});

var IdCounter = mongoose.model("idcounters", idCounterSchema);

module.exports = IdCounter;