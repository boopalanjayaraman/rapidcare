const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create policyInfo schema
const policyInfoSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    friendlyId: {
        type: Number,
        required: true
    },
    health : {
        age : {
            type: Number,
        },
        dateOfBirth : {
            type: Date
        },
        photo :{
            type: mongoose.Schema.Types.ObjectId, // document collection
        },
        ped : [{
             type : string 
        }],
        smoking : {
            type: Boolean
        },
        drinking : {
            type: Boolean
        },
        previouslyInsured : {
            type: Boolean
        },
        undergoneProcedure : {
            type: Boolean
        }
    },
    term: {
        age : {
            type: Number,
        },
        dateOfBirth : {
            type: Date
        },
        photo :{
            type: mongoose.Schema.Types.ObjectId, // document collection
        },
        ped : [{
             type : string 
        }],
        smoking : {
            type: Boolean
        },
        drinking : {
            type: Boolean
        },
        previouslyInsured : {
            type: Boolean
        },
        undergoneProcedure : {
            type: Boolean
        }
    },
    accident: {
        age : {
            type: Number,
        },
        dateOfBirth : {
            type: Date
        },
        photo :{
            type: mongoose.Schema.Types.ObjectId, // document collection
        },
        occupation : {
            type : String
        }
    },
    workerCompensation : {
        headCount : {
            type : Number
        },
        details : [
            {
                name : {
                    type : String
                },
                age : {
                    type : Number
                },
                socialSecurityNumber : {
                    type : String
                },
                dateOfBirth : {
                    type: Date
                },
                nomineeName : {
                    type : String
                },
                nomineeSocialSecurityNumber : {
                    type : String
                }
            }
        ]
    },
    smallBusinessHealth : {
        headCount : {
            type : Number
        },
        details : [
            {
                name : {
                    type : String
                },
                age : {
                    type : Number
                },
                socialSecurityNumber : {
                    type : String
                },
                dateOfBirth : {
                    type: Date
                },
                nomineeName : {
                    type : String
                },
                nomineeSocialSecurityNumber : {
                    type : String
                }
            }
        ]
    },
    complexMedicalProcedure : {
        name : {
            type : String
        },
        age : {
            type : Number
        },
        socialSecurityNumber : {
            type : String
        },
        dateOfBirth : {
            type: Date
        },
        nomineeName : {
            type : String
        },
        nomineeSocialSecurityNumber : {
            type : String
        },
        procedureName : {
            type : String
        }
    },
    nomineeInfo: {
        name: {
            type: String
        },
        socialSecurityNumber : {
            type: String
        },
        contactPhoneNumber : {
            type : String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }
});

var PolicyInfo = mongoose.model("policyinfos", policyInfoSchema);

module.exports = PolicyInfo;