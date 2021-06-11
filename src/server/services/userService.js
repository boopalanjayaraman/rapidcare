const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const configuration = require("../config/configuration");
const mongoose = require("mongoose");
const passport = require("passport");
const constants = require("../config/constants");
const settings = require("../config/configuration").environmentalSettings;
//// load model
const UserModel = require("../models/user");
//// load validations
const validateRegisterInput = require("../validation/registerValidation");
const validateLoginInput = require("../validation/loginValidation");
const { validateUpdateUserInput, 
        ValidateEditProfileInput,
        validateGetUsers, 
        validateGetUsersPermissions,  
        validateChangePassword, 
        validateForgotPassword } = require("../validation/userValidation");

const isEmpty = require("is-empty");
const crypto = require("crypto");
const moment = require("moment");

//// load services for dependency injection
const EmailService = require("./emailService");
const LogService = require("./logService");
const IdCounterService = require("./idCounterService");

const Password_Allowed_Attempts = 6;

class UserService {

    //// receives dependency injection container
    constructor(container){ 
        this.emailService = container.get(EmailService);
        this.logService = container.get(LogService);
        this.idCounterService = container.get(IdCounterService);

        this.notifyUserLocked = this.notifyUserLocked.bind(this);
        this.notifyUserUnLocked = this.notifyUserUnLocked.bind(this);
    }

    //// method for registering a new user
    //// data - contains registration information 
    async register(data){

        this.logService.info('UserService - entered register operation', { email: data.loginId });
        // perform form validation
        const { errors, isValid } = validateRegisterInput(data);
        let response = { errors, result : {}};

        // if validation failed, send back the errors to front end. 
        if(!isValid){
            return response;
        }

        //// check if the user already exists
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findOne({email: data.loginId})
        .then(async (user) => {
            if(user){
                response.errors.loginId = "loginId (email) already exists.";
                this.logService.info('LoginId (email) already exists.', { email: data.loginId });
                return response;
            }
            else{
                
                let friendlyId = await this.idCounterService.getNewId(constants.idCounter_users);
                if(friendlyId == -1){
                    throw "Could not generate a new friendly Id.";
                }
                
                let freshUser = new UserModel({
                    _id: new mongoose.Types.ObjectId(),
                    name: data.username,
                    email: data.loginId,
                    password: data.password,
                    userType: data.userType,
                    friendlyId: friendlyId
                });

                //// add salt & hash password before saving.
                return bcrypt.genSalt(12).then(salt => {
                    freshUser.pwdsalt = salt;

                    // perform the hash operation
                    return bcrypt.hash(freshUser.password, salt).then(hash => {
                        freshUser.password = hash;

                        // save the user into db
                        return freshUser.save()
                        .then(user => {
                            console.log('created a new user');
                            response.result = { _id: user._id, loginId: user.email, name: user.name };
                            this.logService.info('Created a new user.', response.result);
                            //// send welcome email
                            this.emailService.sendWelcomeNote(user);
                            //// send confirmation link email
                            this.sendConfirmationEmail(user);
                            //// notify admin regarding the new registration
                            this.emailService.sendNewRegistration(user);
                            return response;
                        })
                        .catch(err => {
                            console.log(err);
                            response.errors.exception = "Error occurred. Could not save for unknown reasons.";
                            return response;
                        });
                    }).catch(err => {
                        console.log(err);
                        response.errors.exception = "Error occurred in hash operation. Could not save.";
                        return response;
                    });//hash closure

                }).catch(err => {
                    console.log(err);
                    response.errors.exception = "Error occurred in salt operation. Could not save.";
                    return response;
                });//gensalt closure
                 
            }
        })
        .catch(err => {
            console.log(err);
            response.errors.exception = "Runtime Error occurred. Could not save for unknown reasons.";
            this.logService.error('Runtime Error occurred during register op.', err);
            return response;
        });
    }


