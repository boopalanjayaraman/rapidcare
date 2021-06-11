const mongoose = require("mongoose");
const configuration = require("../config/configuration");
const constants = require("../config/constants");
const dateFormat = require("dateformat");
const isEmpty = require("is-empty");

const LogService = require("./logService");

const IdCounterModel = require("../models/idcounter");
const validateIdCounterInput = require("../validation/idCounterValidation");

class IdCounterService {
    constructor(container){
        this.logService = container.get(LogService);
    }

    //// gets the latest id that was generated, and does not increment the counter
    async getLatestId(modelId){
        this.logService.info('getLatestId in IdCounterService is entered into.', {_id: modelId});
        //// perform validation
        let { errors, isValid } = validateIdCounterInput(bidInfo);

        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return -1;
        }

        return IdCounterModel.findById(modelId)
            .then(idCounter => {
                return idCounter.friendlyId;
            })
            .catch(err => {
                this.logService.error('Error occurred in fetching latest generic id.', err);
                return -1;
            });
    }

    //// increments the id counter and gets the new id
    async getNewId(modelId){
        this.logService.info('getNewId in IdCounterService is entered into.', {_id: modelId});
        //// perform validation
        let { errors, isValid } = validateIdCounterInput(modelId);

        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return -1;
        }

        let updateInfo = {};
        updateInfo['$inc'] = { friendlyId : 1};

        return IdCounterModel.findOneAndUpdate({ _id: modelId }, updateInfo, { new: true})
            .then(idCounter => {
                if(idCounter){
                    return idCounter.friendlyId;
                }
                else{
                    let firstDocument = new IdCounterModel({
                        _id: modelId,
                        friendlyId: 1
                    });
                    return firstDocument.save()
                            .then(idCounter => {
                                return idCounter.friendlyId;
                            })
                            .catch(err => {
                                this.logService.error('Error occurred in generating new first-time generic id.', err);
                                return -1;
                            });
                }
                
            })
            .catch(err => {
                this.logService.error('Error occurred in generating new generic id.', err);
                return -1;
            });
    }
}

module.exports = IdCounterService;