import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component{
    render(){
        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
            <div className="row">
            <div className="col s12 center-align">
                <h4 style={{color: "rgb(90, 114, 209)"}}>
                Insurance reimagined. {" "}
                <span style={{ fontFamily: "monospace" }}></span> 
                </h4>
                <p className="flow-text grey-text text-darken-1">
                    <ul>
                        <li>Small-ticket insurances for <span className="black-text">Life &amp; Healthcare.</span></li>
                        <li>Protect when it <span className="black-text">matters</span>.</li>
                        <li>Claims in<span className="black-text"> hours</span>, not in days.</li>
                    </ul>
                </p>
                <p className="flow-text grey-text text-darken-1">
                
                </p>
                <br />
                <div className="col s4 m4">
                <Link
                    to="/browse"
                    style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                    }}
                    className="btn btn-large waves-effect waves-light hoverable violet accent-3"
                >
                    Products
                </Link>
                </div>
                <div className="col s4 m4">
                <Link
                    to="/register"
                    style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                    }}
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                    Sign up
                </Link>
                
                </div>
                <div className="col s4 m4">
                <Link
                    to="/login"
                    style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                    }}
                    //className="btn btn-large btn-flat waves-effect white black-text"
                    className="btn btn-large waves-effect waves-light hoverable red accent-3"
                >
                    Log In
                </Link>
                </div>
            </div>
            </div>
        </div>
        );
    }
}

export default Landing;