    //// login method
    //// data - contains credentials 
    async login(data){

        this.logService.info('UserService - entered login operation', { email: data.loginId });
        const {errors, isValid} = validateLoginInput(data);
        let response = { errors, result : null};

        if(!isValid){
            return response;
        }

        const loginId = data.loginId;
        const password = data.password;
    
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findOne({email: loginId})
        .then(async (user) => {
            if(!user){
                response.errors.error = "Authentication Failed. Invalid Credentials.";
                this.logService.info(response.errors.error, { loginId: loginId });
                return response;
            }

            if(user.loginLocked) {
                response.errors.error = "Account is locked out since you had exceeded the maximum number of allowed attempts. Please contact the administrator for further support.";
                this.logService.info(response.errors.error, { loginId: loginId });
                return response;
            }
    
            //// verify the password
            //// bcrypt.compare method returns a promise so returning it - current method is an async method.
            return bcrypt.compare(password, user.password)
            .then(async (matched) => {
                if(matched){

                    //// create the payload
                    const payload = {
                        id: user._id,
                        name: user.name,
                        loginId: user.email,
                        isUser: user.roleInfo.isUser,
                        isAdmin: user.roleInfo.isAdmin,
                        isPartnerDoctor: user.roleInfo.isPartnerDoctor,
                        isLocked: user.isLocked,
                        isActive: user.isActive 
                    };
    
                    console.log('Login success. Creating token. Logging in user: ' + user.name.toString());
                    this.logService.info('Login success. Creating token', { loginId: loginId });
                    //// sign the token - 86400 - 24 hours in seconds
                    const token = jwt.sign(payload, configuration.secretOrKey, { expiresIn: 86400 }); 
                    response.result = {
                        success: true,
                        token: "Bearer " + token
                    };

                    //// update user login attributes (clear incorrect password attempts if any)
                    let updateData = {};
                    updateData['$set'] = { 
                                            incorrectPwdAttempts : 0, 
                                            lastLoggedInOn : Date.now(),
                                        };

                    this.updateUserLoginInfo(user, updateData);
                    //// return token response
                    return response;

                }
                else{
                    
                    //// check if the number of incorrect password attempts exceeded the threshold
                    if(user.incorrectPwdAttempts && user.incorrectPwdAttempts >= Password_Allowed_Attempts) {
                        //// lock the user account from loggin in.
                        let updateData = {};
                        updateData['$set'] = { loginLocked : true};

                        this.updateUserLoginInfo(user, updateData);  

                        response.errors.error = "Authentication Failed. Invalid Credentials. Account is locked out since you exceeded the maximum number of allowed attempts.";
                    }
                    else {
                        //// set incorrect attempts / increment it
                        let updateData = {};
                        if(user.incorrectPwdAttempts >= 0){
                            updateData['$inc'] = {incorrectPwdAttempts : 1};
                        }
                        else{
                            updateData['$set'] = {incorrectPwdAttempts : 1};
                        }

                        this.updateUserLoginInfo(user, updateData);
                        let authErrorMessage = "Authentication Failed. Invalid Credentials.";
                        if(user.incorrectPwdAttempts >= 3){
                            authErrorMessage += " " + (Password_Allowed_Attempts - user.incorrectPwdAttempts) + " more attempt(s) left.";
                        }
                        response.errors.error = authErrorMessage;
                    }

                    this.logService.info(response.errors.error, { loginId: loginId });
                    return response;
                }
            });
        })
        .catch(err => {
            response.errors.error = "Runtime Error occurred. Could not authenticate for unknown reasons.";
            this.logService.error('Runtime Error occurred during login op.', { ...err, loginId: loginId});
            return response;
        });
    }


    async updateUserLoginInfo(user, updateData){

        return UserModel.updateOne({_id: user._id}, updateData).then(updated => {
            if(updated){
                return true;
            }
            else{
                this.logService.info("Unable to update user login metadata.", { loginId: loginId, updateData: updateData });
                return false;
            }
        }).catch(err => {
            this.logService.error('Unable to update user login metadata. Error in update operation. Runtime Error occurred during login op.', { ...err, loginId: loginId, updateData: updateData});
            return false;
        });
    }

