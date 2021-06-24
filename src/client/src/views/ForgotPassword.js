import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotPasswordAction } from "../actions/userActions";
import classnames from "classnames";
import { textProvider } from "../content/textProvider";

class ForgotPassword extends Component{
    //// constructor
    constructor(){
        super();
        this.state = {
            email : "",
            message : "",
            errors: {}
        };

        this.onForgotPasswordExecuted = this.onForgotPasswordExecuted.bind(this);
    }

    componentDidMount() {
         
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
              errors: nextProps.errors
            });
          }
    }

    //// define onChange handler
    onChange = e=> {
        this.setState({ [e.target.id] : e.target.value });
    };

    //// define onSubmit handler
    onSubmit = e=> {
        e.preventDefault();

        const data = {
            email : this.state.email
        };

        this.props.forgotPasswordAction(data, this.onForgotPasswordExecuted); 
    };

    onForgotPasswordExecuted(msg){
        this.setState({ message: msg, email: "" });
    }

    //// implement render 
    render(){

        const { errors } = this.state;

        const text = textProvider();

        return (
            <div className="container">
              <div style={{ marginTop: "4rem" }} className="row">
                <div className="col s8 offset-s2">
                  <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> { text.forgotPassword_back }
                  </Link>
                  <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4 style={{color: "rgb(90, 114, 209)"}}>
                      { text.forgotPassword_title }
                    </h4>
                    {/* <p className="grey-text text-darken-1">
                      Don't have an account? <Link to="/register">Register</Link>
                    </p> */}
                  </div>
                  <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                      <input
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                        id="email"
                        type="email"
                        className={classnames("", {
                            invalid: errors.email || errors.emailnotfound
                          })}
                      />
                      <label htmlFor="email">{ text.forgotPassword_loginId }</label>
                      <span className="red-text">{errors.email} </span>
                    </div>
                    <div>
                        <span className="red-text"> {errors.exception} {errors.error} </span>
                    </div>
                    <div>
                        <span className="green-text"> {this.state.message} </span>
                    </div>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                      <button
                        style={{
                          width: "150px",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          marginTop: "1rem"
                        }}
                        type="submit"
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                      >
                        { text.forgotPassword_Submit }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
    }
}

ForgotPassword.propTypes = {
    forgotPasswordAction: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    errors: state.errors
  });

export default connect(
  mapStateToProps,
  { forgotPasswordAction }
)(ForgotPassword);