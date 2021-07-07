import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import { withRouter } from "react-router";
import { getClaimInfoAction, reviewClaimAction, processClaimAction, uploadDocumentsAction, getDocumentsAction, getDocumentAction } from '../../actions/claimActions';
import { getInsuranceInfoAction } from '../../actions/insuranceActions';
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-materialize';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

 
import isEmpty from "is-empty";
import commonData from '../../utils/commonData';

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
            claimDocuments : [],
            currentClaimDocument : {},
            selectedFile : []
        };

        this.actionParam = '';

        this.reviewStatuses = commonData.reviewStatuses;
        
        this.onGetClaimInfo = this.onGetClaimInfo.bind(this);
        this.getClaimInfo = this.getClaimInfo.bind(this);
        this.onGetInsuranceOrder = this.onGetInsuranceOrder.bind(this);
        this.getInsuranceOrder = this.getInsuranceOrder.bind(this);
        this.onReviewClaimCompleted = this.onReviewClaimCompleted.bind(this);
        this.onApproveClaimCompleted = this.onApproveClaimCompleted.bind(this);
        this.onRejectClaimCompleted = this.onRejectClaimCompleted.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.onGetDocuments = this.onGetDocuments.bind(this);

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
            //// get the documents in parallel.
            this.getDocuments();
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

    onApprovedAmountChange = e =>{
        let claimInfo = this.state.claimInfo;
        claimInfo.approvedAmount = e.target.value;
        this.setState({
            claimInfo : claimInfo
        });
    }

    onClosingRemarksChange= e =>{
        let claimInfo = this.state.claimInfo;
        claimInfo.closingRemarks = e.target.value;
        this.setState({
            claimInfo : claimInfo
        });
    }

    onReviewRemarks2Change= e =>{
        let claimInfo = this.state.claimInfo;
        claimInfo.reviewInfo.remarks2 = e.target.value;
        this.setState({
            claimInfo : claimInfo
        });
    }

    onReviewRemarks1Change= e =>{
        let claimInfo = this.state.claimInfo;
        claimInfo.reviewInfo.remarks1 = e.target.value;
        this.setState({
            claimInfo : claimInfo
        });
    }

    onReview2StatusChange = e=>{
        let claimInfo = this.state.claimInfo;
        claimInfo.reviewInfo.review2 = e.target.value;
        this.setState({
            claimInfo : claimInfo
        });
    }

    onReview1StatusChange = e=>{
        let claimInfo = this.state.claimInfo;
        claimInfo.reviewInfo.review1 = e.target.value;
        this.setState({
            claimInfo : claimInfo
        });
    }

    onApproveClick() {

    }

    onRejectClick() {

    }

    onReviewClick(){
        let isReviewer1 = this.state.claimInfo.reviewer1._id === this.props.auth.user.id; 
        let isReviewer2 = this.state.claimInfo.reviewer2._id === this.props.auth.user.id;

        let data = {};

        if(isReviewer1){
            data = {
                _id : this.state.claimInfo._id,
                reviewStatus: this.state.claimInfo.reviewInfo.review1,
                remarks : this.state.claimInfo.reviewInfo.remarks1,
            };
        }
        else if(isReviewer2){
            data = {
                _id : this.state.claimInfo._id,
                reviewStatus: this.state.claimInfo.reviewInfo.review2,
                remarks : this.state.claimInfo.reviewInfo.remarks2,
            };
        }

        this.props.reviewClaimAction(data, this.onReviewClaimCompleted);
    }

    onReviewClaimCompleted(){
        let reloadPage = 'viewclaim/' + this.state.claimInfo._id + '/reviewed';
        this.props.history.push(reloadPage);
    }

    onApproveClaimCompleted(){
        let reloadPage = 'viewclaim/' + this.state.claimInfo._id + '/approved';
        this.props.history.push(reloadPage);
    }

    onRejectClaimCompleted(){
        let reloadPage = 'viewclaim/' + this.state.claimInfo._id + '/rejected';
        this.props.history.push(reloadPage);
    }

    onFilesChange = e=> {
        this.setState({ selectedFile: e.target.files[0] });
    }

    onFilesUpload = e=> {
        const formData = new FormData();
        formData.append("claimId", this.state.claimInfo._id);

        if(this.state.selectedFile !== null &&  this.state.selectedFile.name !== undefined){

            let file = this.state.selectedFile;
            formData.append(
                "file",
                file,
                file.name);
             
            this.props.uploadDocumentsAction(formData, this.getDocuments);
        }
    }

    getDocuments(){
        let data = { claimId : this.state.claimInfo._id};
        this.props.getDocumentsAction(data, this.onGetDocuments);
    }

    onGetDocuments(){
        let claimDocuments = this.props.claimReducer.setClaimDocumentsList;
        this.setState({
            claimDocuments  : claimDocuments
        });
        this.setState({ selectedFile : []});
    }

    onClickDocument = e => {
        let documentName = e.target.outerText;
        let data = { claimId : this.state.claimInfo._id, documentName: documentName };
        this.props.getDocumentAction(data, this.onGetDocument);
    }

    onGetDocument(){
        //let documentContent = this.props.claimReducer.setClaimDocument;
        
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
                             { "Claim Summary" } <span className="black-text">({ this.state.claimInfo.friendlyId }) { this.state.claimInfo.name }</span>
                        </h4>
                    </div>
                </div>
                <div className="row">
                        <div style={{ display: (this.actionParam === 'reviewed')|| (this.actionParam === 'approved') || (this.actionParam === 'rejected')? 'block': 'none'}}>
                            <div className="col m2"></div>
                            <div className="col m8 s12 center" style={{ backgroundColor: "#fffed4", border:"solid 1px #edecc0", paddingTop: "5px", paddingBottom: "5px"}}>

                                <span className = "black-text"
                                    style={{display: (this.actionParam === 'reviewed')? 'block': 'none'}} >
                                        Thanks, Your review has been submitted successfully. This helps.
                                </span>
                                <span className = "green-text"
                                    style={{display: (this.actionParam === 'approved')? 'block': 'none'}} >
                                        Your approval has been submitted successfully.
                                </span>
                                <span className = "red-text"
                                    style={{display: (this.actionParam === 'rejected')? 'block': 'none'}} >
                                        Your remarks have been submitted successfully.
                                </span>
                            </div>
                            <div className="col m2"></div>
                        </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div>
                            <span className="indigo-text"><b>{ "Basic Information" }</b></span>
                        </div>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Claim Name (if any)</label>
                         <span className="black-text"> {this.state.claimInfo.name } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Claim Id</label>
                         <span className="black-text"> {this.state.claimInfo._id} </span>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Friendly Id</label>
                         <span className="black-text"> {this.state.claimInfo.friendlyId} </span> 
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Claim Type</label>
                         <span className="black-text"> {this.state.claimInfo.claimType} </span> 
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Raised By</label>
                         <span className="black-text"> {this.state.claimInfo.raisedBy.name} </span> <span className="grey-text"> ({ raisedByText }) </span> 
                    </div>
                    <div className="col s12 m8" style={{ display: (this.state.claimInfo.claimType === 'life') ? 'none' : 'block'}}>
                        <label className="col s4 pink-text"> Claim Amount </label>
                        <span className="black-text"><b> { this.state.claimInfo.claimAmount } </b></span>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Raised On</label>
                         <span className="black-text"> {this.state.claimInfo.raisedOn} </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> { dateText} </label>  
                        <span className="black-text" > { this.state.claimInfo.dateOfOccurrence} </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Claim Status </label>  
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
                        <label className="col s4 pink-text"> RapydCare Insurance Id </label>  
                        <span className="black-text">{ this.state.claimInfo.insuranceId._id } </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Holder Name </label>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.holderId ? this.state.insuranceOrder.holderId.name : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Insurance Type </label> 
                        <span className="black-text"> { this.state.insuranceOrder.policyProduct ? this.state.insuranceOrder.policyProduct.productType  : "-"  } </span> 
                    </div>   
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> { sumAssuredText } </label> 
                        <span className="black-text"> { this.state.insuranceOrder.policyProduct ? this.state.insuranceOrder.policyProduct.sumAssured  : "-"  } </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Current Start Date </label>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.currentStartDate ? this.state.insuranceOrder.currentStartDate : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Current End Date </label>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.currentEndDate ? this.state.insuranceOrder.currentEndDate : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Insurance Status </label>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.status ? this.state.insuranceOrder.status : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Country </label>  
                        <span className="black-text"> 
                            { this.state.insuranceOrder.country ? this.state.insuranceOrder.country : "-" } &nbsp; </span>
                    </div>
                    <div className="col s12 m8">
                        <label className="col s4 pink-text"> Currency </label>  
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
                         <label className="col s4 pink-text">First Review Status </label>
                         <span className="black-text"> { this.state.claimInfo.reviewInfo.review1 ? this.state.claimInfo.reviewInfo.review1 : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Second Review Status </label>
                         <span className="black-text"> { this.state.claimInfo.reviewInfo.review2 ? this.state.claimInfo.reviewInfo.review2 : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">First Level Reviewer </label>
                         <span className="black-text"> { this.state.claimInfo.reviewer1.name ? this.state.claimInfo.reviewer1.name : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8">
                         <label className="col s4 pink-text">Second Level Reviewer </label>
                         <span className="black-text"> { this.state.claimInfo.reviewer2.name ? this.state.claimInfo.reviewer2.name : "-" } &nbsp;</span>
                    </div>
                    <div className="col s12 m8" style={{ display: (isApprover) ? "block" : "none"  }}>
                         <label className="col s4 pink-text">First Review Remarks </label>
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
                         <label className="col s4 pink-text">Second Review Remarks </label>
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
                            <span style={{ display:   (this.state.claimDocuments.length === 0) ? "block" : "none" }} className="black-text"> None to display </span>
                        </div>
                        <div className="">
                                { this.state.claimDocuments.map((document) => (
                                    <div>
                                        <Link onClick={this.onClickDocument } value={ document.name } to="#">{ document.name }</Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="row" style={{ display: ((isReviewer1) && (!disableReview)) ? "block" : "none"  }}>
                    <div className="col s12 m8">
                            <label className="pink-text">First Review Status </label>
                            <div>
                                <FormControl style={{width:"250px"}}>
                                    <Select
                                        id= { "review1Options" }
                                        value={ this.state.claimInfo.reviewInfo.review1 }
                                        onChange={ this.onReview1StatusChange }
                                        >
                                            { this.reviewStatuses.map((status) => (
                                                <MenuItem key={ status.value } value={ status.value } >
                                                    { status.text }
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
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
                <div className="row" style={{ display: ((isReviewer2) && (!disableReview)) ? "block" : "none"  }}>
                    <div className="col s12 m8">
                         <label className="pink-text">Second Review Status </label>
                         <div>
                            <FormControl style={{width:"250px"}}>
                                <Select
                                    id= { "review2Options" }
                                    value={ this.state.claimInfo.reviewInfo.review2 }
                                    onChange={ this.onReview2StatusChange }
                                    >
                                        { this.reviewStatuses.map((status) => (
                                            <MenuItem key={ status.value } value={ status.value } >
                                                { status.text }
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
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
                    <div className="col s12">
                        <span className="indigo-text"><b>{ "Upload Documents" }</b></span>
                    </div>
                    <div className="col s12  m8">
                        <label className="pink-text">Upload a document (max size: 2 MB) </label>
                    </div>
                    <div className="col s12 m5 file-field input-field">
                        <div class="btn ">
                            <span>File</span>
                            <input type="file"  onChange={this.onFilesChange} ></input>
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" value={ (this.state.selectedFile.file !== undefined && this.state.selectedFile.file.name !== undefined) ? this.state.selectedFile.file.name : ""} type="text" placeholder="Upload a file"></input>
                        </div>
                    </div>
                    <div className="col s12 m6 file-field input-field">
                        <div>
                            <button className="btn" onClick={this.onFilesUpload}><i className="material-icons center">upload</i></button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col s6 m4" style={{ display: ((isReviewer1 || isReviewer2) && (!disableReview)) ? "block" : "none"  }}>
                        <Modal
                            actions={[
                                <Button modal="close" node="button" className="btn waves-effect waves-light hoverable red accent-3"
                                onClick={this.onReviewClick}> Yes, go ahead. </Button>
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
                 
                    <div className="col s6 m4" style={{ display: ((isApprover) && (enableApproval)) ? "block" : "none"  }}>
                        <Modal
                            actions={[
                                <Button modal="close" node="button" className="btn waves-effect waves-light hoverable"
                                onClick={this.onApproveClick}> Yes, Approve and Disburse. </Button>
                            ]}
                            bottomSheet={true}
                            fixedFooter={false}
                            id="Modal-1"
                            open={false}
                            trigger={ 
                                <button type="button" 
                                className="btn btn-large waves-effect waves-light hoverable">
                                    Approve Claim
                            </button>
                             }  >
                                <p style={{fontSize:"14px"}}> { "Are you sure you want to approve the claim? This action will result in disbursing the claim money." }
                                </p>
                        </Modal>  
                    </div>
                    <div className="col s6 m4" style={{ display: ((isApprover) && (enableApproval)) ? "block" : "none"  }}>
                        <Modal
                            actions={[
                                <Button modal="close" node="button" className="btn waves-effect waves-light hoverable red accent-3"
                                onClick={this.onRejectClick}> Yes, Reject. </Button>
                            ]}
                            bottomSheet={true}
                            fixedFooter={false}
                            id="Modal-2"
                            open={false}
                            trigger={ 
                                <button type="button" 
                                className="btn btn-large waves-effect waves-light hoverable red accent-3">
                                    REJECT Claim
                            </button>
                             }  >
                                <p style={{fontSize:"14px"}}> { "Are you sure you want to reject the claim? This action cannot be undone." }
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
    reviewClaimAction :  PropTypes.func.isRequired,
    processClaimAction :  PropTypes.func.isRequired,
    uploadDocumentsAction: PropTypes.func.isRequired, 
    getDocumentsAction : PropTypes.func.isRequired, 
    getDocumentAction : PropTypes.func.isRequired, 
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
    { getClaimInfoAction, getInsuranceInfoAction, reviewClaimAction, processClaimAction, uploadDocumentsAction, getDocumentsAction, getDocumentAction })(withRouter(ViewClaim)); 