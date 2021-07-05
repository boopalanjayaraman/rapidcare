import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import { withRouter } from "react-router";
import { getClaimInfoAction } from '../../actions/claimActions';
import { getInsuranceInfoAction } from '../../actions/insuranceActions';
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-materialize';
 
import isEmpty from "is-empty";

class ViewClaim extends Component {

    constructor(){
        super();

        this.state = {
            claimInfo : {
                _id : "",
                friendlyId : "",
                name : "",
                claimType : "",
                dateOfOccurrence : Date.now(),
                claimAmount : 0.0, 
                insuranceId :{
                },
                holderId : {
                    _id: "",
                    name : "-",
                    dateOfBirth : Date.now(),
                    socialSecurityNumber :   "",
                    nomineeInfo : {
                        name : "-",
                        contactPhoneNumber : "-"
                    }
                },
                status : "",
                raisedBy : {
                    _id: "",
                    name : "-",
                },
                raisedOn : Date.now(),
                isNominee : false,
                isPartnerDoctor : false,
                approvedAmount : 0.0,
                reviewer1 : {
                    _id: "",
                    name : "-",
                },
                reviewer2 : {
                    _id: "",
                    name : "-",
                },
                closingRemarks : "",
                reviewInfo : {
                    review1 : "",
                    review2 : "",
                    remarks1 : "",
                    remarks2 : ""
                }
            },
            insuranceOrder : {},
            errors: {},
        };

        this.actionParam = '';
        
        this.onGetClaimInfo = this.onGetClaimInfo.bind(this);
        this.getClaimInfo = this.getClaimInfo.bind(this);
        this.onGetInsuranceOrder = this.onGetInsuranceOrder.bind(this);
        this.getInsuranceOrder = this.getInsuranceOrder.bind(this);
    }

