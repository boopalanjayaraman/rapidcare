import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";
import { textProvider } from "../content/textProvider";

class Login extends Component{
    //// constructor
    constructor(){
        super();
        this.state = {
            loginId : "",
            password : "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          if(!this.props.auth.user.isUser 
              && !this.props.auth.user.isAdmin){
            this.props.history.push("/myprofile");  
          }
          else{
            this.props.history.push("/dashboard");
          }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
          if(!nextProps.auth.user.isUser && !nextProps.auth.user.isAdmin){
            this.props.history.push("/myprofile");  
          }
          else{
            this.props.history.push("/dashboard");
          } // push user to dashboard when they login
        }

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
            loginId : this.state.loginId,
            password : this.state.password
        };

        this.props.loginUser(data); 
    };

    //// implement render 
    render(){

        const { errors } = this.state;

        const text = textProvider();

        return (
            <div className="container">
              <div style={{ marginTop: "4rem" }} className="row">
                <div className="col s8 offset-s2">
                  <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> { text.login_back }
                  </Link>
                  <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4 style={{color: "rgb(90, 114, 209)"}}>
                      { text.login_title }
                    </h4>
                    <p className="grey-text text-darken-1">
                      { text.login_noAccount } <Link to="/register">{ text.login_register }</Link>
                    </p>
                  </div>
                  <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                      <input
                        onChange={this.onChange}
                        value={this.state.loginId}
                        error={errors.loginId}
                        id="loginId"
                        type="email"
                        className={classnames("", {
                            invalid: errors.email || errors.emailnotfound
                          })}
                      />
                      <label htmlFor="loginId">{ text.login_loginId } </label>
                      <span className="red-text">{errors.loginId} {errors.emailnotfound} </span>
                    </div>
                    <div className="input-field col s12">
                      <input
                        onChange={this.onChange}
                        value={this.state.password}
                        error={errors.password}
                        id="password"
                        type="password"
                        className={classnames("", {
                            invalid: errors.password || errors.passwordincorrect
                          })}
                      />
                      <label htmlFor="password">{ text.login_Password }</label>
                      <span className="red-text"> {errors.password} {errors.passwordincorrect} {errors.error} </span>
                    </div>
                    <div className="col m6 s12" style={{ paddingLeft: "11.250px" }}>
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
                        { text.login_Login }
                      </button>
                    </div>
                    <div className="col m6 s12" style={{ paddingLeft: "11.250px", paddingTop: "45px" }}>
                          <Link style={{marginTop: "45px"}}  to="/ForgotPassword">{ text.login_forgotPassword }</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);