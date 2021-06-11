const options = {
    file: {
        level: 'debug',
        filename: '../logs/covermypagerlogs.log',
        handleExceptions : true,
        json: true,
        maxsize: 5242880, //// 5 MB
    }
};

module.exports = options;