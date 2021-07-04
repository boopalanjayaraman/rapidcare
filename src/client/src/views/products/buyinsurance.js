import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getProductAction } from "../../actions/productActions";
import { textProvider } from "../../content/textProvider";
import { Link } from "react-router-dom";
import HealthDeclarationInfo from "../components/HealthDeclarationInfo";
import HolderInfo from "../components/HolderInfo";
import NomineeInfo from "../components/NomineeInfo";
import { getUserInfoToViewAction } from '../../actions/userActions';
import { getInsurancePriceAction, buyInsuranceAction, getInsuranceCheckoutUrlAction} from '../../actions/insuranceActions';
import dateFormat from "dateformat";
import constants from "../../utils/constants";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from 'react-materialize';
import PolicyTermsAndConditions from "../PolicyTermsAndConditions";

class BuyInsurance extends Component {

    constructor(){
        super();

        this.state = {
            insuranceProduct: {
                _id : "",
                friendlyId : 0,
                name : "",
                nameTranslated : {
                    en : "",
                    ta : ""
                },
                description : "",
                descriptionTranslated : {
                    en : "",
                    ta : ""
                },
                productUserType : "individual",
                productType : "health",
                subType : '',
                minPrice : 0,
                currency : "INR",
                minDuration : "weekly",
                party : "",
                country : "in",
                sumAssured : 0,
                minAge : 18,
                maxAge : 65
            },
            fullName : "",
            healthDeclarationInfo : {
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
            updatedPrice : 0.0,
            riskFactorIndex : 0.0,
            currentStartDate : new Date(), 
            currentEndDate : new Date(), 
            autoRenew : false
        };

        this.actionParam = '';

        this.onGetProduct = this.onGetProduct.bind(this);
        this.onGetUserInfo = this.onGetUserInfo.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.onGetInsurancePrice = this.onGetInsurancePrice.bind(this);
        this.onInsuranceOrderCompleted = this.onInsuranceOrderCompleted.bind(this);
        this.onCheckoutUrlReceived = this.onCheckoutUrlReceived.bind(this);
    }

    componentDidMount(){
        let getInsuranceProduct = {};
        if(this.props.match.params.id){
            getInsuranceProduct = { _id: this.props.match.params.id };
            //// read action param as well
            if(this.props.match.params.action){
                this.actionParam = this.props.match.params.action;
            }
        }
         
        //// redirect if both are not available
        if(getInsuranceProduct._id){
            this.props.getProductAction(getInsuranceProduct._id, this.onGetProduct);
        }
        else{
            this.props.history.push('/browseProducts');
        }
    }

    onGetProduct(){
        var product = this.props.productReducer.setCurrentProduct; //// using "this", bind this method.
        this.setState({
            insuranceProduct: product
        }) ; 
        //// load user (holder info)
        if(this.state.insuranceProduct.party === 'self'){
            this.getUserInfo(this.props.auth.user.id); 
        }
        window.scrollTo(0, 0);
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

    onGetInsurancePrice(insurancePrice) {
        var updatedInsurancePrice = this.props.insuranceReducer.setInsurancePrice;
        this.setState({
            updatedPrice  : updatedInsurancePrice.price.toFixed(2),
            riskFactorIndex : updatedInsurancePrice.risk_factor.toFixed(4),
        });
    }

    getUpdatedInsurancePrice(data){
        this.props.getInsurancePriceAction(data, this.onGetInsurancePrice);
    }

    onFullNameChange = e => {
        this.setState({ fullName : e.target.value });
    }

    onAutoRenewChange = e => {
        this.setState({ autoRenew : e.target.checked });
    }

    onProceedClick = e=> {
        //// create the insurance order
        let data = {
            holderInfo : this.state.holderInfo,
            healthDeclarationInfo : this.state.healthDeclarationInfo,
            sumAssured : this.state.insuranceProduct.sumAssured,
            policyPrice : this.state.updatedPrice,
            riskFactor : this.state.riskFactorIndex,
            premiumInterval : this.state.insuranceProduct.minDuration,
            currentStartDate : this.state.currentStartDate,
            currentEndDate : this.state.currentEndDate,
            autoRenew : this.state.autoRenew,
            currency : this.state.insuranceProduct.currency,
            country : localStorage['chosen_country'],
            policyProduct : this.state.insuranceProduct._id
        };
        this.props.buyInsuranceAction(data, this.onInsuranceOrderCompleted);
    }

    onInsuranceOrderCompleted(){
        try{
            //// get the insurance order
            let bought_insurance = this.props.insuranceReducer.setBoughtInsurance;
            //// get the checkout_url
            let checkout_data = {
                insuranceOrderId : bought_insurance._id,
                amount : Number(this.state.updatedPrice),
                country : bought_insurance.insuranceData.country.toUpperCase(),
                currency : bought_insurance.insuranceData.currency.toUpperCase(),
                referenceId: bought_insurance.friendlyId,
            };
            this.props.getInsuranceCheckoutUrlAction(checkout_data, this.onCheckoutUrlReceived);
        }catch(err){
            this.setState({ errors: { exception : "Error in onInsuranceOrderCompleted." + err } });
        }
    }

    onCheckoutUrlReceived(){
        try{
            //// redirect to the checkout url
            let checkout_url_data = this.props.insuranceReducer.setCheckoutUrl;
            //// redirect
            window.location.href = checkout_url_data.checkout_url;
        }catch(err){
            this.setState({ errors: { exception : "Error in onCheckoutUrlReceived." + err } });
        }
    }

    onHealthDeclarationCompleted = e => {
        //// to do: these should not be shown for contractor insurances.
        let dob = this.state.holderInfo.dateOfBirth;
        let age = this.calculateAge(dob);

        let data = {};

        if(this.state.insuranceProduct.party === 'self')
        {
            data = {
                age : age,
                overweight : (e.no_overweight ? 0 : 1),
                ped : (e.ped ? 1 : 0),
                ped2 : (e.ped2 ? 1 : 0),
                smoking :  (e.smoking ? 1 : 0),
                alcoholic : (e.alcoholic ? 1 : 0),
                undergoneProcedure : (e.undergoneProcedure ? 1 : 0),
                basePrice : this.state.insuranceProduct.minPrice
            };
        }
        else{
            //// businesses buy insurance flow - so consider other parameters as risk by default.
            data = {
                age : age,
                overweight : 1,
                ped : (e.ped ? 1 : 0),
                ped2 : (e.ped2 ? 1 : 0),
                smoking :  1,
                alcoholic : 1,
                undergoneProcedure : 1,
                basePrice : this.state.insuranceProduct.minPrice
            };
        }
        this.setState({ healthDeclarationInfo: data});
        this.getUpdatedInsurancePrice(data);
    }
     
    calculateAge (dob) {
        let currentDate = new Date(Date.now());
        let birthDate = new Date(dob);

        var years = (currentDate.getFullYear() - birthDate.getFullYear());
    
        if (currentDate.getMonth() < birthDate.getMonth() || 
        currentDate.getMonth() == birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) {
            years--;
        }
    
        return years;
    }

    onStartDateChange = e=> {
        let startDate = new Date(e);
        let endDate = new Date(e);

        if(this.state.insuranceProduct.minDuration === 'weekly'){
            endDate.setDate(endDate.getDate() + 7);
        }
        else if(this.state.insuranceProduct.minDuration === 'daily'){
            endDate.setDate(endDate.getDate() + 1);
        }
        else if(this.state.insuranceProduct.minDuration === 'monthly'){
            endDate.setDate(endDate.getDate() + 30);
        }
        
        this.setState({
            currentStartDate :  startDate,
            currentEndDate : endDate
        });
    }

    render() {

        const { user } = this.props.auth;
        const { errors } = this.state;
        const text = textProvider();

        let chosen_language = localStorage['chosen_language'] ?? 'en'; 
        let fullName = this.state.insuranceProduct.party === 'self'? user.name : this.state.fullName;
        let forSelf = this.state.insuranceProduct.party === 'self';
        let holderUserId = forSelf ? user.id : null;
        let sumAssuredText = this.state.insuranceProduct.productType === 'term' ? text.buyinsurance_SumAssured : text.buyinsurance_SumInsured;
        let price = this.state.updatedPrice == 0.0 ? this.state.insuranceProduct.minPrice.toFixed(2) : this.state.updatedPrice;
        

        return(
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <Link to="/browseProducts" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> { text.buyinsurance_Back }
                        </Link>
                    </div>
                    <div className="col s12">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                            <span className="black-text">Application - </span> { this.state.insuranceProduct.nameTranslated[chosen_language] } 
                        </h4>
                    </div>
                    <div className="col s12">
                        <div>
                            <span className="black-text">{text.browse_startsAt} </span>
                            <span className="pink-text"> 
                                {this.state.insuranceProduct.minPrice} {this.state.insuranceProduct.currency} </span>
                            <span className="black-text"> | </span> 
                            <span className="pink-text"> { text.minDuration[this.state.insuranceProduct.minDuration] } </span> 
                            <span className="black-text"> | </span> 
                            <span className="black-text"> { sumAssuredText } </span> 
                            <span className="pink-text"> {this.state.insuranceProduct.sumAssured} {this.state.          insuranceProduct.currency} 
                            </span>
                            <span className="black-text"> | </span> 
                            <span className="black-text"> {text.buyinsurance_productType} </span> 
                            <span className="pink-text"> { text.productType[this.state.insuranceProduct.productType]}  
                            </span>
                            <span className="black-text"> | </span> 
                            <span className="black-text"> {text.buyinsurance_insuredType} </span> 
                            <span className="pink-text"> { text.party[this.state.insuranceProduct.party]}  
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="black-text"> { this.state.insuranceProduct.descriptionTranslated[chosen_language]} </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ text.buyinsurance_FewSteps }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m6">
                        <label> {text.buyinsurance_fullName} </label>
                        <input
                            value={ fullName }
                            error={errors.fullName}
                            id="fullName"
                            type="text"
                            disabled = { forSelf }
                            onChange = { this.onFullNameChange }
                        />
                        <span className="red-text"> {errors.fullName} </span>
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
                        <label className="pink-text">Instruction #1: </label><label>Nominees for term life and accident insurances are automatically assigned from the insured person's RapydCare profile. </label>
                        <p><label className="pink-text">Instruction #2: </label><label>The KYC documents from the insured person's profile will be automatically used towards this insurance purchase. </label></p>
                        <label className="pink-text">Instruction #3: </label><label> For any claims disbursement, Bank / Card information from the Insured person's profile will be used.</label>         
                    </div>
                </div>
                <div className="row">
                <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "2.1 Coverage Period" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m4">
                        <label> Starts On </label>
                        <div>
                            <DatePicker selected={ this.state.currentStartDate } onChange={ this.onStartDateChange } dateFormat="dd-MMM-yyyy" /> 
                        </div>
                    </div>
                    <div className="col s12 m4"> 
                        <label> Ends On </label>
                        <div>
                            <DatePicker selected={ this.state.currentEndDate }  disabled={ true } dateFormat="dd-MMM-yyyy" />
                        </div>
                    </div>
                    <div className="col s12 m8">
                        &nbsp;
                    </div>
                    <div className="col s12 m8">
                        <label>
                            <input type="checkbox" onChange = {this.onAutoRenewChange } />
                            <span><label>Auto-renew until I cancel.</label></span>
                        </label> 
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <HealthDeclarationInfo 
                            minAge = { this.state.insuranceProduct.minAge }
                            maxAge = { this.state.insuranceProduct.maxAge }
                            onFormCompleted = { this.onHealthDeclarationCompleted }
                            forSelf = { forSelf } ></HealthDeclarationInfo>
                    </div>
                    <div className="col s12 m8">
                        <label className="pink-text">Instruction #4: </label><label>Health declarations are important and will decide the criteria of a successful claim processing. So it is very essential that we get these right. </label>       
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <span className="pink-text" style={{fontWeight: "bold"}}> Calculated Premium / Price : </span>
                        <span className="black-text" style={{fontWeight: "bold"}}>{ price } { this.state.insuranceProduct.currency } </span>
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
                                onClick={this.onProceedClick}> Order and Pay</Button>
                            ]}
                            bottomSheet={true}
                            fixedFooter={true}
                            id="Modal-0"
                            open={false}
                            trigger={ 
                                <button type="button" 
                                className="btn btn-large waves-effect waves-light hoverable red accent-3"
                                onClick = { this.onProceedClick }>
                                    Proceed
                            </button>
                             }  >
                                <p style={{fontSize:"14px"}}> { "You will be redirected to the payment screen. By proceeding, you agree to our terms and conditions below." }
                                    <div style={{height:"120px", overflow:"auto", border: "solid 1px gray", padding: "10px", marginTop: "10px"}}>
                                        <PolicyTermsAndConditions/>
                                    </div>
                                </p>
                        </Modal>  
                    </div>
                </div>
            </div>
        )
    }
}


BuyInsurance.propTypes = {
    auth: PropTypes.object.isRequired,
    getProductAction: PropTypes.func.isRequired,
    getUserInfoToViewAction : PropTypes.func.isRequired,
    getInsurancePriceAction : PropTypes.func.isRequired,
    buyInsuranceAction : PropTypes.func.isRequired,
    getInsuranceCheckoutUrlAction : PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({  //state --> denotes redux state
  auth: state.auth,
  errors: state.errors,
  productReducer: state.productReducer,
  userReducer : state.userReducer,
  insuranceReducer : state.insuranceReducer
});

export default connect(
    mapStateToProps,
    { getProductAction, getUserInfoToViewAction, getInsurancePriceAction, buyInsuranceAction, getInsuranceCheckoutUrlAction })(withRouter(BuyInsurance));