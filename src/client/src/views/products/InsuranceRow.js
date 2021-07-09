import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import { withRouter } from "react-router"; 
import { Link } from "react-router-dom";

class InsuranceRow extends Component {

    constructor(props){
        super(props);
        this.state = {
            insurance: props.insurance ?? {},
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
        if(nextProps.insurance){
            this.setState({
                insurance: nextProps.insurance
            });
        }
    }
 

    render() {
        const { errors } = this.state;

        const text = textProvider();
        let insurance = this.state.insurance;
        let insuranceText = insurance.policyProduct !== null && insurance.policyProduct !== undefined ?
                            insurance.policyProduct.name :
                            "";

        return (
                <div  className="col s8 m8 left-align">
                    <div key={insurance._id} style={{marginTop: "10px", marginBottom : "10px", borderLeft: "solid 3px #ee6e73"}}>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <Link to={"#"}><span>{ "Insurance " + insurance.friendlyId + " - " + insuranceText } </span></Link>
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px" }}>
                            <label className="highlightedBold" style={{color: "#49cc96"}}> { insurance.status } </label> 
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <label className="pink-text">RapydCare Insurance Id </label><label className="black-text">{ insurance._id }</label> 
                            <div><label className="pink-text">Insurance holder</label> 
                            <label className="black-text"> { insurance.holderId.name }</label> <label className="pink-text">  RapydCare User Id</label> 
                            <label className="black-text"> { insurance.holderId._id }</label> </div>
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <div><label className="pink-text">Insurance Purchased By</label> 
                            <label className="black-text"> { insurance.ownerId.name }</label> <label className="pink-text">  RapydCare User Id</label> 
                            <label className="black-text"> { insurance.ownerId._id }</label> </div>
                        </div>
                        <div style={{ paddingLeft: "11.250px", paddingBottom: "5px"}}>
                            <label>Purchased on </label><label className="black-text">{ insurance.createdOn }</label>  
                        </div>
                    </div>
                    <div style={{ paddingLeft: "11.250px",  borderBottom: "dotted 1px gray" }}>
                    </div>
                </div>
        );
    }
}

 
export default InsuranceRow;