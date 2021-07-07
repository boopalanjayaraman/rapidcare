import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import { withRouter } from "react-router";
import { getUserInfoToViewAction, getMyInfoWithPaymentAction, addPaymentInfoAction} from '../../actions/userActions';
import {createPaymentmethodAction, savePaymentmethodAction} from '../../actions/paymentMethodActions';
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-materialize';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

 
import isEmpty from "is-empty";
import commonData from '../../utils/commonData';
import constants from "../../utils/constants";

class MyProfile extends Component {

    constructor(){
        super();

        this.state = {
            myInfo : {
                paymentMethodInfo :{
                }
            },
            errors: {},
            selectedFile : [],
            cardPayoutMethodType : "",
            cardNumber : "",
            cardExpiryYear : "",
            cardExpiryMonth : "",
            bankPayoutType : "",
            bankAccountNumber : "",
            RapydWalletNumber : "",
        };

        this.actionParam = '';

        let chosen_country = localStorage['chosen_country'] ?? 'in';
        
        this.onGetUserInfoWithPayment = this.onGetUserInfoWithPayment.bind(this);
        this.getUserInfoWithPayment = this.getUserInfoWithPayment.bind(this);
         
        this.payoutMethodTypes = commonData.payoutMethodTypes[chosen_country];

        this.onSaveCardComplete = this.onSaveCardComplete.bind(this);
        this.onSaveBankComplete = this.onSaveBankComplete.bind(this);
        this.SaveCardPaymentMethod = this.SaveCardPaymentMethod.bind(this);
        this.SaveBankPaymentMethod = this.SaveBankPaymentMethod.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
    }


    componentDidMount(){
        this.fetchUser();
    }

