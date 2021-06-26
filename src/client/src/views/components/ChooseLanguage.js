import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import commonData from '../../utils/commonData';

class ChooseLanguage extends Component{

    constructor(props){
        super(props);

        this.state = {
            language: localStorage['chosen_language'] ?? 'en',
            availableLanguages: commonData.languages,
            onChange : props.onChange 
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

    onLanguageChange = e=>{
        this.setState({language : e.target.value});
        localStorage.setItem("chosen_language", e.target.value);
        if(this.state.onChange){
            this.state.onChange(e.target.value);
        }
    }



    render(){

        return(
                <div>
                    <FormControl>
                        <Select
                            id= { "languageChooser" }
                            value={ this.state.language }
                            onChange={ this.onLanguageChange }
                            >
                                { this.state.availableLanguages.map((lang) => (
                                    <MenuItem key={ lang.value } value={ lang.value } >
                                        { lang.text }
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
        );
    }
}

export default ChooseLanguage;