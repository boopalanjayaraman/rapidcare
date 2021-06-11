const templates = {
    fromId: "notifications@rapydcare.com",
    userConfirmation :{
        subject: "Please confirm your Email.",
        text: ` Hello {{userName}},

                Please click the below link / visit the link in a browser, to confirm your email.
                
                {{confirmationLink}}

                Please note that this link is unique to you.

                Thanks,
                Team RapydCare.`
    },
    welcomeNote : {
        subject: "Welcome to RapydCare.com!",
        text: ` Hello {{userName}},

                Thanks for registering. We'd like to welcome you to the new era of health insurance. You made the right choice.
                
                Feel free to explore the portal!
                
                Have a good day.

                Thanks,
                Team RapydCare.`
    },
    newRegistration : {
        subject: "A new user has registered in the application.",
        text: ` Hello Administrator,

                A new user "{{userName}}" ({{userEmail}}) has registered in the application. 
                Please sign-in to the application for reviewing the account.

                Thanks,
                Team RapydCare.`
    },
    lockUser : {
        subject: "User account is locked.",
        text: ` Hello {{userName}},
        
                This is to confirm that a the user account with name - "{{lockedUserName}}", and email id - "{{lockedEmail}}" has been locked.

                Thanks,
                Team RapydCare.`
    },
    unlockUser : {
        subject: "User account is unlocked.",
        text: ` Hello {{userName}},

                This is to confirm that a the user account with name - "{{lockedUserName}}", and email id - "{{lockedEmail}}" has been unlocked.

                Thanks,
                Team RapydCare.`
    },
    resetPassword :{
        subject: "Reset your Password.",
        text: ` Hello {{userName}},

                You can use the below link to reset your password. Please note that this link is valid only for 15 minutes.
        
                If you did not initiate this, you can ignore this and nothing will change.
                
                {{resetPasswordLink}}

                Thanks,
                Team RapydCare.`
    },
    notifyPasswordChange :{
        subject: "Your Password has been changed.",
        text: ` Hello {{userName}},

                This is to notify you that your password has been successfully changed. 
                
                Please login to the application with the new password to explore opportunities.

                Thanks,
                Team RapydCare.`
    }
};

module.exports = templates;