    fetchUser(){
        let userId = this.props.auth.user.id;
         
        if(userId){
            this.getUserInfoWithPayment(userId);
        }
        else{
            this.props.history.push('/dashboard');
        }
         
        if(this.props.match.params.action){
            this.actionParam = this.props.match.params.action;
        }
    }

    
    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
        this.fetchUser();
    }
    
    onGetUserInfoWithPayment() {
        let userInfo = this.props.userReducer.setMyProfile;
        try{
            this.setState({
                myInfo  : userInfo
            });
        }
        catch(err){
            console.log(err);
        }
    }

    getUserInfoWithPayment(userId) {
        if(userId != null){
            this.props.getMyInfoWithPaymentAction(userId, this.onGetUserInfoWithPayment);
        }
    }

    SaveCardBeneficiaryClick =e =>{
        let paymentMethodInfoId = "";
        if(this.state.myInfo.paymentMethodInfo === null
            || this.state.myInfo.paymentMethodInfo === undefined
            || isEmpty(this.state.myInfo.paymentMethodInfo)){
                this.props.addPaymentInfoAction({_id: this.props.auth.user.id}, this.SaveCardPaymentMethod);
        }
        else{
            paymentMethodInfoId = this.state.myInfo.paymentMethodInfo._id;
            this.SaveCardPaymentMethod(paymentMethodInfoId);
        }
    }

    SaveCardPaymentMethod(paymentMethodInfoId){
        let data = {
            _id : paymentMethodInfoId,
            method : constants.payoutMethodCard,
            payoutMethodType : this.state.cardPayoutMethodType,
            firstName : this.props.auth.user.name.split(" ")[0],
            lastName : this.props.auth.user.name.split(" ").length > 1? this.props.auth.user.name.split(" ")[1] : "nolastname",
            cardNumber: this.state.cardNumber,
            cardExpirationMonth: this.state.cardExpiryMonth,
            cardExpirationYear: this.state.cardExpiryYear,
        };

        this.props.savePaymentmethodAction(data, this.onSaveCardComplete);
    }

    onSaveCardComplete(){
        this.props.history.push("/myprofile/"+ "paymentupdated");
        window.location.reload(); 
    }

    SaveBankPaymentMethod(paymentMethodInfoId){
        let data = {
            _id : paymentMethodInfoId,
            method : constants.payoutMethodBank,
            payoutMethodType : this.state.bankPayoutType,
            firstName : this.props.auth.user.name.split(" ")[0],
            lastName : this.props.auth.user.name.split(" ").length > 1? this.props.auth.user.name.split(" ")[1] : "nolastname",
            accountNumber: this.state.bankAccountNumber,
        };

        this.props.savePaymentmethodAction(data, this.onSaveBankComplete);
    }

    onSaveBankComplete(){
        this.props.history.push("/myprofile/"+ "paymentupdated");
        window.location.reload(); 
    }

    SaveBankBeneficiaryClick =e =>{
        let paymentMethodInfoId = "";
        if(this.state.myInfo.paymentMethodInfo === null
            || this.state.myInfo.paymentMethodInfo === undefined
            || isEmpty(this.state.myInfo.paymentMethodInfo)){
                this.props.addPaymentInfoAction({_id: this.props.auth.user.id}, this.SaveBankPaymentMethod);
        }
        else{
            paymentMethodInfoId = this.state.myInfo.paymentMethodInfo._id;
            this.SaveBankPaymentMethod(paymentMethodInfoId);
        }
    }
      

    onCardPayoutMethodTypeChange = e =>{
        this.setState({cardPayoutMethodType : e.target.value});
    }

    onCardNumberChange = e =>{
        this.setState({cardNumber : e.target.value});
    }

    onCardExpiryMonthChange = e =>{
        this.setState({cardExpiryMonth : e.target.value});
    }

    onCardExpiryYearChange = e =>{
        this.setState({cardExpiryYear : e.target.value});
    }

    onBankPayoutTypeChange = e =>{
        this.setState({bankPayoutType : e.target.value});
    }

    onBankAccountNumberChange = e =>{
        this.setState({bankAccountNumber : e.target.value});
    }

    render() {
        const { user } = this.props.auth;
        const { errors } = this.state;
         
        const text = textProvider();

        let chosen_language = localStorage['chosen_language'] ?? 'en'; 
        
        let cardBeneficiaryExists = (this.state.myInfo.paymentMethodInfo !== undefined) && 
                                    (this.state.myInfo.paymentMethodInfo.rapydCardBeneficiaryId !== null) &&
                                    (this.state.myInfo.paymentMethodInfo.rapydCardBeneficiaryId !== '');

        let bankBeneficiaryExists = (this.state.myInfo.paymentMethodInfo !== undefined) && 
                                    (this.state.myInfo.paymentMethodInfo.rapydBankBeneficiaryId !== null) &&
                                    (this.state.myInfo.paymentMethodInfo.rapydBankBeneficiaryId !== '');

        let cardBeneficiaryId = isEmpty(this.state.myInfo.paymentMethodInfo) || isEmpty(this.state.myInfo.  paymentMethodInfo.rapydCardBeneficiaryId) ?
                                "-" :
                                this.state.myInfo.paymentMethodInfo.rapydCardBeneficiaryId;

        let cardPayout = isEmpty(this.state.myInfo.paymentMethodInfo) || isEmpty(this.state.myInfo.paymentMethodInfo.rapydCardPayoutMethod) ?
                        "-" :
                        this.state.myInfo.paymentMethodInfo.rapydCardPayoutMethod;

        let cardBeneficiaryText = cardBeneficiaryExists ? 
                                    "Beneficiary Id: " + cardBeneficiaryId + " | " + "Card: " + cardPayout  +""
                                    : " (None) ";


        let bankBeneficiaryId = isEmpty(this.state.myInfo.paymentMethodInfo) || isEmpty(this.state.myInfo.paymentMethodInfo.rapydBankBeneficiaryId) ?
                                    "-" :
                                    this.state.myInfo.paymentMethodInfo.rapydBankBeneficiaryId;
    
        let bankPayout = isEmpty(this.state.myInfo.paymentMethodInfo) || isEmpty(this.state.myInfo.paymentMethodInfo.rapydBankPayoutMethod) ?
                            "-" :
                            this.state.myInfo.paymentMethodInfo.rapydBankPayoutMethod;
        
        let bankBeneficiaryText = bankBeneficiaryExists ? 
                                    "Beneficiary Id: " + bankBeneficiaryId + " | " + "Bank: " + bankPayout +""
                                    : " (None) ";

        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <Link to="/dashboard" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> { "Back to dashboard" }
                        </Link>
                    </div>
                    <div className="col s12">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                             { "My Profile" } <span className="grey-text">{user.name}</span>
                        </h4>
                    </div>
                    <div className="col s12 m8">
                    <div> <label>Use your profile to keep your bank account information / card information updated with us. </label>
                        
                            <label>This is essential to receive any claim amounts, or periodic cashbacks from us.</label>
                        </div>
                        <div>
                            <label className="pink-text"><b>Note:</b> Your card / bank information is safe with us. It is stored and managed by Rapyd Payments entirely. </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                        <div style={{ display: (this.actionParam === 'paymentupdated') ? 'block': 'none'}}>
                            <div className="col m2"></div>
                            <div className="col m8 s12 center" style={{ backgroundColor: "#fffed4", border:"solid 1px #edecc0", paddingTop: "5px", paddingBottom: "5px"}}>
                                <span className = "black-text"
                                    style={{display: (this.actionParam === 'paymentupdated')? 'block': 'none'}} >
                                        Your payment method has been updated successfully.  
                                </span>
                            </div>
                            <div className="col m2"></div>
                        </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <div >
                            <span className="indigo-text"><b>{ "Your RapydCare Id" }</b></span>
                            &nbsp; <span className="black-text"> <b>{ user.id } </b></span>
                        </div>
                        <div>
                            <label className="grey-text"> Share this with another user if the person is your employer who wants to get you an insurance, your nominee / your doctor who wants to raise a claim on your behalf.</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <div >
                            <span className="indigo-text"><b>{ "Card Information" }</b></span>
                        </div>
                        <div>
                            <label className="grey-text"><b>Note:</b> Beneficiary information can be saved for all available card / bank information, but <b>Rapyd Sandbox currently supports only US-based card payouts. </b></label>
                        </div>
                    </div>
                    <div className="col s12" style={{paddingTop : "10px", paddingBottom: "10px"}}>
                        <div className="s12 m8">
                            <label className="black-text">{ "Existing Card Beneficiary information" } : </label >
                        </div>
                        <div>
                            <label className="pink-text"><b>{cardBeneficiaryText} </b></label>
                        </div>
                    </div>
                    <div className="s12 m8">
                        <div className="col s12 m4">   
                            <label className="pink-text">Card Type</label>
                                 
                                <div>
                                    <FormControl style={{width:"250px", paddingTop: "15px"}}>
                                        <Select
                                            id= { "cardPayoutMethodType" }
                                            value={ this.state.cardPayoutMethodType }
                                            onChange={ this.onCardPayoutMethodTypeChange }
                                            >
                                                { this.payoutMethodTypes['card'].map((payoutmethod) => (
                                                    <MenuItem key={ payoutmethod.value } value={ payoutmethod.value } >
                                                        { payoutmethod.text }
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="s12 m8">
                            <div className="col s12 m4">
                                <label className="pink-text">Card Number</label>
                                <input
                                    value= {this.state.cardNumber}
                                    id="cardNumber"
                                    type="text"
                                    onChange = { this.onCardNumberChange }
                                />
                            </div>
                            
                            <div className="col s12 m3">
                                    <label for="cardExpiryMonth" className="pink-text">Card Expiry Month (MM)</label>
                                    <input
                                        value= {this.state.cardExpiryMonth}
                                        id="cardExpiryMonth"
                                        type="text"
                                        onChange = { this.onCardExpiryMonthChange }
                                    />
                            </div>
                            <div className="col s12 m3">
                                    <label for="cardExpiryYear" className="pink-text">Card Expiry Year (YY)</label>
                                    <input
                                        value= {this.state.cardExpiryYear}
                                        id="cardExpiryYear"
                                        type="text"
                                        onChange = { this.onCardExpiryYearChange }
                                    />
                            </div>
                            <div className="col s12 m4">   
                                <button className="btn" onClick={ this.SaveCardBeneficiaryClick }>
                                    Save Card Beneficiary
                                </button>
                                <div>
                                    <span className="red-text">{errors.exception}</span>
                                    <span className="red-text">{errors.error}</span>
                                </div>
                            </div>
                            
                        </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div >
                            <span className="indigo-text"><b>{ "Bank Information" }</b></span>
                        </div>
                    </div>
                    <div className="col s12" style={{paddingTop : "10px", paddingBottom: "10px"}}>
                        <div >
                            <label className="black-text">{ "Existing Bank Beneficiary information" } : </label >
                        </div>
                        <div>
                            <label className="pink-text"><b>{bankBeneficiaryText} </b></label>  
                        </div>
                    </div>
                    <div className="s12 m8">
                        <div className="col s12 m4">   
                            <label className="pink-text">Bank </label>
                                <div>
                                    <FormControl style={{width:"250px", paddingTop: "15px"}}>
                                        <Select
                                            id= { "bankPayoutMethodType" }
                                            value={ this.state.bankPayoutType }
                                            onChange={ this.onBankPayoutTypeChange }
                                            >
                                                { this.payoutMethodTypes['bank'].map((payoutmethod) => (
                                                    <MenuItem key={ payoutmethod.value } value={ payoutmethod.value } >
                                                        { payoutmethod.text }
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </div>
                        </div>
                    </div>
                    <div className="s12 m8">
                            <div className="col s12 m5">
                                <label className="pink-text">Account Number</label>
                                <input
                                    value= {this.state.bankAccountNumber}
                                    id="accountNumber"
                                    type="text"
                                    onChange = { this.onBankAccountNumberChange }
                                />
                            </div>
                        </div>
                        <div className="col s12 m4">   
                            <button className="btn" onClick={ this.SaveBankBeneficiaryClick }>
                                Save Bank Beneficiary
                            </button>
                            <div>
                                <span className="red-text">{errors.exception}</span>
                                <span className="red-text">{errors.error}</span>
                            </div>
                        </div>
                        
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Identity Documents" }</b></span>
                        </div>
                    </div>
                    <div className="col s12">
                        <div className="">
                            <label  className="black-text"> None to display </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Business Documents" }</b></span>
                        </div>
                    </div>
                    <div className="col s12">
                        <div className="">
                            <label  className="black-text"> None to display </label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col s12">
                        <span className="indigo-text"><b>{ "Upload Documents" }</b></span>
                    </div>
                    <div className="col s12  m8">
                        <label className="pink-text">Upload a document (max size: 2 MB) </label>
                    </div>
                    <div className="col s8 m5 file-field input-field">
                        <div class="btn ">
                            <span>File</span>
                            <input type="file"  onChange={this.onFilesChange} ></input>
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" value={ (this.state.selectedFile.file !== undefined && this.state.selectedFile.file.name !== undefined) ? this.state.selectedFile.file.name : ""} type="text" placeholder="Upload a file"></input>
                        </div>
                    </div>
                    <div className="col s4 m6 file-field input-field">
                        <div>
                            <button className="btn" onClick={this.onFilesUpload}><i className="material-icons center">upload</i></button>
                        </div>
                    </div>
                </div>
                  
                <div>
                    <span className="red-text">{errors.exception}</span>
                    <span className="red-text">{errors.error}</span>
                </div>
                 
                 
                     
                 
            </div>
        );
    }
}


MyProfile.propTypes = {
    getMyInfoWithPaymentAction: PropTypes.func.isRequired,
    createPaymentmethodAction: PropTypes.func.isRequired,
    savePaymentmethodAction :  PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  userReducer: state.userReducer
});

export default connect(
    mapStateToProps,
    { getMyInfoWithPaymentAction, addPaymentInfoAction, savePaymentmethodAction  })(withRouter(MyProfile)); 