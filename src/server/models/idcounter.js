const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create id counter schema
const idCounterSchema = new Schema({
    _id: { 
        type: String, //// "users", "claims" -- model name
        required: true
    },
    friendlyId: {
        type: Number,
        required: true
    }
});

var IdCounter = mongoose.model("idcounters", idCounterSchema);

module.exports = IdCounter;