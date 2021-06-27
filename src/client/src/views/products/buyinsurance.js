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
                party : "self",
                country : "in",
                sumAssured : 0,
                minAge : 18,
                maxAge : 65
            },
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
            nomineeInfo : {

            },
            errors: {}
        };

        this.actionParam = '';

        this.onGetProduct = this.onGetProduct.bind(this);
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
        window.scrollTo(0, 0);
    }
     

    render() {

        const { user } = this.props.auth;
        const { errors } = this.state;
        const text = textProvider();

        let chosen_language = localStorage['chosen_language'] ?? 'en'; 
        let fullName = this.state.insuranceProduct.party === 'self'? user.name : "";
        let forSelf = this.state.insuranceProduct.party === 'self';
        let holderUserId = forSelf ? user.id : "";
        let sumAssuredText = this.state.insuranceProduct.productType === 'term' ? text.buyinsurance_SumAssured : text.buyinsurance_SumInsured;

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
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <HolderInfo forSelf ={ forSelf } userId = {holderUserId}></HolderInfo>
                    </div>
                    <div className="col s12 m8">
                        <HealthDeclarationInfo 
                            minAge = { this.state.insuranceProduct.minAge }
                            maxAge = { this.state.insuranceProduct.maxAge }></HealthDeclarationInfo>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        {
                            (this.state.insuranceProduct.productType != 'health') &&
                                <NomineeInfo></NomineeInfo> 
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <button type="button" 
                            className="btn btn-large waves-effect waves-light hoverable red accent-3">
                                Proceed to buy
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
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({  //state --> denotes redux state
  auth: state.auth,
  errors: state.errors,
  productReducer: state.productReducer
});

export default connect(
    mapStateToProps,
    { getProductAction })(withRouter(BuyInsurance));