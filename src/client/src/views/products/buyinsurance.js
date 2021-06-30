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
            policyInfo : {
                health : {

                },
                term : {

                },
                workerCompensation : {

                },
                smallBusinessHealth : {

                },
                complexMedicalProcedure : {

                }
            },
            holderInfo : {
                _id: "",
                name : "-",
                mobilePhoneContact : {
                    number : ""},
                socialSecurityNumber :   "",
                nomineeInfo : {
                    name : "-",
                    contactPhoneNumber : "-"
                }
            },
            errors: {},
            updatedPrice : 0
        };

        this.actionParam = '';

        this.onGetProduct = this.onGetProduct.bind(this);
        this.onGetUserInfo = this.onGetUserInfo.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
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
            this.props.history.push('/dashboard');
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
        if(userId){
            this.props.getUserInfoToViewAction(userId, this.onGetUserInfo);
        }
    }

    onFullNameChange = e => {
        // var insuranceProduct = {...this.state.insuranceProduct}
        // insuranceProduct.name = e.target.value;
        // this.setState({insuranceProduct});
        this.setState({ fullName : e.target.value });
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
        let price = this.state.updatedPrice == 0 ? this.state.insuranceProduct.minPrice : this.state.updatedPrice;

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
                    <div className="col s12 m8">
                        <HealthDeclarationInfo 
                            minAge = { this.state.insuranceProduct.minAge }
                            maxAge = { this.state.insuranceProduct.maxAge }></HealthDeclarationInfo>
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
                <div className="row">
                    <div className="col s12 m8">
                        <button type="button" 
                            className="btn btn-large waves-effect waves-light hoverable red accent-3">
                                Proceed
                        </button>
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
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({  //state --> denotes redux state
  auth: state.auth,
  errors: state.errors,
  productReducer: state.productReducer,
  userReducer : state.userReducer
});

export default connect(
    mapStateToProps,
    { getProductAction, getUserInfoToViewAction })(withRouter(BuyInsurance));