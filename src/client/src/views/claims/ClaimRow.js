import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import ChooseLanguage from "../components/ChooseLanguage";
import ChooseCountry from "../components/ChooseCountry";
import { withRouter } from "react-router"; 
import { Link } from "react-router-dom";

class ClaimRow extends Component {

    constructor(props){
        super(props);
        this.state = {
            claim: props.claim ?? {},
            errors: {}
        };
    }

    componentDidMount(){
         
    }

    
    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
        if(nextProps.claim){
            this.setState({
                claim: nextProps.claim
            });
        }
    }
 

    render() {
        const { errors } = this.state;

        const text = textProvider();
        let claim = this.state.claim;

        return (
                <div  className="col s8 m8 left-align">
                    <div key={claim._id} style={{marginTop: "10px", marginBottom : "10px", borderLeft: "solid 3px #ee6e73"}}>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <Link to={"/viewclaim/"+ claim._id }><span>{ "Claim " + claim.friendlyId + " " + claim.name} </span></Link>
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px" }}>
                            <label className="highlightedBold" style={{color: "#49cc96"}}> { claim.status } </label> 
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <label className="pink-text">RapydCare Insurance Id </label><label className="black-text">{ claim.insuranceId._id }</label> 
                            <div><label className="pink-text">Insurance holder</label> 
                            <label className="black-text"> { claim.holderId.name }</label> <label className="pink-text">Insurance holder's RapydCare User Id</label> 
                            <label className="black-text"> { claim.holderId._id }</label> </div>
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <label>Raised on </label><label className="black-text">{ claim.raisedOn }</label> <label>by</label> 
                            <label className="black-text"> { claim.raisedBy.name }</label> 
                        </div>
                    </div>
                    <div style={{ paddingLeft: "11.250px",  borderBottom: "dotted 1px gray" }}>
                    </div>
                </div>
        );
    }
}

 
export default ClaimRow;