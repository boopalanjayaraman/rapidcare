import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getProductAction } from "../../actions/productActions";
import { textProvider } from "../../content/textProvider";
import { Link } from "react-router-dom";
import HolderInfo from "../components/HolderInfo";
import NomineeInfo from "../components/NomineeInfo";
import { getUserInfoToViewAction } from '../../actions/userActions';
import { getInsuranceInfoAction } from '../../actions/insuranceActions';
import { raiseClaimAction } from '../../actions/claimActions';

import dateFormat from "dateformat";
import constants from "../../utils/constants";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from 'react-materialize';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import isEmpty from "is-empty";

class RaiseClaim extends Component {

    constructor(){
        super();

        this.state = {
            insuranceProduct: {
            },
            insuranceOrderId : "",
            insuranceOrderInfo :{
            },
            holderInfo : {
                _id: "",
                name : "-",
                dateOfBirth : Date.now(),
                socialSecurityNumber :   "",
                nomineeInfo : {
                    name : "-",
                    contactPhoneNumber : "-"
                }
            },
            errors: {},
            claimName : "",
            claimType : "",
            claimFor : "self",
            claimAmount : 0.0, 
            claimRelationShip : "", 
            dateOfOccurrence : Date.now()
        };

        this.actionParam = '';

        
        this.onGetUserInfo = this.onGetUserInfo.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.onGetInsuranceOrder = this.onGetInsuranceOrder.bind(this);
        this.getInsuranceOrder = this.getInsuranceOrder.bind(this);
        this.onRaiseClaimCompleted = this.onRaiseClaimCompleted.bind(this);
    }

