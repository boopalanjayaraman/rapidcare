import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { textProvider } from "../../content/textProvider";
import ChooseLanguage from "../components/ChooseLanguage";
import ChooseCountry from "../components/ChooseCountry";
import { withRouter } from "react-router";
import { browseProductsAction } from '../../actions/productActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import inHealthInsuranceImage from '../../images/in_health_insurance.jpg'
import usHealthInsuranceImage from '../../images/us_health_insurance.jpg'

class Browse extends Component {

    constructor(){
        super();

        this.state = {
            chosenLanguage : localStorage['chosen_language'] ?? 'en',
            chosenCountry : localStorage['chosen_country'] ??  'in',
            products : [
            ],
            userType : 'individual',
            errors: {}
        };

        this.onLanguageChange = this.onLanguageChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);

        this.onGetProducts = this.onGetProducts.bind(this);
        this.getProducts = this.getProducts.bind(this);
    }

    componentDidMount(){
        this.getProducts();
    }


    getProducts(){
        let criteria = { scenario: "browseProducts", country: this.state.chosenCountry, lastFriendlyId: this.lastFriendlyId };
        this.props.browseProductsAction(criteria, this.onGetProducts);
    }
    
    onLanguageChange = e =>{
        this.setState({chosenLanguage : e });
    }

    onCountryChange = e =>{
        this.setState({chosenCountry : e }, ()=>{
            this.getProducts();
        });
    }

    onUserTypeChange = e =>{
        this.setState({userType : e.target.value }, ()=>{
        });
    }

    onGetProducts(){
        let products = this.props.productReducer.browseProducts; //// state //// using "this", bind this method.

        //// making a copy of current products to break the reference.
        let new_products = [];
         
        for(let product of products){
            //// set text attributes for id attributes
            //// TODO.

            new_products.push(product);
            this.lastFriendlyId = 0;
        }
        //// set state
        this.setState({
            products: new_products
        }) ; 
    }
    

    render() {
        const { user } = this.props.auth;
        const { errors } = this.state;

        const text = textProvider();

        let filteredProducts = [];

        if(this.state.products){
            filteredProducts = this.state.products.filter((prod) => prod.productUserType === this.state.userType);
        }

        let titleFontSize = "";
        if(this.state.chosenLanguage === 'en'){
            titleFontSize = "1em"
        }
        else{
            titleFontSize = "0.6em"
        }
        let cardImageHeight = "250px";



        return (
            <div style={{ height: "75vh" }} className="container">
                <div className="row">
                    <div className="col s8 m8 left-align">
                        <h4 style={{color: "rgb(90, 114, 209)"}}>
                            { text.browse_insuranceProducts }
                        </h4>
                    </div>
                    <div className="col s2 m2 right-align">
                        <h4><ChooseLanguage onChange = { this.onLanguageChange }></ChooseLanguage></h4>
                    </div>
                    <div className = "col s2 m2 right-align">
                        <h4><ChooseCountry onChange = { this.onCountryChange }></ChooseCountry></h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m6">
                        <Select
                            id="userType"
                            value={ this.state.userType}
                            onChange={ this.onUserTypeChange}
                            >
                                <MenuItem value="individual"> {text.browse_forIndividuals} </MenuItem>
                                <MenuItem value="business"> {text.browse_forBusinesses} </MenuItem>
                        </Select>
                    </div>
                </div>
                <div class="row">
                {
                    filteredProducts.map((prod) =>(
                        <div class="col s12 m4">
                            <div class="card">
                                <div class="card-image">
                                    {
                                        this.state.chosenCountry === 'in' &&
                                        <img src={inHealthInsuranceImage} style={{height: cardImageHeight}}></img>
                                    }
                                    {
                                        this.state.chosenCountry === 'us' &&
                                        <img src={usHealthInsuranceImage} style={{height: cardImageHeight}}></img>
                                    }
                                    <span class="card-title blue-text left-align">
                                        <span style={{fontSize: titleFontSize }}>{ prod.nameTranslated[this.state.chosenLanguage] }</span>
                                        <div><label className="pink-text" style={{fontWeight:"bold"}}> {text.browse_startsAt} {prod.minPrice} {prod.currency} | { text.minDuration[prod.minDuration] } | {text.browse_for} {prod.sumAssured} {prod.currency} </label></div>
                                    </span>
                                    <a class="btn-floating halfway-fab waves-effect waves-light blue" title="get this insurance" href= {"/buyinsurance/"+ prod._id}><i class="material-icons">add</i></a>
                                </div>
                                <div class="card-content" style={{height: "150px", overflow:"auto"}}>
                                    <label className="black-text"> {prod.descriptionTranslated[this.state.chosenLanguage]} </label>
                                </div>
                            </div>
                        </div>
                    ))
                }
                    
                </div>
                <div>
                    <span className="red-text">{errors.exception}</span>
                    <span className="red-text">{errors.error}</span>
                </div>
            </div>
        );
    }
}


Browse.propTypes = {
    browseProductsAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  productReducer: state.productReducer
});

export default connect(
    mapStateToProps,
    { browseProductsAction })(withRouter(Browse));