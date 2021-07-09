import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { textProvider } from "../../content/textProvider";
import ChooseLanguage from "../components/ChooseLanguage";
import ChooseCountry from "../components/ChooseCountry";

class Dashboard extends Component {

    constructor(){
        super();

        this.state = {
            chosenLanguage : "en",
            chosenCountry : "in"
        };

        this.isAdmin = false;

        this.onLanguageChange = this.onLanguageChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
    }

    
    onLanguageChange = e =>{
        this.setState({chosenLanguage : e });
    }

    onCountryChange = e =>{
        this.setState({chosenCountry : e });
    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();    
    };

    onBrowseClick = e => {
        e.preventDefault();
        this.props.history.push("/browseProducts");
    };

    onNewClaimClick = e => {
        e.preventDefault();
        this.props.history.push("/newClaim"); 
    };

    onViewMyInsurancesClick = e => {
        e.preventDefault();
        this.props.history.push("/viewMyInsurances");
    };

    onViewMyClaimsClick = e => {
        e.preventDefault();
        this.props.history.push("/myclaims"); 
    };

    onViewMyProfileClick = e => {
        e.preventDefault();
        this.props.history.push("/myProfile"); 
    }
 

    render() {
        const { user } = this.props.auth;

        const text = textProvider();

        this.isAdmin = this.props.auth.user.isAdmin;
        this.isUser = this.props.auth.user.isUser; //// Approved User
        this.isPartnerDoctor = this.props.auth.user.isPartnerDoctor;
        this.userType = this.props.auth.user.userType;

        this.userTypeText = text.userType[this.userType];

        return (
            <div style={{ height: "75vh" }} className="container">
                <div className="row">
                    <div className="col s2 m2 left-align">
                        <ChooseLanguage onChange = { this.onLanguageChange }></ChooseLanguage>
                    </div>
                    <div className = "col s2 m4 left-align">
                        <ChooseCountry onChange = { this.onCountryChange }></ChooseCountry>
                    </div>
                    <div className="col s12 m6 right-align">
                        <h6>
                            { text.dashboard_hello } <b>{user.name.split(' ')[0] }</b> <span className="blue-text">({this.userTypeText})</span>
                            <a href="#" title= { text.dashboard_logout_tooltip } class='red-text' onClick={this.onLogoutClick}><i className="material-icons right">exit_to_app</i> </a>
                            <a href="#" title= { text.dashboard_myProfile_tooltip } class='indigo-text' onClick={this.onViewMyProfileClick}><i className="material-icons right">account_box</i> </a>
                        </h6>
                    </div>
                </div>
                <div className="row">
                    <div class="col s12 m6">
                        <div class="card blue-grey">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">accessibility</i> <span class="card-title">{ text.dashboard_buyInsurance }</span></div>
                            <span style={{fontSize: "13px"}}> { text.dashboard_buyInsuranceDesc } </span>
                            </div>
                            <div class="card-action white-text #1e88e blue darken-2">
                                <a href="#" class='white-text' onClick={this.onBrowseClick}>{ text.dashboard_go } <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card teal">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">attach_money</i> <span class="card-title">{ text.dashboard_raiseClaim }</span></div>
                                <span style={{fontSize: "13px"}}>  { text.dashboard_raiseClaimDesc } </span>
                            </div>
                            <div class="card-action  white-text #1e88e blue darken-2">
                                <a href="#" class='white-text' onClick={this.onNewClaimClick}>{ text.dashboard_go } <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card teal">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">assignment</i> <span class="card-title"> { text.dashboard_myInsurances } </span></div>
                                <span style={{fontSize: "13px"}}>  { text.dashboard_myInsurancesDesc } </span>
                            </div>
                            <div class="card-action white-text #1e88e blue darken-2">
                                <a href="#" class='white-text'onClick={this.onViewMyInsurancesClick}>{ text.dashboard_go } <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card teal">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">assessment</i> <span class="card-title"> { text.dashboard_myClaims } </span></div>
                                <span style={{fontSize: "13px"}}> { text.dashboard_myClaimsDesc }  </span>
                            </div>
                            <div class="card-action white-text #1e88e blue darken-2">
                                <a href="#" class='white-text' onClick={this.onViewMyClaimsClick}>{ text.dashboard_go } <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser })(Dashboard);