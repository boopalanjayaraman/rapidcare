import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class BuyInsurance extends Component {

    constructor(){
        super();

        this.state = {
            errors: {}
        };
    }

    componentDidMount(){
         
    }

    render() {
        return(
            <div></div>
        )
    }
}


BuyInsurance.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
    mapStateToProps,
    { })(withRouter(BuyInsurance));