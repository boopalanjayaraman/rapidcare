import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { confirmEmailAction } from "../actions/userActions";

class ConfirmEmail extends Component {

    constructor(props){
        super(props);
        this.state = {
            confirmationResult : "",
            errors: {}
        };

        this.onConfirmEmailExecuted = this.onConfirmEmailExecuted.bind(this);
    }

    componentDidUpdate(prevProps){
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({
                confirmationResult : "",
                errors: nextProps.errors
            });
        }
    }

    componentDidMount(){
        let confirmationData = {};
        if(this.props.match.params.id){
            confirmationData = { _id: "", tokenCode: ""};
            confirmationData._id = this.props.match.params.id;
            //// read tokenCode param as well
            if(this.props.match.params.tokenCode){
                confirmationData.tokenCode = this.props.match.params.tokenCode;
            }
        }
        if(confirmationData._id){
            this.setState({ confirmationResult: "Verifying.." });
            this.props.confirmEmailAction(confirmationData, this.onConfirmEmailExecuted);
        }
    }

    onConfirmEmailExecuted(){
        this.setState({ confirmationResult: "Email confirmation is successful. Thanks for verifying your email." });
    }


    render(){

        const { errors } = this.state;

        return(
            <div>
                <div class="row">
                    <div className="col s12 m10">
                        <h6 className="sectionheading">Email Confirmation - RapydCare</h6>
                        <div>
                            <span> {this.state.confirmationResult} </span>
                            <span className="red-text"> {errors.exception} {errors.error} </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ConfirmEmail.propTypes = {
    confirmEmailAction: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    errors: state.errors
  });

export default connect(
  mapStateToProps,
  { confirmEmailAction }
)(ConfirmEmail);