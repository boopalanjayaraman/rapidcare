import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Modal, Button } from 'react-materialize';

import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import TermsAndConditions from '../views/TermsAndConditions';
import { textProvider } from "../content/textProvider";

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
          socialSecurityNumber : "",
          dateOfBirth : new Date(),
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

    onDateOfBirthChange = e=> {
        let dob = new Date(e);
        this.setState({
            dateOfBirth :  dob
        });
    }

    //define onSubmit handler
    onSubmit = e => {
        e.preventDefault();

        const freshUser = {
            username: this.state.username,
            loginId: this.state.loginId,
            password: this.state.password,
            password2: this.state.password2,
            userType: this.state.userType,
            socialSecurityNumber : this.state.socialSecurityNumber,
            dateOfBirth : this.state.dateOfBirth
        };

        this.props.registerUser(freshUser, this.props.history);
    };

    //// implement render 
    render(){
        const { errors } = this.state;
        const { classes } = this.props;

        const text = textProvider();

        return(
            <div className="container">
            <div className="row">
            <div className="col s8 offset-s2">
                <Link to="/" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> { text.register_back }
                </Link>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4 style={{color: "rgb(90, 114, 209)"}}>
                        { text.register_title }
                    </h4>
                    <p className="grey-text text-darken-1">
                        { text.register_accountExists } <Link to="/login">{ text.register_Login } </Link>
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
                    <label htmlFor="username">{ text.register_fullName }</label>
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
                    <label htmlFor="loginId">{ text.register_LoginId }</label>
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
                    <label htmlFor="password">{ text.register_Password }</label>
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
                    <label htmlFor="password2">{ text.register_ConfirmPassword }</label>
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
                                <MenuItem value="individual">{ text.register_userTypeIndividual }</MenuItem>
                                <MenuItem value="business">{ text.register_userTypeBusiness }</MenuItem>
                        </Select>
                        <span className="red-text">{errors.userType}</span>
                        {/* <label htmlFor="userType">User Type</label> */}
                </div>
                <div className="input-field col s12 m8">
                    <input
                    onChange={this.onChange}
                    value={this.state.socialSecurityNumber}
                    error={errors.socialSecurityNumber}
                    id="socialSecurityNumber"
                    type="text"
                    className={classnames("", {
                        invalid: errors.socialSecurityNumber
                      })}
                    />
                    <label htmlFor="socialSecurityNumber">{ text.register_socialSecurityNumber }</label>
                    <span className="red-text">{errors.socialSecurityNumber}</span>
                </div>
                <div className="col s12 m4">
                    <label htmlFor="dateOfBirth">{ "Date Of Birth" }</label>
                    <DatePicker selected={ this.state.dateOfBirth } onChange={ this.onDateOfBirthChange } dateFormat="dd-MMM-yyyy" /> 
                    <span className="red-text">{errors.dateOfBirth}</span>
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
                                        onClick={this.onSubmit}>{ text.register_iAgree }</Button>
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
                                        { text.register_signUp }
                                        </button>}
                                    >
                                        <p style={{fontSize:"14px"}}> { text.register_iAgreeDeclare }
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