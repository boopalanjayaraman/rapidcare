module.exports = {
    dbOptions: {
        mongoURI: "",
        mongoPwd: ""
    },
    secretOrKey: "secret",
    mailOptions: {
        host: "smtp.ethereal.email", ////smtp.ethereal.email - for the test email catching service
        port: 587, 
        secure: false, //// true for 465, false for other ports
        auth: {
            user: "christy10@ethereal.email",
            pass: "qrDRBuRKksak1qMdzM"
        }
    },
    environmentalSettings: {
        domainBaseUrl: "http://localhost:3000",
        currentEnvironment: 'DEV',
        mailCurrentEnvironmentPrefix : '[DEV]'
    },
    bucketOptions : {
        bucketName : "",
        apiKey : "",
        baseUrl: ""
    }
  };