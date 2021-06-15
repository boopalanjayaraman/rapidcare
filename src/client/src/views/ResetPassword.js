import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { changeForgotPasswordAction } from "../actions/userActions";
import classnames from "classnames";

class ResetPassword extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "", 
            token1: "",
            token2: "",
            password: "",
            password2: "",
            message : "",
            errors: {}
        };

        this.onChangeForgotPasswordExecuted = this.onChangeForgotPasswordExecuted.bind(this);
    }

    componentDidUpdate(prevProps){
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount(){
        let resetData = {};
        if(this.props.match.params.token1){
            resetData.token1 =  this.props.match.params.token1;
            //// read token2 param as well
            if(this.props.match.params.token2){
                resetData.token2 = this.props.match.params.token2;
            }
        }
        if(resetData.token1){
            this.setState( { token1 : resetData.token1});
        }
        if(resetData.token2){
            this.setState( { token2 : resetData.token2});
        }
    }

    // define onChange handler
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onChangeForgotPasswordExecuted(msg){
        this.setState({ 
            message : msg + ' Redirecting to login screen..', 
            email : "",
            password: "",
            password2 : "",
            errors: {}
        });
        setTimeout(() => {
             this.props.history.push("/login");
          }, 5000)
    }

    //// define onSubmit handler
    onSubmit = e=> {
        e.preventDefault();

        const data = {
            email : this.state.email,
            token1 : this.state.token1,
            token2 : this.state.token2,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.changeForgotPasswordAction(data, this.onChangeForgotPasswordExecuted); 
    };


    render(){

        const { errors } = this.state;

        return(
            <div className="container">
              <div style={{ marginTop: "4rem" }} className="row">
                <div className="col s8 offset-s2">
                  <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back to
                    home
                  </Link>
                  <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4>
                      <b>Reset your Password</b>
                    </h4>
                  </div>
                  <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                      <input
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                        id="email"
                        type="email"
                      />
                      <label htmlFor="email">Re-Enter your Login Id (Email)</label>
                      <span className="red-text">{errors.email} </span>
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
                        <label htmlFor="password">New Password</label>
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
                        <label htmlFor="password2">Confirm New Password</label>
                        <span className="red-text">{errors.password2}</span>
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
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        );
    }
}

ResetPassword.propTypes = {
    changeForgotPasswordAction: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    errors: state.errors
  });

export default connect(
  mapStateToProps,
  { changeForgotPasswordAction }
)(ResetPassword);