    //// getmyinfo method
    async getUserInfo(userInfo, currentUser){

        this.logService.info('UserService - entered getUserInfo operation', { getUserId: userInfo._id, currentUserId : currentUser._id });
        let response = { errors : {}, result : null};
        
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findById(userInfo._id, this.getUserProjection())
        .then(user => {
            if(!user){
                response.errors.exception = "User not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            this.logService.info('User info is fetched.', user);
            response.result = user;
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get user's info for unknown reasons.";
            this.logService.error('Runtime Error occurred during getUserInfo op.', { ...err, currentUser: currentUser});
            return response;
        });
    }

    //// getUsers method
    async getUsers(criteria, currentUser){

        this.logService.info('UserService - entered getUsers operation', { info: criteria });
        
        //// perform form validation
        let { errors, isValid } = validateGetUsers(criteria, currentUser);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        ({ errors, isValid } = validateGetUsersPermissions(criteria, currentUser));
        response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary and permission validations are done.');

        let query = {};
        let skip = criteria.skip? criteria.skip : 0;
        let limit = criteria.limit? criteria.limit : 10;

        query = this.getQueryForScenario(criteria, currentUser);

        this.logService.info('the query to be used for the scenario: ', { queryObj: query});

        //// find returns a promise so returning it - this is an async method.
        return UserModel.find(query, this.getUserProjection())
        .sort({ createdDate : 'desc'})
        .limit(limit)
        .then(users => {
            if(!users){
                response.errors.exception = "Users information not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            response.result = users;
            this.logService.info('Users info is fetched.', {count: response.result.length});
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not get users info for unknown reasons.";
            this.logService.error('Runtime Error occurred during getUsers op.', { ...err, currentUser: currentUser});
            return response;
        });
    }


    getQueryForScenario(criteria, currentUser){
        let query = {};
        let lastFriendlyId = criteria.lastFriendlyId ? criteria.lastFriendlyId : 99999999;

        if(criteria.scenario === constants.scenario_unlockUsers){
            query = {
                    $and : [
                            { 
                                'isLocked' : true
                            },
                            {
                                friendlyId : {
                                    $lt : lastFriendlyId //// since it is sorted in descending order
                                }
                            }
                    ]
                };
        }
        
        return query;
    }

    getUserProjection(){
        return {   
            friendlyId : 1, 
            name: 1, 
            email : 1, 
            createdDate :1,
            createdDateValue : 1,
            mailVerified : 1, 
            roleInfo : 1,
            identityVerified : 1,
            isActive : 1,
            userType : 1,
            profileInfo : 1,
            mobilePhoneContact,
            preferences : 1,
            isLocked: 1,
            mailconfirmationAttributes: 1
        };
    }

    //// resendConfirmationEmail method
    async resendConfirmationEmail(userInfo, currentUser){

        this.logService.info('UserService - entered resendConfirmationEmail operation', { getUserId: userInfo._id, currentUserId : currentUser._id });
        let response = { errors : {}, result : null};

        //// perform the validations
        if(!currentUser.profileInfo.isAdmin
            && currentUser._id.toString() != userInfo._id.toString()){
            response.errors.exception = "User not authorized to this operation.";
            this.logService.info(response.errors.exception, { _id: currentUser._id });
            return response;  
        }
        
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findById(userInfo._id, this.getUserProjection())  
        .then( async (user) => {
            if(!user){
                response.errors.exception = "User is not found.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;
            }
            this.logService.info('User info is fetched.', user);
            //// validate if the mail was already verified
            if(user.mailVerified && user.mailVerified==true){
                response.errors.exception = "User's email has been already verified.";
                this.logService.info(response.errors.exception, { _id: currentUser._id });
                return response;  
            }
            //// generate code (token), save it and send the email
            await this.sendConfirmationEmail(user);

            response.result = {_id: user._id, IsSuccess: true, Message: "Confirmation email has been sent to the email ID of the user."};
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Could not send confirmation email for unknown reasons.";
            this.logService.error('Runtime Error occurred during resendConfirmationEmail op.', { ...err, currentUser: currentUser});
            return response;
        });
    }

    //// internal method.
    async sendConfirmationEmail(user){
        //// generate code (token), save it and send the email
        //// if there is a token already for confirmation, use it
        let tokenCode = user.mailconfirmationAttributes && user.mailconfirmationAttributes.token ?
                        user.mailconfirmationAttributes.token :
                        crypto.randomBytes(16).toString("hex");

        //// form update info object 
        let updateInfo = {};
        updateInfo['$set'] = { 
                                mailVerified : false, 
                                mailconfirmationAttributes : { 
                                        token: tokenCode, 
                                        generatedOn: Date.now() 
                                    } 
                            };
        
        return UserModel.updateOne({_id: user._id},  updateInfo)
            .then(async (updated) => {
                this.logService.info('the user is updated with confirmation email token details.', updateInfo);
                //// send the mail here
                let link = settings.domainBaseUrl + "/confirmemail/" + user._id + "/" + tokenCode;
                try {
                    await this.emailService.sendUserConfirmation(user, link);
                }
                catch(err) {
                    this.logService.error('Error occurred in sending confirmation email.', err);    
                }
                return;
            })
            .catch(err => {
                this.logService.error('Error occurred. Could not send confirmation email to the user for unknown reasons.', err);
                return;
            });
    }

    //confirm Email method
    async confirmEmail(userInfo){
        this.logService.info('UserService - entered confirmEmail operation', { userId: userInfo._id });
        let response = { errors : {}, result : null};

        //// perform the validations
        if(!userInfo.tokenCode || !userInfo._id){
            response.errors.exception = "One or more required fields are missing to confirm the email.";
            this.logService.info(response.errors.exception, { _id: userInfo._id });
            return response;  
        }
        
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findById(userInfo._id, this.getUserProjection())  
        .then( async (user) => {
            if(!user){
                response.errors.exception = "User is not found.";
                this.logService.info(response.errors.exception, { _id: userInfo._id });
                return response;
            }
            this.logService.info('User info is fetched.', user);
            //// validate if the mail was already verified
            if(user.mailVerified && user.mailVerified==true){
                response.errors.exception = "User's email has been already verified.";
                this.logService.info(response.errors.exception, { _id: userInfo._id });
                return response;  
            }
            if(user.mailconfirmationAttributes 
                && user.mailconfirmationAttributes.token
                && user.mailconfirmationAttributes.token === userInfo.tokenCode){

                //// confirm the email by setting the flag
                await this.markEmailVerified(user);
                response.result = {_id: user._id, IsSuccess: true, Message: "User's email has been confirmed / verified successfully."};
                return response;
            }
            else {
                response.errors.exception = "Email verification failed. Try resending the verification email OR Please contact the administrator.";
                this.logService.info(response.errors.exception, userInfo);
                return response;
            }
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Email verification failed..";
            this.logService.error('Runtime Error occurred during confirmEmail op.', err);
            return response;
        });
    }

    //// internal method - mark email as verified for a user
    async markEmailVerified(user){
        //// form update info object 
        let updateInfo = {};
        updateInfo['$set'] = { 
                                mailVerified : true, 
                            };
        
        return UserModel.updateOne({_id: user._id},  updateInfo)
            .then(async (updated) => {
                this.logService.info("the user's email is marked verified", updateInfo);
                return;
            })
            .catch(err => {
                this.logService.error('Error occurred. Could not send confirmation email to the user for unknown reasons.', err);
                return;
            });
    }


    //forgot Password method
    async forgotPassword(userInfo){
        this.logService.info('UserService - entered forgotPassword operation', { email: userInfo.email });

        //// perform the validations
        let { errors, isValid } = validateForgotPassword(userInfo);
        let response = { errors, result: null };
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }
        
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findOne({ email: userInfo.email })
        .collation({locale: "en", strength: 2})  
        .then( async (user) => {
            if(!user){
                response.errors.exception = "A user with the given email id is not found.";
                this.logService.info(response.errors.exception, { email: userInfo.email });
                return response;
            }
            this.logService.info('User info is fetched.');

            await this.sendResetPasswordEmail(user);
            
            response.result = {email: userInfo.email, IsSuccess: true, Message: "Password Reset instructions have been sent to the E-mail ID of the user."};
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. Forgot password operation failed..";
            this.logService.error('Runtime Error occurred during forgotPassword op.', err);
            return response;
        });
    }


    //// internal method.
    async sendResetPasswordEmail(user){
        //// generate code (tokens), save it and send the email
        let token1 =  crypto.randomBytes(16).toString("hex");
        let token2 =  crypto.randomBytes(8).toString("hex");
        let expiresIn =  moment(Date.now()).add(15, 'm').toDate(); //// 15 mins from now.

        //// form update info object 
        let updateInfo = {};
        updateInfo['$set'] = { 
                                pwdResetAttributes: {
                                    token:  token1,
                                    token2: token2,
                                    expiresBy: expiresIn,
                                    generatedOn: Date.now()
                                }
                            };
        
        this.logService.info('tokens are generated for password reset.');

        return UserModel.updateOne({email: user.email},  updateInfo)
            .then(async (updated) => {
                this.logService.info('the user is updated with password reset attributes & token details.');
                //// send the mail here
                let link = settings.domainBaseUrl + "/resetpassword/" + token1 + "/" + token2;

                try {
                    await this.emailService.sendResetPassword(user, link);
                }
                catch(err) {
                    this.logService.error('Error occurred in sending reset password email.', err);    
                }
                return;
            })
            .catch(err => {
                this.logService.error('Error occurred. Could not update attributes of reset password email for the user for unknown reasons.', err);
                return;
            });
    }


    //change forgot Password method
    async changePasswordWithToken(userInfo){
        this.logService.info('UserService - entered changePasswordWithToken operation', { email: userInfo.email });

        //// perform the validations
        let { errors, isValid } = validateChangePassword(userInfo);
        let response = { errors, result: null };
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }
        
        //// findOne returns a promise so returning it - this is an async method.
        return UserModel.findOne({ email: userInfo.email })
        .collation({locale: "en", strength: 2})  
        .then( async (user) => {
            if(!user){
                response.errors.exception = "A user with the given email id is not found.";
                this.logService.info(response.errors.exception, { email: userInfo.email });
                return response;
            }
            this.logService.info('User info is fetched.');

            //// validate tokens
            if(user.pwdResetAttributes.token !== userInfo.token1
                || user.pwdResetAttributes.token2 !== userInfo.token2){
                response.errors.exception = "Cannot change the password. Invalid tokens for the given login.";
                this.logService.info(response.errors.exception, { email: userInfo.email });
                return response;
            }
            //// validate expiration of token
            if(user.pwdResetAttributes.expiresBy < Date.now()){
                response.errors.exception = "Cannot change password. Invalid tokens / Tokens had already expired.";
                this.logService.info(response.errors.exception, { email: userInfo.email });
                return response;
            }

            await this.updatePasswordHash(user, userInfo.password);
            
            response.result = {email: userInfo.email, IsSuccess: true, Message: "Password has been reset successfully."};
            return response;
        })
        .catch(err => {
            response.errors.exception = "Runtime Error occurred. ChangePassword With Token operation failed..";
            this.logService.error('Runtime Error occurred during Change Password With Token op.', err);
            return response;
        });
    }

