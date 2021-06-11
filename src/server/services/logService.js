const mongoose = require("mongoose");
const winston = require("winston");
const options = require("../config/logging");
const moment = require("moment");

class LogService {
    constructor() {
        this.options = options.file;
        this.logger = {};
        this.init();
    }

    init(){
        const logFormat = winston.format.combine(
            winston.format.timestamp({format: moment().format('YYYY-MM-DD HH:mm:ss')}),
            winston.format.align(),
            winston.format.printf(msg => `${msg.timestamp} ${msg.level}: ${msg.message}`)  
        );

        try {
            this.logger = winston.createLogger({
                format: logFormat,
                transports: [
                    new winston.transports.File(this.options)
                ]
            });
        } catch (error) {
            console.log('Error in initializing logService. ' + error); 
            console.log('Log options passed: ' + JSON.stringify(this.options));  
        }
    }  

    info(message, obj){
        let logMessage = message;
        if(obj){
            logMessage += " additional info: " + JSON.stringify(obj); 
        }
        this.logger.info(logMessage);
    } 

    error(message, obj){
        let logMessage = message;
        if(obj){
            logMessage += ` error info: ${obj.message}, ${obj.stack}`; 
        }
        this.logger.error(logMessage);
    }

    debug(message, obj){
        let logMessage = message;
        if(obj){
            logMessage += " debug info: " + JSON.stringify(obj); 
        }
        this.logger.debug(logMessage);
    }

}

module.exports = LogService;
