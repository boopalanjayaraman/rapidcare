const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const options = require("../config/configuration").mailOptions;
const templates = require("../config/mailtemplates");
const settings = require("../config/configuration").environmentalSettings;

class EmailService {
    constructor() {
        this.mailoptions = options;
        this.transporter = {};
        this.init();
        this.currentEnvironmentPrefix = settings.mailCurrentEnvironmentPrefix;
    }

    init(){
        this.transporter = nodemailer.createTransport(this.mailoptions);
    }

    async sendMail(message){
        let messageOptions = {
            from: message.from,
            to: message.to,
            cc: message.cc? message.cc: '',
            subject: this.currentEnvironmentPrefix + message.subject,
            text: message.text,
            html: message.html
        };
        await this.transporter.sendMail(messageOptions);
    }

    async sendUserConfirmation(user, link){
        let userName = user.name;
        let confirmationLink = link;
        let to = user.email;
        let from = templates.fromId;
        let subject = templates.userConfirmation.subject;
        let text = templates.userConfirmation.text;
        text = text.replace(/\{\{userName\}\}/g, userName);
        text = text.replace(/\{\{confirmationLink\}\}/g, confirmationLink);
        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

    async sendWelcomeNote(user){
        let userName = user.name;
        let to = user.email;
        let from = templates.fromId;
        let subject = templates.welcomeNote.subject;
        let text = templates.welcomeNote.text;
        text = text.replace(/\{\{userName\}\}/g, userName);
        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

    async sendNewRegistration(user){
        let approverAdmins = settings.primaryAdmins;
        for(let approver of approverAdmins){
            let userName = user.name;
            let userEmail = user.email;
            let to = approver;
            let from = templates.fromId;
            let subject = templates.newRegistration.subject;
            let text = templates.newRegistration.text;
            text = text.replace(/\{\{userName\}\}/g, userName);
            text = text.replace(/\{\{userEmail\}\}/g, userEmail);
            //// send the email
            let message = {from, to, subject, text};
            await this.sendMail(message);
        }
    }

     async sendLockUser(adminUser, lockedUser, locked=true){
        let userName = adminUser.name;
        let lockedUserName = lockedUser.name;
        let lockedEmail = lockedUser.email;

        let to = adminUser.email;
        let from = templates.fromId;
        let subject = locked? templates.lockUser.subject : templates.unlockUser.subject;
        let text = locked? templates.lockUser.text : templates.unlockUser.text;
        text = text.replace(/\{\{userName\}\}/g, userName);
        text = text.replace(/\{\{lockedUserName\}\}/g, lockedUserName);
        text = text.replace(/\{\{lockedEmail\}\}/g, lockedEmail);

        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

    async sendResetPassword(user, link){
        let userName = user.name;
        let resetPasswordLink = link;
        let to = user.email;
        let from = templates.fromId;
        let subject = templates.resetPassword.subject;
        let text = templates.resetPassword.text;
        text = text.replace(/\{\{userName\}\}/g, userName);
        text = text.replace(/\{\{resetPasswordLink\}\}/g, resetPasswordLink);
        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

    async sendNotifyPasswordChange(user){
        let userName = user.name;
        let to = user.email;
        let from = templates.fromId;
        let subject = templates.notifyPasswordChange.subject;
        let text = templates.notifyPasswordChange.text;
        text = text.replace(/\{\{userName\}\}/g, userName);

        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

    async sendNewInsuranceOrder(user, insuranceOrder, policyInfo){
        let userName = user.name;
        let to = user.email;
        let from = templates.fromId;
        let subject = templates.newInsuranceOrder.subject;
        let text = templates.newInsuranceOrder.text;
        text = text.replace(/\{\{userName\}\}/g, userName);
        text = text.replace(/\{\{currentStartDate\}\}/g, insuranceOrder.currentStartDate);
        text = text.replace(/\{\{currentEndDate\}\}/g, insuranceOrder.currentEndDate);
        text = text.replace(/\{\{policyPrice\}\}/g, insuranceOrder.policyPrice);
        text = text.replace(/\{\{currency\}\}/g, insuranceOrder.currency);
        text = text.replace(/\{\{status\}\}/g, insuranceOrder.status);
        text = text.replace(/\{\{paymentStatus\}\}/g, insuranceOrder.paymentStatus);
        text = text.replace(/\{\{policyProduct\}\}/g, insuranceOrder.policyProduct);
        text = text.replace(/\{\{holderName\}\}/g, policyInfo.holderInfo.name);
        text = text.replace(/\{\{_id\}\}/g, insuranceOrder._id);
        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

    async sendRaiseClaim(user, claim){
        let userName = user.name;
        let to = user.email;
        let from = templates.fromId;
        let subject = templates.raiseClaim.subject;
        let text = templates.raiseClaim.text;
        text = text.replace(/\{\{userName\}\}/g, userName);
        text = text.replace(/\{\{claimType\}\}/g, claim.claimType);
        text = text.replace(/\{\{claimAmount\}\}/g, claim.claimAmount);
        text = text.replace(/\{\{currency\}\}/g, claim.currency);
        text = text.replace(/\{\{holderId\}\}/g, claim.holderId);
        text = text.replace(/\{\{insuranceId\}\}/g, claim.insuranceId);
        text = text.replace(/\{\{_id\}\}/g, claim._id);
        //// send the email
        let message = {from, to, subject, text};
        await this.sendMail(message);
    }

}

module.exports = EmailService;