    async updatePasswordHash(user, newPassword){
        let salt = user.pwdsalt;
        return bcrypt.hash(newPassword, salt)
                .then(async (hash) => {
                    let newHash = hash;

                    let updateInfo = {};
                    updateInfo['$set'] = { 
                                            password: newHash
                                        };

                    await UserModel.updateOne({_id: user._id},  updateInfo)
                        .then(async (updated) => {
                            this.logService.info('the user is updated with the new password hash.');
                            //// send the mail here
                            try {
                                await this.emailService.sendNotifyPasswordChange(user);
                            }
                            catch(err) {
                                this.logService.error('Error occurred in sending notifypasswordchange email.', err);    
                            }
                            return;
                        })
                        .catch(err => {
                            this.logService.error('Error occurred. Could not update new password hash for the user for unknown reasons.', err);
                            return;
                        });

            })
            .catch(err => {
                console.log(err);
                response.errors.exception = "Error occurred in hash operation. Could not update password for unknown reasons.";
                return response;
            });
    }


    //// ping method
    ping(){

        let response = { errors : {}, result : null};

        let dbStateVal = mongoose.connection.readyState;
        let dbState = mongoose.STATES[dbStateVal]; 
        //// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

        response.result = {
            success: true,
            pingOutput: Date.now().toString(),
            dbState: dbState,
            dbStateVal: dbStateVal
        };
        return response;
    }

