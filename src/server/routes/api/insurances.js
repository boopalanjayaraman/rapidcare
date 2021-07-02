const express = require("express");
const router = express.Router();
const passport = require("passport");
const isEmpty = require("is-empty");

//// import container
const Container = require("typedi").Container;

//// import services
const InsuranceService = require("../../services/insuranceService");
const LogService = require("../../services/logService");

let insuranceService = Container.get(InsuranceService);
let logService = Container.get(LogService);

// @route GET api/insurances/buyinsurance
// @desc buys the insurance (subject to payment) - puts in pending status.
// @access Public
router.post("/buyinsurance",passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('buyinsurance operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
    
    try {
        //// call product service
        const { errors, result } = await insuranceService.buyInsurance(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in buyinsurance operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/insurances/getinsuranceinfo
// @desc gets the insuranceinfo by id
// @access Public
router.get("/getinsuranceinfo", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    
    logService.info('getinsuranceinfo operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, info: data });
     

    try {
        //// call product service
        const { errors, result } = await insuranceService.getInsuranceInfo(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getinsuranceinfo operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/insurances/getinsurances
// @desc gets the insurances according to a criteria
// @access Public
router.get("/getinsurances", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
     
    logService.info('getinsurances operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, country: data.country});
     
    try {
        //// call product service
        const { errors, result } = await insuranceService.getInsurances(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getinsurances operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route POST api/insurances/updatepaymentstatus
// @desc updates paymentstatus for the insuranceinfo by id
// @access Public
router.post("/updatepaymentstatus", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('updatepaymentstatus operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, info: data });
     

    try {
        //// call product service
        const { errors, result } = await insuranceService.updatePaymentStatus(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in updatepaymentstatus operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route POST api/insurances/getcheckouturl
// @desc gets the rapyd checkout url after creating the page
// @access Public
router.post("/getcheckouturl", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    
    logService.info('getcheckouturl operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, info: data });
     

    try {
        //// call product service
        const { errors, result } = await insuranceService.getCheckoutUrl(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getcheckouturl operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/insurances/getinsuranceprice
// @desc gets the insurance price based on input factors by invoking a machine learning model and calculating underwriting risk factor
// @access Public
router.get("/getinsuranceprice", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    
    logService.info('getinsuranceprice operation is invoked by user.',  { currentUser: currentUser.email , userId: currentUser._id, info: data });
     

    try {
        //// call product service
        const { errors, result } = await insuranceService.getInsurancePrice(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getinsuranceprice operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


 
module.exports = router;