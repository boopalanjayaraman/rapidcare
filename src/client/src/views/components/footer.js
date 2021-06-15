import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classnames from "classnames";

class Footer extends Component {

    constructor(props){
        super(props);
        
    }

    componentDidUpdate(prevProps){
         
    }

    componentWillReceiveProps(nextProps){
        
    }


    render(){

        return(
                <div>
                    <div className="row">
                        <div className="col s12" style={{  textAlign: "center"  }}>
                            <label>Copyright © RapydCare. All Rights Reserved. </label>
                            <label><a target="termsAndConditionsTab" href="/TermsAndConditions">Terms of Use &amp; Privacy Policy</a></label>
                        </div>
                    </div>
                </div>
        );
    }
}

export default Footer;