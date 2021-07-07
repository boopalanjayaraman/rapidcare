const express = require("express");
const router = express.Router();
const passport = require("passport");
const isEmpty = require("is-empty");

//// import container
const Container = require("typedi").Container;

//// import services
const PaymentMethodService = require("../../services/paymentMethodService");
const LogService = require("../../services/logService");

let paymentMethodService = Container.get(PaymentMethodService);
let logService = Container.get(LogService);



// @route POST api/paymentmethods/createbeneficiary
// @desc this is to create a beneficiary in rapyd
router.post("/savepaymentmethod", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    logService.info('savepaymentmethod operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    try {
        //// call user service
        const { errors, result } = await paymentMethodService.savePaymentMethod(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in savepaymentmethod operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


module.exports = router;