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



// @route POST api/users/createpayout
// @desc this is to create a payout in rapyd
router.post("/createpayout", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
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
});


module.exports = router;