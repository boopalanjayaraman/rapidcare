const express = require("express");
const router = express.Router();
const passport = require("passport");
const isEmpty = require("is-empty");

//// import container
const Container = require("typedi").Container;

//// import services
const UserService = require("../../services/userService");
const LogService = require("../../services/logService");

let userService = Container.get(UserService);
let logService = Container.get(LogService);

// @route POST api/users/register
// @desc Register User
// @access Public
router.post("/register",  async (req, res)=>{

    let data = req.body; 
    logService.info('register operation is invoked.', {userName: data.username, email: data.loginId, userType: data.userType});

    try {
        //// call user service
        const { errors, result } = await userService.register(data);
        if(!isEmpty(errors)){
            logService.info("Validation(s) failed.", errors);
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        }

    } catch (error) {
        const errorMsg = 'Error in register operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }

});

// @route POST api/users/login
// @desc Login User
// @access Public
router.post("/login", async (req, res) => {
    let data = req.body;

    logService.info('login operation is invoked.', {loginId: data.loginId});
    
    try {
        // call user service
        const {errors, result} = await userService.login(data);
        if(!isEmpty(errors)){
            logService.info("Validation(s) failed.", errors);
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        }    
    } catch (error) {
        const errorMsg = 'Error in login operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
    
});


// @route GET api/users/getmyinfo
// @desc gets the current authenticated user's info
// @access Public
router.get("/getmyinfo", passport.authenticate('jwt', {session: false}), async (req, res) => {

    const currentUser = req.query;
    logService.info('getmyinfo operation is invoked.',  {currentUser: currentUser.email, userId: currentUser._id});

    try {
        //// call user service
        const { errors, result } = await userService.getUserInfo(currentUser, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getmyinfo operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/users/getuserinfo
// @desc gets the requested user's info
// @access Public
router.get("/getuserinfo", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    logService.info('getuserinfo operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    let authorizationResult = validateUserAccess(currentUser, data);
    if(authorizationResult != true){
        return res.status(401).json(authorizationResult);
    }

    try {
        //// call user service
        const { errors, result } = await userService.getUserInfo(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getuserinfo operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route POST api/users/editprofile
// @desc edits the profile of a user 
// @access Public
router.post("/editprofile", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    logService.info('editprofile operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    try {
        //// call user service
        const { errors, result } = await userService.editProfile(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in editprofile operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/users/lockuser
// @desc locks a user
// @access Public
router.post("/lockuser", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    logService.info('lockuser operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    let authorizationResult = validateUserAccess(currentUser);
    if(authorizationResult != true){
        return res.status(401).json(authorizationResult);
    }

    try {
        //// call user service
        const { errors, result } = await userService.lockUser(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in lockuser operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/users/unlockuser
// @desc unlocks a user
// @access Public
router.post("/unlockuser", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    logService.info('lockuser operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    let authorizationResult = validateUserAccess(currentUser);
    if(authorizationResult != true){
        return res.status(401).json(authorizationResult);
    }

    try {
        //// call user service
        const { errors, result } = await userService.unlockUser(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in unlockuser operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/users/getusers
// @desc gets the users according to a criteria
// @access Public
router.get("/getusers", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.query;
    const currentUser = req.user;
    logService.info('getusers operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    let authorizationResult = validateUserAccess(currentUser);
    if(authorizationResult != true){
        return res.status(401).json(authorizationResult);
    }

    try {
        //// call user service
        const { errors, result } = await userService.getUsers(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in getusers operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});


// @route GET api/users/resendconfirmationemail
// @desc sends a confirmation email to the user if not already confirmed
// @access Public
router.post("/resendconfirmationemail", passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const data = req.body;
    const currentUser = req.user;
    logService.info('resendconfirmationemail operation is invoked by user.',  {currentUser: currentUser.email, userId: currentUser._id});

    try {
        //// call user service
        const { errors, result } = await userService.resendConfirmationEmail(data, currentUser);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in resendconfirmationemail operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route POST api/users/confirmemail
// @desc this is to verify / confirm the user's email.
// @access Public, NOTE: NO AUTHENTICATION since it is a public method.
router.post("/confirmemail", async (req, res) => {
    
    const data = req.body;
    logService.info('confirmemail operation is invoked.');

    try {
        //// call user service
        const { errors, result } = await userService.confirmEmail(data);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in confirmemail operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route POST api/users/forgotpassword
// @desc this is to send the user an email with a link to change the password.
// @access Public, NOTE: NO AUTHENTICATION since it is a public method.
router.post("/forgotpassword", async (req, res) => {
    
    const data = req.body;
    logService.info('forgotpassword operation is invoked.');

    try {
        //// call user service
        const { errors, result } = await userService.forgotPassword(data);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in forgotpassword operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route POST api/users/changeforgotpassword
// @desc this is to let the user change the password with given tokens.
// @access Public, NOTE: NO AUTHENTICATION since it is a public method.
router.post("/changeforgotpassword", async (req, res) => {
    
    const data = req.body;
    logService.info('changeforgotpassword operation is invoked.');

    try {
        //// call user service
        const { errors, result } = await userService.changePasswordWithToken(data);
        if(!isEmpty(errors)){
            return res.status(500).json(errors);
        }
        else{
            return res.json(result);
        } 
    } catch (error) {
        const errorMsg = 'Error in changeforgotpassword operation.';
        logService.error(errorMsg, error);
        return res.status(500).json( {error: errorMsg} );
    }
});

// @route GET api/users/ping
// @desc User Ping Api
// @access Public
router.get("/ping", (req, res) => {
    
    const { errors, result } = userService.ping();
    if(!isEmpty(errors)){
        return res.status(500).json(errors);
    }
    else{
        return res.json(result);
    }
});

// @route GET api/users/ping
// @desc User Ping with Auth Api
// @access Public
router.get("/pingAuth", passport.authenticate('jwt', {session: false}), (req, res) => {

    console.log(req.user);
    const { errors, result } = userService.ping();
    if(!isEmpty(errors)){
        return res.status(500).json(errors);
    }
    else{
        return res.json(result);
    } 

});

function validateUserAccess(currentUser, user){

    if((user) && (currentUser._id == user._id)){
        return true;
    }
    if(currentUser.roleInfo.isUser === false
        || currentUser.isLocked === true 
        || currentUser.isActive === false) {
        
        logService.info('getuserinfo - access for the current user is limited. (Locked / Inactive / Unapproved).',  {currentUser: currentUser.email, userId: currentUser._id});
        let errors = { error: "Unauthorized request. Current User is either locked / inactive / not approved."};
        return errors;
    }
    else {
        return true;
    }
}

module.exports = router;