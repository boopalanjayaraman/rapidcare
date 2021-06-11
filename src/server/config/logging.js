const options = {
    file: {
        level: 'debug',
        filename: '../logs/rapydcarelogs.log',
        handleExceptions : true,
        json: true,
        maxsize: 5242880, //// 5 MB
    }
};

module.exports = options;