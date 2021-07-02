import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updatePaymentStatusAction } from "../../actions/insuranceActions";
import { Link } from "react-router-dom";

class CompletePayment extends Component {

    constructor(props){
        super(props);
        this.state = {
            confirmationResult : "",
            errors: {}
        };

        this.onPaymentCompleteUpdated = this.onPaymentCompleteUpdated.bind(this);
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
        let paymentCompleteTokenData = {};
        if(this.props.match.params.id){
            paymentCompleteTokenData = { _id: "", paymentCompleteToken: ""};
            paymentCompleteTokenData._id = this.props.match.params.id;
            //// read paymentCompleteToken param as well
            if(this.props.match.params.paymentCompleteToken){
                paymentCompleteTokenData.paymentCompleteToken = this.props.match.params.paymentCompleteToken;
            }
        }
        if(paymentCompleteTokenData._id){
            this.setState({ confirmationResult: "Updating our records.." });
            this.props.updatePaymentStatusAction(paymentCompleteTokenData, this.onPaymentCompleteUpdated);
        }
    }

    onPaymentCompleteUpdated(statusRes){   
        if(statusRes){
            this.setState({ confirmationResult: "We had updated our records. Enjoy stress-free life with RapydCare insurances." });
        }
    }


    render(){

        const { errors } = this.state;
        const insuranceId = this.props.match.params.id;

        return(
            <div className="container">
                <div class="row">
                <div className="col s12">
                        <Link to="/dashboard" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Back to dashboard
                        </Link>
                    </div>
                    <div className="col s12 m8">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                            <span className="black-text">Great! - </span> { "Payment Success Confirmation" } 
                        </h4>
                    </div>
                    <div className="col s12 m8">
                        <span className="pink-text"> {"Your Payment is successful. Thanks for the payment."} </span>
                    </div>
                    <div className="col s12 m8">
                        &nbsp;
                    </div>
                    <div className="col s12 m8">
                        <span className="grey-text"> {"Your Insurance Order Id: "} </span><span className="black-text"> { insuranceId } </span>
                    </div>
                    <div className="col s12 m8">
                        &nbsp;
                    </div>
                    <div className="col s12 m8">
                        <div>
                            <span className="grey-text"> {this.state.confirmationResult} </span>
                            <span className="red-text"> {errors.exception} {errors.error} </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CompletePayment.propTypes = {
    updatePaymentStatusAction: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    errors: state.errors
  });

export default connect(
  mapStateToProps,
  { updatePaymentStatusAction }
)(CompletePayment);