import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import ChooseLanguage from "../components/ChooseLanguage";
import ChooseCountry from "../components/ChooseCountry";
import { withRouter } from "react-router";
import { getInsurancesAction } from '../../actions/insuranceActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import InsuranceRow from "./InsuranceRow";

class MyInsurances extends Component {

    constructor(){
        super();

        this.state = {
            chosenLanguage : localStorage['chosen_language'] ?? 'en',
            chosenCountry : localStorage['chosen_country'] ??  'in',
            insurances : [
            ],
            errors: {}
        };

        this.lastFriendlyId = 0;
        this.onGetInsurances = this.onGetInsurances.bind(this);
    }

    componentDidMount(){
        this.getMyInsurances();
    }


    getMyInsurances(){
        let criteria = { scenario: "getUserInsurances",   lastFriendlyId: this.lastFriendlyId };
        this.props.getInsurancesAction(criteria, this.onGetInsurances);
    }
 
    
     
    onGetInsurances(){
        let insurances = this.props.insuranceReducer.setInsurances; //// state //// using "this", bind this method.
        //// making a copy of current list to break the reference.
        let new_insurances = [];
         
        for(let insurance of insurances){
            //// set text attributes for id attributes
            //// TODO.

            new_insurances.push(insurance);
            this.lastFriendlyId = insurance.friendlyId;
        }
        //// set state
        this.setState({
            insurances: new_insurances
        }) ; 
    }
    

    render() {
        const { user } = this.props.auth;
        const { errors } = this.state;

        const text = textProvider();


        return (
            <div style={{ height: "75vh" }} className="container">
                <div className="row">
                    <div className="col s12">
                        <Link to="/dashboard" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> { "Back to dashboard" }
                        </Link>
                    </div>
                    <div className="col s8 m8 left-align">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                            { "My Insurances" }
                        </h4>
                    </div>
                </div>
                
                <div class="row">
                {
                    this.state.insurances.map((insurance) =>(
                         <InsuranceRow insurance={insurance}></InsuranceRow>
                    ))
                }
                </div>
                <div class="row" style={{display: this.state.insurances.length > 0 ? "none" :"block" }}>
                        <div className="col s8 m8 left-align">
                            <span className="grey-text">No Insurances to display</span>
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


MyInsurances.propTypes = {
    getInsurancesAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  insuranceReducer: state.insuranceReducer
});

export default connect(
    mapStateToProps,
    { getInsurancesAction })(withRouter(MyInsurances));