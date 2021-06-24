import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import commonData from '../../utils/commonData';

class ChooseCountry extends Component{

    constructor(props){
        super(props);

        this.state = {
            country: localStorage['chosen_country'] ?? 'IN',
            availableCountries: commonData.countries 
        };
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
    }

    onCountryChange = e=>{
        this.setState({country : e.target.value});
        localStorage.setItem("chosen_country", e.target.value);
    }



    render(){

        return(
                <div>
                    <FormControl>
                        <Select
                            id= { "countryChooser" }
                            value={ this.state.country }
                            onChange={ this.onCountryChange }
                            >
                                { this.state.availableCountries.map((country) => (
                                    <MenuItem key={ country.value } value={ country.value } >
                                        { country.displayText }
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
        );
    }
}

export default ChooseCountry;