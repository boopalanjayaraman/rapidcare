import React, { Component } from "react";
import { Link } from "react-router-dom";
import { textProvider } from "../content/textProvider";
import ChooseCountry from "../views/components/ChooseCountry";
import ChooseLanguage from "../views/components/ChooseLanguage";

class Landing extends Component{

    constructor(){
        super();

        this.state = {
            chosenLanguage : "en",
            chosenCountry : "in"
        };

        this.onLanguageChange = this.onLanguageChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
    }

    
    onLanguageChange = e =>{
        this.setState({chosenLanguage : e });
    }

    onCountryChange = e =>{
        this.setState({chosenCountry : e });
    }

    render(){

        const text = textProvider();

        return (
            <div style={{ height: "75vh" }} className="container">
            <div className="row">
                <div className="col s12 center-align">
                    <p>&nbsp;</p>
                    <h4 style={{color: "rgb(90, 114, 209)"}}>
                            { text.landing_InsuranceReimagined } {" "}
                        <span style={{ fontFamily: "monospace" }}></span> 
                    </h4>
                    <p className="flow-text grey-text text-darken-1">
                        <ul>
                            <li> { text.landing_bullet_1 } <span className="black-text">{ text.landing_bullet_1_highlight }</span></li>
                            <li> { text.landing_bullet_2 } <span className="black-text">{ text.landing_bullet_2_highlight }</span>.</li>
                            <li> { text.landing_bullet_3 } <span className="black-text"> { text.landing_bullet_3_highlight }</span>{ text.landing_bullet_3_part2 }</li>
                        </ul>
                    </p>
                    <p className="flow-text grey-text text-darken-1">
                    
                    </p>
                    <br />
                    <div className="col s12 m12">
                        <Link
                            to="/browseProducts"
                            style={{
                            width: "150px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px"
                            }}
                            className="btn btn-large waves-effect waves-light hoverable violet accent-3"
                        >
                            { text.landing_products }
                        </Link>
                        &nbsp;
                        <Link
                            to="/register"
                            style={{
                            width: "150px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px"
                            }}
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                            { text.landing_signUp }
                        </Link>
                            &nbsp;
                        <Link
                            to="/login"
                            style={{
                            width: "150px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px"
                            }}
                            className="btn btn-large waves-effect waves-light hoverable red accent-3"
                        >
                            { text.landing_logIn }
                        </Link>
                    </div>
                </div>
            </div>
            <div className="row center-align">
                <div className="col s12">
                    <span className="grey-text text-darken-1"> { text.landing_time_caption } </span>
                    <p><span className="grey-text text-darken-1"> { text.landing_claim_caption } </span> </p>
                </div>
                <div>&nbsp;</div>
            </div>
            <div className="row center-align">
                <div className="col s12 m2"></div>
                <div className="col s12 m8">
                    <div className="col s12 m6">
                        <label>{ text.landing_Language  }</label> <ChooseLanguage onChange = { this.onLanguageChange }></ChooseLanguage>
                    </div>
                    <div className="col s12 m6">
                         <label> {text.landing_Country } </label> <ChooseCountry onChange = { this.onCountryChange }></ChooseCountry>
                    </div>
                </div>
                <div className="col s12 m2"></div>
            </div>
        </div>
        );
    }
}

export default Landing;