    //// this is NOT supposed to be called outside this class directly
    async updateUserAttributesById(userData, currentUser, isAdminAction, mailCallBackPromise){
        this.logService.info('entered updateUserAttributesById in UserService.', {input: userData});

        //// perform validation
        let { errors, isValid } = validateUpdateUserInput(userData, currentUser, isAdminAction);
        let response = {errors, result: null};
        //// if validation failed, send back the errors to front end.
        if(!isValid){
            return response;
        }

        this.logService.info('primary validations are done.');
        
        //// get the user and validate if it is an existing user
        const userResponse = await this.getUserInfo({_id: userData._id}, currentUser);
        if(isEmpty(userResponse.result) || !isEmpty(userResponse.errors)){
            this.logService.info('The given user id does not exist / Cannot fetch the user details.' );
            response.errors.exception = 'The given user id does not exist / Cannot fetch the user details.';
            return response;
        }
        this.logService.info('fetched details of the user.');
        const fetchedUser = userResponse.result;
         
        const userUpdateInfo = userData.updateInfo;
         
        return UserModel.updateOne({_id: userData._id}, { "$set": userUpdateInfo })
            .then(updated => {
                response.result = { _id: userData._id, action: "updated" };
                if(mailCallBackPromise){
                    mailCallBackPromise(fetchedUser, currentUser);
                }
                //// TODO: async - update change log with entry. 
                this.logService.info('the user is updated.', response.result);
                //// return result
                return response;
            })
            .catch(err => {
                this.logService.error('Error occurred.', err);
                response.errors.exception = "Error occurred. Could not update user for unknown reasons.";
                return response;
            });
         
    }
 
