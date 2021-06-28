const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create nominee schema
const nomineeSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId 
    },
    socialSecurityNumber : {
        type: mongoose.Schema.Types.ObjectId 
    } 
});

var Nominee = mongoose.model("nominees", nomineeSchema);

module.exports = Nominee;