    componentDidMount(){
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onGetUserInfo() {
        var holderUser = this.props.userReducer.setProfileUser;
        this.setState({
            holderInfo  : holderUser
        });
    }

    getUserInfo(userId) {
        if(userId != null){
            this.props.getUserInfoToViewAction(userId, this.onGetUserInfo);
        }
    }

    

    claimPersonMeClick = e=> {
        this.setState({ 
                claimFor: 'self',
                claimType: '',
                claimRelationShip : e.target.value
            }, ()=>{
                this.getUserInfo(this.props.auth.user.id); 
        });
    }

    claimPersonNomineeClick = e=> {
        this.setState({ 
                claimFor: 'other',
                claimType: '',
                claimRelationShip : e.target.value,
                holderInfo : {
                    _id: "",
                    name : "-",
                    dateOfBirth : Date.now(),
                    socialSecurityNumber :   "",
                    nomineeInfo : {
                        name : "-",
                        contactPhoneNumber : "-"
                    }
                }
            }, ()=>{
                
        });
    }

    claimPersonPartnerDoctorClick = e=> {
        if(e.target.value !== undefined){
            this.setState({ 
                claimFor: 'other',
                claimType: '',
                claimRelationShip : e.target.value,
                holderInfo : {
                    _id: "",
                    name : "-",
                    dateOfBirth : Date.now(),
                    socialSecurityNumber :   "",
                    nomineeInfo : {
                        name : "-",
                        contactPhoneNumber : "-"
                    }
                }
            }, ()=>{
                
        });
        }
        
    }

    insuranceOrderIdChange = e=> {
        this.setState({ insuranceOrderId : e.target.value });
    }

    insuranceOrderIdEntered = e=> {
        this.setState({ insuranceOrderId : e.target.value });
        if(!isEmpty(e.target.value)){
            this.getInsuranceOrder(e.target.value);
        }
    }

    
    onGetInsuranceOrder() {
        var insuranceOrder = this.props.insuranceReducer.setInsuranceInfo;
        this.setState({
            insuranceOrderInfo  : insuranceOrder
        });
    }

    getInsuranceOrder(insuranceId) {
        if(insuranceId != null){
            this.props.getInsuranceInfoAction(insuranceId, this.onGetInsuranceOrder);
        }
    }

    claimTypeMedicalClick = e=>{
        this.setState({ claimType : 'medical' }, ()=>{    
        });
    }

    claimTypeLifeClick = e=>{
        this.setState({ claimType : 'life' }, ()=>{    
        });
    }

    onClaimNameChange = e =>{
        this.setState({ claimName : e.target.value }, ()=>{    
        });
    }

    onClaimAmountChange = e =>{
        this.setState({ claimAmount : e.target.value }, ()=>{    
        });
    }

    onDateOfOccurrenceChange = e => {
        this.setState({ dateOfOccurrence : new Date(e) }, ()=>{    
        });
    }

    onProceedClick = e=> {
        //// create the claim 
        let data = {
            name : this.state.claimName,
            holderInfo : this.state.holderInfo,
            insuranceOrderId : this.state.insuranceOrderId,
            claimType: this.state.claimType,
            dateOfOccurrence: this.state.dateOfOccurrence,
            claimRelationship : this.state.claimRelationShip,
            claimAmount : this.state.claimAmount
        };

        this.props.raiseClaimAction(data, this.onRaiseClaimCompleted);
    }

    onRaiseClaimCompleted(){
        let raisedClaim = this.props.claimReducer.setRaisedClaim;
        if(raisedClaim){
            this.props.history.push('/viewclaim/'+raisedClaim._id);
        }
    }

    render() {

        const { user } = this.props.auth;
        const { errors } = this.state;
         
        const text = textProvider();

        let chosen_language = localStorage['chosen_language'] ?? 'en'; 
        let forSelf = this.state.claimRelationShip === 'self';
        let holderUserId = forSelf ? user.id : null;
        let dateText = (this.state.claimType === 'medical' || this.state.claimType === '') ? 'Date of hospitalization' : 'Date of the unfortunate event';
        //let sumAssuredText = this.state.insuranceProduct.productType === 'term' ? text.buyinsurance_SumAssured : text.buyinsurance_SumInsured;

        let sumAssuredText = this.state.claimType === 'life' ? "Sum Assured" : "Sum Insured";

        return(
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <Link to="/dashboard" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> { "Back to dashboard" }
                        </Link>
                    </div>
                    <div className="col s12">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                             { "Raise a claim" } 
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "We know how much this means to you. We'll make this quick." }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m8" style={{paddingTop: "10px"}}>
                            <FormControl>
                            <label className="pink-text">Is this claim for you? </label>
                                <RadioGroup row aria-label= 'claimPerson' value={ "" }  >
                                    <FormControlLabel
                                        control={<Radio checked={ this.state.claimRelationShip === 'self'} />  }
                                        value = "self" 
                                        label= "yes, for me."
                                        key = {'claimPerson_option_yes'}
                                        onClick = { this.claimPersonMeClick }
                                        />
                                    <FormControlLabel
                                        control={<Radio checked={ this.state.claimRelationShip === 'nominee'} />  }
                                        value = "nominee" 
                                        label= "No, I am a nominee."
                                        key = {'claimPerson_option_no_nominee'}
                                        onClick = { this.claimPersonNomineeClick }
                                        />
                                    <FormControlLabel
                                        control={<Radio checked={ this.state.claimRelationShip === 'partnerdoctor'} />  }
                                        value = "partnerdoctor" 
                                        label= "No, I am a RapydCare partner doctor."
                                        key = {'claimPerson_option_no_partnerdoc'}
                                        disabled = { user.isPartnerDoctor === false }
                                        onClick = { this.claimPersonPartnerDoctorClick }
                                        />
                                </RadioGroup>
                            </FormControl>
                            <div>
                            <div>
                                <span className="red-text">{errors.claimRelationship}</span>    
                            </div>
                </div>
                    </div>
                    <div className="col s12 m8">
                            <FormControl>
                            <label className="pink-text">What type of claim do you want to raise? </label>
                                <RadioGroup row aria-label= 'claimType' value={ ''}  >
                                    <FormControlLabel
                                        control={<Radio checked={ this.state.claimType === 'medical'} />  }
                                        value = "medical" 
                                        label= "Medical"
                                        key = {'claimType_option_medical'}
                                        onClick = { this.claimTypeMedicalClick }
                                        />
                                    <FormControlLabel
                                        control={<Radio  checked={ this.state.claimType === 'life'}/>  }
                                        value = "life" 
                                        label= "Life"
                                        key = {'claimType_option_life'}
                                        onClick = { this.claimTypeLifeClick }
                                        />
                                     
                                </RadioGroup>
                            </FormControl>
                            <div><span className="red-text">{errors.claimType}</span></div>
                    </div>    
                    <div className="col s12 m6">
                        <label> { "Give this claim a name (optional), so you can remember. (Ex. My hospitalization in Mar 2020)"} </label>
                        <input
                            value= {this.state.claimName}
                            id="claimName"
                            type="text"
                            onChange = { this.onClaimNameChange }
                        />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col s12 m8">
                        <HolderInfo forSelf ={ forSelf } 
                                userId = {holderUserId} 
                                holderInfo = {this.state.holderInfo} 
                                onHolderChange = { this.getUserInfo }></HolderInfo>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <label className="pink-text">Instruction #1: </label><label>Any Health related claim, when approved, will disburse the amount to only the holder's bank account/ card saved as part of the holder's RapydCare profile. </label>
                        <p><label className="pink-text">Instruction #2: </label><label> In case of a life claim, when approved, the amount will be disbursed to the nominee's bank account / card saved as part of the nominee's RapydCare profile. </label></p>
                        <label className="pink-text">Instruction #3: </label><label> It is important that both the holder and nominee has the RapydCare profile up to date.</label>         
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Insurance Information" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m4">
                        <label className="pink-text"> RapydCare Insurance Id (Necessary) </label>
                        <div>
                            <input
                                value= { this.state.insuranceOrderId }
                                id="insuranceOrderId"
                                type="text"
                                onChange = { this.insuranceOrderIdChange }
                                onBlur = { this.insuranceOrderIdEntered }
                            />
                        </div>
                        <div>
                                <span className="red-text">{errors.insuranceOrderId}</span>    
                        </div>
                    </div>
                    <div className="col s12">
                        <label> Holder Name (per our records) </label> 
                        <label className="black-text"> 
                            { this.state.insuranceOrderInfo.holderId ? this.state.insuranceOrderInfo.holderId.name : "-" } </label>
                        <label> | </label> 
                        <label> Insurance Type </label> 
                        <label className="black-text"> { this.state.insuranceOrderInfo.policyProduct ? this.state.insuranceOrderInfo.policyProduct.productType  : "-"  } </label> 
                        <label> | </label> 
                        <label> { sumAssuredText } </label> 
                        <label className="black-text"> 
                        { this.state.insuranceOrderInfo.policyProduct ? this.state.insuranceOrderInfo.policyProduct.sumAssured  : "-"  } </label>
                    </div>
                    <div className="col s12 m4" style={{ display: (this.state.claimType === 'life') ? 'none' : 'block'}}>
                        <label className="pink-text"> Claim Amount </label>
                        <div>
                            <input
                                value= { this.state.claimAmount }
                                id="claimAmount"
                                type="text"
                                disabled = { this.state.claimType === 'life'}
                                onChange = { this.onClaimAmountChange }
                                maxLength = "7"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "When has this happened?" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m4">
                        <label> { dateText} </label>
                        <div>
                            <DatePicker selected={ this.state.dateOfOccurrence } onChange={ this.onDateOfOccurrenceChange } dateFormat="dd-MMM-yyyy" /> 
                        </div>
                    </div>
                </div>
                <div>
                    <span className="red-text">{errors.exception}</span>
                    <span className="red-text">{errors.error}</span>
                </div>
                <div className="row">
                    <div className="col s12 m4">
                        <Modal
                            actions={[
                                <Button modal="close" node="button" className="btn waves-effect waves-light hoverable red accent-3"
                                onClick={this.onProceedClick}> Yes, go ahead. </Button>
                            ]}
                            bottomSheet={true}
                            fixedFooter={false}
                            id="Modal-0"
                            open={false}
                            trigger={ 
                                <button type="button" 
                                className="btn btn-large waves-effect waves-light hoverable red accent-3">
                                    Raise claim
                            </button>
                             }  >
                                <p style={{fontSize:"14px"}}> { "After raising the claim, you can upload documents anytime until the claim is processed. For quick claims, please keep the necessary documents ready." }
                                </p>
                                <p style={{fontSize:"14px"}}> { "Are you sure you want to raise the claim now?" }
                                </p>
                        </Modal>  
                    </div>
                </div>
            </div>
        )
    }
}


RaiseClaim.propTypes = {
    auth: PropTypes.object.isRequired,
    getProductAction: PropTypes.func.isRequired,
    getUserInfoToViewAction : PropTypes.func.isRequired,
    getInsuranceInfoAction :  PropTypes.func.isRequired,
    raiseClaimAction :  PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({  //state --> denotes redux state
  auth: state.auth,
  errors: state.errors,
  productReducer: state.productReducer,
  userReducer : state.userReducer,
  insuranceReducer : state.insuranceReducer,
  claimReducer : state.claimReducer
});

export default connect(
    mapStateToProps,
    { getProductAction, getUserInfoToViewAction, getInsuranceInfoAction, raiseClaimAction })
    (withRouter(RaiseClaim));