    componentDidMount(){
        let getClaim = {};
        if(this.props.match.params.id){
            getClaim = { _id: this.props.match.params.id };
            //// read action param as well
            if(this.props.match.params.action){
                this.actionParam = this.props.match.params.action;
            }
        }
         
        //// redirect if both are not available
        if(getClaim._id){
            this.getClaimInfo(getClaim._id);
        }
        else{
            this.props.history.push('/dashboard');
        }
    }

    
    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }
    
    onGetClaimInfo() {
        var claimInfo = this.props.claimReducer.setClaimInfo;
        this.setState({
            claimInfo  : claimInfo
        }, 
        () => {
            //// call back
            let insuranceId = this.state.claimInfo.insuranceId._id;
            this.getInsuranceOrder(insuranceId);
        });
    }

    getClaimInfo(claimId) {
        if(claimId != null){
            this.props.getClaimInfoAction(claimId, this.onGetClaimInfo);
        }
    }
    
    
    onGetInsuranceOrder() {
        var insuranceOrder = this.props.insuranceReducer.setInsuranceInfo;
        this.setState({
            insuranceOrder  : insuranceOrder
        });
    }

    getInsuranceOrder(insuranceId) {
        if(insuranceId != null){
            this.props.getInsuranceInfoAction(insuranceId, this.onGetInsuranceOrder);
        }
    }


    render() {
        const { user } = this.props.auth;
        const { errors } = this.state;
         
        const text = textProvider();

        let chosen_language = localStorage['chosen_language'] ?? 'en'; 
        let isReviewer1 = this.state.claimInfo.reviewer1._id === user.id; 
        let isReviewer2 = this.state.claimInfo.reviewer2._id === user.id;
        let isApprover = user.isAdmin;
        let claimOwner = this.state.claimInfo.raisedBy._id === user.id;

        let raisedByText = this.state.claimInfo.isNominee ? "Nominee" :
                        this.state.claimInfo.isPartnerDoctor ? "Partner Doctor" : "Self";
        
        let sumAssuredText = this.state.claimInfo.claimType === 'life' ? "Sum Assured" : "Sum Insured";
        let dateText = (this.state.claimInfo.claimType === 'medical' || this.state.claimInfo.claimType === '') ? 'Date of hospitalization' : 'Date of the unfortunate event';

        let disableReview = this.state.claimInfo.status !== 'initiated' 
                            && this.state.claimInfo.status !== 'in-review'; 

        let enableApproval = this.state.claimInfo.status !== 'approved' 
                                && this.state.claimInfo.status !== 'rejected'
                                && this.state.claimInfo.status !== 'initiated'; 

        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <Link to="/myclaims" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> { "Back to dashboard" }
                        </Link>
                    </div>
                    <div className="col s12">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                             { "Claim information" } <span className="black-text">({ this.state.claimInfo.friendlyId }) { this.state.claimInfo.name }</span>
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Basic Information" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Claim Name (if any)</span>
                         <span className="black-text"> {this.state.claimInfo.name } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Claim Id</span>
                         <span className="black-text"> {this.state.claimInfo._id} </span>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Friendly Id</span>
                         <span className="black-text"> {this.state.claimInfo.friendlyId} </span> 
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Claim Type</span>
                         <span className="black-text"> {this.state.claimInfo.claimType} </span> 
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Raised By</span>
                         <span className="black-text"> {this.state.claimInfo.raisedBy.name} </span> <span className="grey-text"> ({ raisedByText }) </span> 
                    </div>
                    <div className="col s12 m8" style={{ display: (this.state.claimInfo.claimType === 'life') ? 'none' : 'block'}}>
                        <span className="col s4 pink-text"> Claim Amount </span>
                        <span className="black-text"><b> { this.state.claimInfo.claimAmount } </b></span>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Raised On</span>
                         <span className="black-text"> {this.state.claimInfo.raisedOn} </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> { dateText} </span>  
                        <span className="black-text" > { this.state.claimInfo.dateOfOccurrence} </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Claim Status </span>  
                        <span className="black-text"> <b>
                            { this.state.claimInfo.status ? this.state.claimInfo.status : "-" } </b> &nbsp; </span>
                    </div>
                </div>
                 
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Insurance Information" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> RapydCare Insurance Id </span>  
                        <span className="black-text">{ this.state.claimInfo.insuranceId._id } </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Holder Name </span>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.holderId ? this.state.insuranceOrder.holderId.name : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Insurance Type </span> 
                        <span className="black-text"> { this.state.insuranceOrder.policyProduct ? this.state.insuranceOrder.policyProduct.productType  : "-"  } </span> 
                    </div>   
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> { sumAssuredText } </span> 
                        <span className="black-text"> { this.state.insuranceOrder.policyProduct ? this.state.insuranceOrder.policyProduct.sumAssured  : "-"  } </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Current Start Date </span>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.currentStartDate ? this.state.insuranceOrder.currentStartDate : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Current End Date </span>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.currentEndDate ? this.state.insuranceOrder.currentEndDate : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Insurance Status </span>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.status ? this.state.insuranceOrder.status : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Country </span>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.country ? this.state.insuranceOrder.country : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <span className="col s4 pink-text"> Currency </span>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.currency ? this.state.insuranceOrder.currency : "-" } &nbsp; </span>
                    </div>

                </div>
                <div className="row" style={{ display: (isReviewer1 || isReviewer2 || isApprover) ? "block" : "none"  }}>
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Claim Review Information" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">First Review Status </span>
                         <span className="black-text"> { this.state.claimInfo.reviewInfo.review1 ? this.state.claimInfo.reviewInfo.review1 : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Second Review Status </span>
                         <span className="black-text"> { this.state.claimInfo.reviewInfo.review2 ? this.state.claimInfo.reviewInfo.review2 : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">First Level Reviewer </span>
                         <span className="black-text"> { this.state.claimInfo.reviewer1.name ? this.state.claimInfo.reviewer1.name : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <span className="col s4 pink-text">Second Level Reviewer </span>
                         <span className="black-text"> { this.state.claimInfo.reviewer2.name ? this.state.claimInfo.reviewer2.name : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8" style={{ display: (isApprover) ? "block" : "none"  }}>
                         <span className="col s4 pink-text">First Review Remarks </span>
                         {/* <span className="black-text"> { this.state.claimInfo.reviewInfo.remarks1 ? this.state.claimInfo.reviewInfo.remarks1 : "-" }</span>  */}
                         <textarea 
                            value={  this.state.claimInfo.reviewInfo.remarks1 ? this.state.claimInfo.reviewInfo.remarks1 : ""}
                            multiple={true}
                            id="remarks1_view"
                            type="text"
                            className="materialize-textarea col s4"
                            maxLength="200"
                            rows="5"
                            style={{ overflowY: "scroll"}}
                            readOnly = { true }
                        ></textarea>
                    </div>
                    <div className="col s12 m8" style={{ display: (isApprover) ? "block" : "none"  }}>
                         <span className="col s4 pink-text">Second Review Remarks </span>
                         <textarea 
                            value={  this.state.claimInfo.reviewInfo.remarks2 ? this.state.claimInfo.reviewInfo.remarks2 : ""}
                            multiple={true}
                            id="remarks2_view"
                            type="text"
                            className="materialize-textarea col s4"
                            maxLength="200"
                            rows="5"
                            style={{ overflowY: "scroll"}}
                            readOnly = { true }
                        ></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Supporting Documents" }</b></span>
                        </div>
                    </div>
                    <div className="col s12">
                        <div className="">
                            <span className="black-text"> None to display </span>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ display: ((isReviewer1 || isApprover) && (!disableReview)) ? "block" : "none"  }}>
                    <div className="col s12 m8">
                         <div><label className="pink-text">First Review Remarks </label></div>
                         <textarea 
                            value={this.state.claimInfo.reviewInfo.remarks1}
                            multiple={true}
                            id="remarks1"
                            type="text"
                            onChange={this.onReviewRemarks1Change}
                            className="materialize-textarea"
                            maxLength="200"
                            rows="5"
                            style={{ overflowY: "scroll"}}
                            readOnly = { disableReview }
                        ></textarea>
                    </div>
                </div>
                <div className="row" style={{ display: ((isReviewer2 || isApprover) && (!disableReview)) ? "block" : "none"  }}>
                    <div className="col s12 m8">
                         <label className="pink-text">Second Review Remarks </label>
                         <textarea 
                            value={this.state.claimInfo.reviewInfo.remarks2}
                            multiple={true}
                            id="remarks2"
                            type="text"
                            onChange={this.onReviewRemarks2Change}
                            className="materialize-textarea"
                            maxLength="200"
                            rows="5"
                            style={{ overflowY: "scroll"}}
                            readOnly = { disableReview }
                        ></textarea>
                    </div>
                </div>
                <div className="row" style={{ display: (isApprover && enableApproval) ? "block" : "none"  }}>
                    <div className="col s12 m8">
                         <label className="pink-text">Approved Amount </label>
                         <div>
                            <input
                                value= { this.state.claimInfo.approvedAmount }
                                id="approvedAmount"
                                type="text"
                                onChange = { this.onApprovedAmountChange }
                                maxLength = "7"
                            />
                        </div>
                    </div>
                    <div className="col s12 m8">
                         <label className="pink-text">Closing Remarks </label>
                         <textarea 
                            value={this.state.claimInfo.closingRemarks}
                            multiple={true}
                            id="closingRemarks"
                            type="text"
                            onChange={this.onClosingRemarksChange}
                            className="materialize-textarea"
                            maxLength="200"
                            rows="5"
                            style={{ overflowY: "scroll"}}
                            readOnly = { !enableApproval }
                        ></textarea>
                    </div>
                </div>
                <div>
                    <span className="red-text">{errors.exception}</span>
                    <span className="red-text">{errors.error}</span>
                </div>
                <div className="row">
                    <div className="col s6 m4" style={{ display: ((isReviewer1 || isReviewer2 || isApprover) && (!disableReview)) ? "block" : "none"  }}>
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
                                    Save Review
                            </button>
                             }  >
                                <p style={{fontSize:"14px"}}> { "Are you sure you want to save the review comments for the claim?" }
                                </p>
                        </Modal>  
                    </div>
                 
                    <div className="col s6 m4">
                        <Modal
                            actions={[
                                <Button modal="close" node="button" className="btn waves-effect waves-light hoverable red accent-3"
                                onClick={this.onProceedClick}> Yes, Approve and Disburse. </Button>
                            ]}
                            bottomSheet={true}
                            fixedFooter={false}
                            id="Modal-0"
                            open={false}
                            trigger={ 
                                <button type="button" 
                                className="btn btn-large waves-effect waves-light hoverable red accent-3">
                                    Approve Claim
                            </button>
                             }  >
                                <p style={{fontSize:"14px"}}> { "Are you sure you want to approve the claim? This action will result in disbursing the claim money." }
                                </p>
                        </Modal>  
                    </div>
                </div>
            </div>
        );
    }
}


ViewClaim.propTypes = {
    getClaimInfoAction: PropTypes.func.isRequired,
    getInsuranceInfoAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  claimReducer: state.claimReducer,
  insuranceReducer : state.insuranceReducer
});

export default connect(
    mapStateToProps,
    { getClaimInfoAction, getInsuranceInfoAction })(withRouter(ViewClaim));