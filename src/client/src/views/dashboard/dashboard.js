import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component {

    constructor(){
        super();

        this.isAdmin = false;
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
        this.props.history.push("/viewMyClaims"); 
    };

    onViewMyProfileClick = e => {
        e.preventDefault();
        this.props.history.push("/myProfile"); 
    }
 

    render() {
        const { user } = this.props.auth;

        this.isAdmin = this.props.auth.user.isAdmin;
        this.isUser = this.props.auth.user.isUser; //// Approved User
        this.isPartnerDoctor = this.props.auth.user.isPartnerDoctor;

        return (
            <div style={{ height: "75vh" }} className="container">
                <div className="row">
                    <div className="col s12 right-align">
                        <h6>
                            Hello, <b>{user.name.split(' ')[0] } </b>
                            <a href="#" title='Log out' class='red-text' onClick={this.onLogoutClick}><i className="material-icons right">exit_to_app</i> </a>
                            <a href="#" title='My Profile' class='indigo-text' onClick={this.onViewMyProfileClick}><i className="material-icons right">account_box</i> </a>
                        </h6>
                    </div>
                </div>
                <div className="row">
                    <div class="col s12 m6">
                        <div class="card blue-grey">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">accessibility</i> <span class="card-title">Buy Insurance</span></div>
                            <span style={{fontSize: "13px"}}>Browse our insurance products for you and your business. Get one, We got you covered!</span>
                            </div>
                            <div class="card-action white-text #1e88e blue darken-2">
                                <a href="#" class='white-text' onClick={this.onBrowseClick}>GO <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card teal">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">attach_money</i> <span class="card-title">Raise a Claim</span></div>
                                <span style={{fontSize: "13px"}}>Raise a claim and submit supporting documents. It is only a matter of minutes.</span>
                            </div>
                            <div class="card-action  white-text #1e88e blue darken-2">
                                <a href="#" class='white-text' onClick={this.onNewClaimClick}>GO <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card teal">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">assignment</i> <span class="card-title">My Insurances</span></div>
                                <span style={{fontSize: "13px"}}>View the insurances you bought in the past. Renew them.</span>
                            </div>
                            <div class="card-action white-text #1e88e blue darken-2">
                                <a href="#" class='white-text'onClick={this.onViewMyInsurancesClick}>GO <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card teal">
                            <div class="card-content #e3f2fd blue lighten-5">
                            <div className="#1e88e blue-text text-darken-2"><i className="material-icons left large">assessment</i> <span class="card-title">My Claims</span></div>
                                <span style={{fontSize: "13px"}}>View the claims raised by you in the past and their information. </span>
                            </div>
                            <div class="card-action white-text #1e88e blue darken-2">
                                <a href="#" class='white-text' onClick={this.onViewMyBidsClick}>GO <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                    {/* <div class="col s12 m4">
                        <div class="card teal">
                            <div class="card-content teal-text #80cbc4 teal lighten-5">
                            <span class="card-title">My Profile</span>
                                <span style={{fontSize: "13px"}}>View / Edit your profile information. </span>
                            </div>
                            <div class="card-action  #80cbc4 teal lighten-2">
                                <a href="#" class='white-text' onClick={this.onViewMyProfileClick}>GO <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div>
                     
                    <div class="col s12 m4">
                        <div class="card teal">
                            <div class="card-content red-text #ffebee red lighten-5">
                            <span class="card-title">Log out</span>
                                <span style={{fontSize: "13px"}}>Sign out of the application. Come back later.</span>
                            </div>
                            <div class="card-action  #e57373 red lighten-2">
                                <a href="#" class='white-text'onClick={this.onLogoutClick}>GO <i className="material-icons left">arrow_forward</i> </a>
                            </div>
                        </div>
                    </div> */}
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