    //// edit a user account profile information
    async editProfile(userData, currentUser){
        this.logService.info('entered editProfile in UserService.', userData);

        //// perform validation
        let { errors, isValid } = ValidateEditProfileInput(userData, currentUser);
        let response = {errors:{}, result: null};

        //// adding updateInfo for user object - this will be used in $set 
        let updateUserData = { _id : userData._id};
        updateUserData['updateInfo'] = this.getUserUpdateInfo(userData);

        //// returns a promise
        return this.updateUserAttributesById(updateUserData, currentUser, false);
    }

    getUserUpdateInfo(userData){    
        let updateInfo = {
        };
        if(userData.profileInfo.address !== undefined){
            updateInfo['profileInfo.address'] = userData.profileInfo.address;
        }
        if(userData.profileInfo.zipcode !== undefined){
            updateInfo['profileInfo.zipcode'] = userData.profileInfo.zipcode;
        }
        if(userData.profileInfo.licenseInfo !== undefined){
            updateInfo['profileInfo.licenseInfo.id'] = userData.profileInfo.licenseInfo.id;
        }
        if(userData.profileInfo.photoIdentityInfo !== undefined){
            updateInfo['profileInfo.photoIdentityInfo.id'] = userData.profileInfo.photoIdentityInfo.id;
            updateInfo['profileInfo.photoIdentityInfo.imageDocumentId'] = userData.profileInfo.photoIdentityInfo.imageDocumentId;
            updateInfo['profileInfo.photoIdentityInfo.type'] = userData.profileInfo.photoIdentityInfo.type;
        }
        return updateInfo;
    }

    //// lock a user account
    async lockUser(userData, currentUser){
        this.logService.info('entered lockUser in UserService.', userData);
        let response = {errors:{}, result: null};
 
        //// adding updateInfo & islocked - this will be used in $set 
        userData['updateInfo'] = { isLocked : true };

        //// returns a promise
        return this.updateUserAttributesById(userData, currentUser, true, this.notifyUserLocked);
    }

    //// unlock a user account
    async unlockUser(userData, currentUser){
        this.logService.info('entered unlockUser in UserService.', userData);
        let response = {errors:{}, result: null};
 
        //// adding updateInfo & islocked - this will be used in $set - for unlocking
        userData['updateInfo'] = { isLocked : false };


        //// returns a promise
        return this.updateUserAttributesById(userData, currentUser, true, this.notifyUserUnLocked);
    }

    async notifyUserLocked(userData, currentUser){
        this.logService.info('notifyUserLocked in UserService is entered.');

        let fetchedUser = {};
        ////fetch user info of user
        try {
            const userId = userData._id.toString();
            const getUserInfoResult = await this.getUserInfo({_id: userId}, currentUser);   
            fetchedUser = getUserInfoResult.result;
            this.logService.info('Fetched User Info details.', {user: fetchedUser.email}); 
        } 
        catch (error) {
            this.logService.error('Error occurred in fetching the locked user.', error);
        }
        ////notify the admin
        try {
            await this.emailService.sendLockUser(currentUser, fetchedUser);
        } 
        catch (error) {
            this.logService.error('Error occurred in sending email to admin user.', error);
        }
    }

    async notifyUserUnLocked(userData, currentUser){
        this.logService.info('notifyUserUnLocked in UserService is entered.');

        let fetchedUser = {};
        ////fetch user info of user
        try {
            const userId = userData._id.toString();
            const getUserInfoResult = await this.getUserInfo({_id: userId}, currentUser);   
            fetchedUser = getUserInfoResult.result;
            this.logService.info('Fetched User Info details.', {user: fetchedUser.email}); 
        } catch (error) {
            this.logService.error('Error occurred in fetching the unlocked user.', error);
        }
        ////notify the admin
        try {
            await this.emailService.sendLockUser(currentUser, fetchedUser, false);
        } catch (error) {
            this.logService.error('Error occurred in sending email to admin user.', error);
        }
    }

};

module.exports = UserService;