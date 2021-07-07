const express = require("express");
const router = express.Router();
const passport = require("passport");
const isEmpty = require("is-empty");

//// import container
const Container = require("typedi").Container;

//// import services
const ClaimService = require("../../services/claimService");
const LogService = require("../../services/logService");

let claimService = Container.get(ClaimService);
let logService = Container.get(LogService);

const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const constants = require("../../config/constants");
const configuration = require("../../config/configuration");
const path = require("path");

const s3 = new AWS.S3({
    accessKeyId: configuration.awsConfig.accessKeyId,
    secretAccessKey: configuration.awsConfig.secretAccessKey,
    region: configuration.awsConfig.region
});

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: configuration.awsConfig.bucketName,
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            let claimId = req.body.claimId;
            let dateSuffix = Date.now().toString();
            let extn = path.extname(file.originalname).toLowerCase()
            let fullFileName = claimId + "_" + dateSuffix + extn
            callBack(null, fullFileName);
        }
    }),
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});


function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Allowed File Types are - jpeg, jpg, png, pdf, txt only.');
    }
  }


// @route POST api/users/createpayout
// @desc this is to create a payout in rapyd
// THIS WAS EXPOSED PUBLIC ONLY FOR TESTING PURPOSES.
/*router.post("/createpayout", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    logService.info('createpayout operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    try {
        //// call user service
        const { errors, result } = await claimService.createPayout(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in createpayout operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});*/


// @route GET api/claims/raiseClaim
// @desc raises a new claim against an insurance 
// @access Public
router.post("/raiseClaim",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('raiseClaim operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.raiseClaim(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in raiseClaim operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/claims/getclaiminfo
// @desc gets the claiminfo by id
// @access Public
router.get("/getclaiminfo", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    
    logService.info('getclaiminfo operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, info: data });
     

    try {
        //// call product service
        const { errors, result } = await claimService.getClaimInfo(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getclaiminfo operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/claims/getclaims
// @desc gets the claims according to a criteria
// @access Public
router.get("/getclaims", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
     
    logService.info('getclaims operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
     
    try {
        //// call product service
        const { errors, result } = await claimService.getClaims(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getclaims operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/claims/reviewclaim
// @desc reviews a claim 
// @access Public
router.post("/reviewclaim",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('reviewclaim operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.reviewClaim(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in reviewclaim operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/claims/processclaim
// @desc processes a claim - triggers disbursal if approved.
// @access Public
router.post("/processclaim",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('processclaim operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.processClaim(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in processclaim operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/claims/uploaddocuments
// @desc adds documents to the claim
// @access Public
router.post("/uploaddocuments",passport.authenticate('jwt', {session: false}), uploadS3.single('file'), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;

    //// important line.
    data['fileKey'] = req['file'].key;
    
    logService.info('uploaddocuments operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.uploadDocuments(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in uploaddocuments operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/claims/getdocuments
// @desc gets list of documents for the claim
// @access Public
router.get("/getdocuments",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    
    logService.info('getdocuments operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.getDocuments(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getdocuments operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/claims/getdocument
// @desc gets a document from the claim
// @access Public
router.get("/getdocument",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    
    logService.info('getdocument operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.getDocument(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': result.length
            });
            return res.write(result);
            //return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getdocument operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/claims/deletedocument
// @desc deletes a document from the claim
// @access Public
router.post("/deletedocument",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('deletedocument operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await claimService.deleteDocument(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in deletedocument operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

module.exports = router;