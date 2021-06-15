import React, { Component } from "react";
import { Link, withRouter, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class NoAccessMessage extends Component{

    ////constructor - initialize state and error.
    constructor(){
        super();
        this.state = {
            errors: {}
        };
    }

    componentDidMount(){
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }
 
    render(){
        //const { errors } = this.state;
        //const { classes } = this.props;

        let isUnApproved = this.props.auth.user.isUser === false;
        let isLocked = this.props.auth.user.isLocked;
        let isInActive = this.props.auth.user.isActive === false;
 
        return(
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <Link to="/dashboard" className="btn-flat waves-effect" style = {{ display:  this.props.displayAsChild? "none" : "block" }}>
                            <i className="material-icons left">keyboard_backspace</i> Back to
                            home
                        </Link>
                        <div className="col s12" style={{ paddingLeft: "0px", paddingBottom: "20px" }}>
                            <h4>
                                <b style={{ paddingBottom: "25px" }}> </b> <b> Limited Access </b>
                            </h4>
                             
                            <div style={{ paddingTop: "10px",  display: (isUnApproved || isLocked || isInActive)? 'block': 'none'}}>
                                <div className="col m2"></div>
                                <div className="col m8 s12 center" style={{ backgroundColor: "#fffed4", border:"solid 1px #edecc0", paddingTop: "5px", paddingBottom: "5px"}}>
                                    <span 
                                        style={{display: (isUnApproved)? 'block': 'none',
                                                color: "gray"}} >
                                            Your profile is yet to be approved. Meanwhile, you can edit your profile information and keep it up to date. [<a href='/myprofile'>My Profile</a>]. 
                                            You can participate in the opportunities only after your profile is approved. 
                                    </span>
                                    <span 
                                        style={{display: (isLocked)? 'block': 'none',
                                                color: "gray"}} >
                                            Your user account is currently locked. You can participate in the opportunities only after your account is unlocked. Please contact the administrator.
                                    </span>
                                    <span 
                                        style={{display: (isInActive)? 'block': 'none',
                                                color: "gray"}} >
                                            Your user account is currently inactive. You can participate in the opportunities only after your account becomes active. Please contact the administrator. 
                                    </span>
                                </div>
                                <div className="col m2"></div>
                            </div>
                        </div>
                         
                    </div>
                </div>
            </div>
        );
    }

  }
 
  NoAccessMessage.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({  //state --> denotes redux state
    auth: state.auth,
    errors: state.errors,
  });

export default  
    connect(mapStateToProps)(withRouter(NoAccessMessage));