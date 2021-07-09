module.exports = {
    dbOptions: {
        mongoURI: "",
        mongoPwd: ""
    },
    secretOrKey: "secret",
    mailOptions: {
        host: "", ////smtp.ethereal.email - for the test email catching service
        port: 587, 
        secure: false, //// true for 465, false for other ports
        auth: {
            user: "", //"christy10@ethereal.email",
            pass: "",//"qrDRBuRKksak1qMdzM"
        }
    },
    environmentalSettings: {
        domainBaseUrl: "http://rapydcare.com",
        currentEnvironment: 'DEV',
        mailCurrentEnvironmentPrefix : '[DEV] ',
        primaryAdmins: ['rapydcare.manager@gmail.com'],
    },
    bucketOptions : {
        bucketName : "",
        apiKey : "",
        baseUrl: ""
    },
    rapydConfig: {
        access_key : "",
        secret_key : "",
        sandbox_base_url : 'https://sandboxapi.rapyd.net',
        completionPage_base_url : 'http://rapydcare.com/completePayment',
        errorPage_base_url : 'http://rapydcare.com/errorPayment',
        primary_account_wallet : '',
        service_fee_wallet : ''
    },
    UnderwritingAiUrl : "http://127.0.0.1:5001/getRiskFactor",
    awsConfig: {
        secretAccessKey : "",
        accessKeyId : "",
        region : "",
        bucketName : ""
    }
  };