import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";

import { Modal, Button } from 'react-materialize';

import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import TermsAndConditions from '../views/TermsAndConditions';

const useStyles = (theme) => ({
    select: {
      margin : theme.spacing(2),
    }
  });
  

class Register extends Component{
    //// constructor
    constructor(){
        super();

        this.state = {
          username: "",
          loginId: "",
          password: "",
          password2: "",
          userType: "individual",
          errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    // define onChange handler
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    // define onChange handler
    onUserTypeChange = e => {
        this.setState({ userType : e.target.value });
    };

    //define onSubmit handler
    onSubmit = e => {
        e.preventDefault();

        const freshUser = {
            username: this.state.username,
            loginId: this.state.loginId,
            password: this.state.password,
            password2: this.state.password2,
            userType: this.state.userType,
        };

        this.props.registerUser(freshUser, this.props.history);
    };

    //// implement render 
    render(){
        const { errors } = this.state;
        const { classes } = this.props;

        return(
            <div className="container">
            <div className="row">
            <div className="col s8 offset-s2">
                <Link to="/" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                home
                </Link>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4 style={{color: "rgb(90, 114, 209)"}}>
                    Great. Let's get you signed up.
                </h4>
                <p className="grey-text text-darken-1">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.username}
                    error={errors.username}
                    id="username"
                    type="text"
                    className={classnames("", {
                        invalid: errors.username
                      })}
                    />
                    <label htmlFor="username">Full Name</label>
                    <span className="red-text">{errors.username}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.loginId}
                    error={errors.loginId}
                    id="loginId"
                    type="text"
                    className={classnames("", {
                        invalid: errors.loginId
                      })}
                    />
                    <label htmlFor="loginId">LoginId (Email)</label>
                    <span className="red-text">{errors.loginId}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                        invalid: errors.password
                      })}
                    />
                    <label htmlFor="password">Password</label>
                    <span className="red-text">{errors.password}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                        invalid: errors.password2
                      })}
                    />
                    <label htmlFor="password2">Confirm Password</label>
                    <span className="red-text">{errors.password2}</span>
                </div>
                <div className="input-field col s12">
                        {/* <InputLabel id="userTypeLabel" style={{padding: "2px" }}>User Type</InputLabel> */}
                        <Select
                            labelId="userTypeLabel"
                            id="userType"
                            value={ this.state.userType}
                            onChange={ this.onUserTypeChange}
                            className={classnames("input-field col s12", {
                                invalid: errors.userType
                              })}
                            >
                                <MenuItem value="individual">Individual</MenuItem>
                                <MenuItem value="organization" disabled={true} >organization</MenuItem>
                        </Select>
                        <span className="red-text">{errors.userType}</span>
                        {/* <label htmlFor="userType">User Type</label> */}
                </div>
                <div>
                    <span className="red-text">{errors.exception}</span>
                    <span className="red-text">{errors.error}</span>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                 
                </div>
                        <div className="input-field col s12 m4 nospace">
                                <Modal
                                    actions={[
                                        <Button modal="close" node="button" waves="green" 
                                        onClick={this.onSubmit}>Yes, I agree</Button>
                                    ]}
                                    bottomSheet={true}
                                    fixedFooter={false}
                                    id="Modal-0"
                                    open={false}
                                    trigger={<button
                                        style={{
                                            width: "150px",
                                            borderRadius: "3px",
                                            letterSpacing: "1.5px",
                                            marginTop: "1rem"
                                        }}
                                        className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                                        Sign up
                                        </button>}
                                    >
                                        <p style={{fontSize:"14px"}}> By clicking on "Yes, I agree" and continuing to sign up, you agree to our terms and conditions below.
                                        <div style={{height:"130px", overflow:"auto", border: "solid 1px gray", padding: "10px", marginTop: "10px"}}>
                                            <TermsAndConditions/>
                                        </div>
                                    </p>
                                </Modal>  
                    </div>
                </form>
            </div>
            </div>
        </div>
        );
    }

}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

export default withStyles(useStyles)(
    connect(
    mapStateToProps,
    { registerUser }
  )(withRouter(Register))
  );