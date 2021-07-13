import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import ChooseLanguage from "../components/ChooseLanguage";
import ChooseCountry from "../components/ChooseCountry";
import { withRouter } from "react-router";
import { getClaimsAction, getReviewClaimsAction } from '../../actions/claimActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import ClaimRow from "./ClaimRow";

class MyClaims extends Component {

    constructor(){
        super();

        this.state = {
            chosenLanguage : localStorage['chosen_language'] ?? 'en',
            chosenCountry : localStorage['chosen_country'] ??  'in',
            claims : [
            ],
            reviewClaims : [],
            approvalClaims : [],
            errors: {}
        };

        this.lastFriendlyId = 0;
        this.onGetClaims = this.onGetClaims.bind(this);
        this.onGetReviewClaims = this.onGetReviewClaims.bind(this);
        this.onGetApprovalClaims = this.onGetApprovalClaims.bind(this);
    }

    componentDidMount(){
        this.getMyClaims();
        
        //// get review claims
        if(this.props.auth.user.isPartnerDoctor){
            this.getMyReviewClaims();
        }
        
        //// get approval claims
        if(this.props.auth.user.isAdmin){
            this.getApprovalClaims();
        }
    }


    getMyClaims(){
        let criteria = { scenario: "getUserClaims",   lastFriendlyId: this.lastFriendlyId };
        this.props.getClaimsAction(criteria, this.onGetClaims);
    }

    getMyReviewClaims(){
        let criteria = { scenario: "getReviewClaims",   lastFriendlyId: this.lastFriendlyId };
        this.props.getReviewClaimsAction(criteria, this.onGetReviewClaims);
    }

    getApprovalClaims(){
        let criteria = { scenario: "getPendingClaims",   lastFriendlyId: this.lastFriendlyId };
        this.props.getReviewClaimsAction(criteria, this.onGetApprovalClaims);
    }

    
     
    onGetClaims(){
        let claims = this.props.claimReducer.setClaims; //// state //// using "this", bind this method.
        //// making a copy of current products to break the reference.
        let new_claims = [];
         
        for(let claim of claims){
            //// set text attributes for id attributes
            //// TODO.

            new_claims.push(claim);
            this.lastFriendlyId = claim.friendlyId;
        }
        //// set state
        this.setState({
            claims: new_claims
        }) ; 
    }

    onGetReviewClaims(){
        let claims = this.props.claimReducer.setReviewClaims; //// state //// using "this", bind this method.
        //// making a copy of current products to break the reference.
        let new_claims = [];
         
        for(let claim of claims){
            //// set text attributes for id attributes
            //// TODO.

            new_claims.push(claim);
            this.lastFriendlyId = claim.friendlyId;
        }
        //// set state
        this.setState({
            reviewClaims: new_claims
        }) ; 
    }

    onGetApprovalClaims(){
        let claims = this.props.claimReducer.setApprovalClaims; //// state //// using "this", bind this method.
        //// making a copy of current products to break the reference.
        let new_claims = [];
         
        for(let claim of claims){
            //// set text attributes for id attributes
            //// TODO.

            new_claims.push(claim);
            this.lastFriendlyId = claim.friendlyId;
        }
        //// set state
        this.setState({
            approvalClaims: new_claims
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
                            { "My Claims" }
                        </h4>
                    </div>
                </div>
                
                <div class="row">
                {
                    this.state.claims.map((claim) =>(
                         <ClaimRow claim={claim}></ClaimRow>
                    ))
                }
                </div>
                <div class="row" style={{display: this.state.claims.length > 0 ? "none" :"block" }}>
                        <div className="col s8 m8 left-align">
                            <span className="grey-text">No claims to display</span>
                        </div>
                </div>
                <div style={{ display: user.isPartnerDoctor? "block" : "none" }}>
                    <div className="row">
                        <div className="col s8 m8 left-align">
                            <h4 style={{color: "rgb(90, 114, 209)"}}>
                                { "Review Claims" }
                            </h4>
                        </div>
                    </div>
                    
                    <div class="row" class="row" style={{display: this.state.reviewClaims.length > 0 ? "block" :"none" }}>
                    {
                        this.state.reviewClaims.map((claim) =>(
                            <ClaimRow claim={claim}></ClaimRow>
                        ))
                    }   
                    </div>
                    <div class="row" style={{display: this.state.reviewClaims.length > 0 ? "none" :"block" }}>
                        <div className="col s8 m8 left-align">
                            <span className="grey-text" >No claims to display</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: user.isAdmin? "block" : "none" }}>
                    <div className="row">
                        <div className="col s8 m8 left-align">
                            <h4 style={{color: "rgb(90, 114, 209)"}}>
                                { "Approve Claims" }
                            </h4>
                        </div>
                    </div>
                    
                    <div class="row" style={{display: this.state.approvalClaims.length > 0 ? "block" :"none" }}>
                    {
                        this.state.approvalClaims.map((claim) =>(
                            <ClaimRow claim={claim}></ClaimRow>
                        ))
                    }   
                    </div>
                    <div class="row" style={{display: this.state.approvalClaims.length > 0 ? "none" :"block" }}>
                        <div className="col s8 m8 left-align">
                            <span className="grey-text" >No claims to display</span>
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


MyClaims.propTypes = {
    getClaimsAction: PropTypes.func.isRequired,
    getReviewClaimsAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  claimReducer: state.claimReducer
});

export default connect(
    mapStateToProps,
    { getClaimsAction, getReviewClaimsAction })(withRouter(MyClaims));