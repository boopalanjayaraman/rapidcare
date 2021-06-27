import React, { Component } from 'react';
import dateFormat from 'dateformat';
import constants from '../../utils/constants';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    label: {
        fontSize: '0.8rem'
    }
  });

class HealthDeclarationInfo extends Component{

    constructor(props){
        super(props);
        this.state = {
            minAge : props.minAge ?? 0,
            maxAge : props.maxAge ?? 70,
            rightAge : props.rightAge ?? null,
            ped : props.ped ?? null,
            smoking : props.smoking ?? null,
            drinking : props.drinking ?? null,
            previouslyInsured : props.previouslyInsured ?? null,
            undergoneProcedure : props.undergoneProcedure ?? null,
            readOnly : props.readOnly ?? false,
            errors : props.errors ?? {}
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

    onPedChange = e => {
        this.setState({ ped: e.target.value =='1' });
    }

    onRightAgeChange = e => {
        this.setState({ rightAge: e.target.value =='1' });
    }

    onSmokingChange = e => {
        this.setState({ smoking: e.target.value =='1' });
    }
    onDrinkingChange = e => {
        this.setState({ drinking: e.target.value =='1' });
    }
    onUndergoneProcedureChange = e => {
        this.setState({ undergoneProcedure: e.target.value =='1' });
    }
    onPreviouslyInsuredChange = e => {
        this.setState({ previouslyInsured: e.target.value =='1' });
    }


    render(){
        const { errors } = this.state;

        let rightAge_value = this.state.rightAge != null ? Boolean(this.state.rightAge) : '';
        let ped_value = this.state.ped != null ? Boolean(this.state.ped) : '';
        let smoking_value = this.state.smoking  != null ? Boolean(this.state.smoking) : '';
        let drinking_value = this.state.drinking != null ? Boolean(this.state.drinking) : '';
        let undergoneProcedure_value = this.state.undergoneProcedure != null ? Boolean(this.state.undergoneProcedure) : '';
        let previouslyInsured_value = this.state.previouslyInsured != null ? Boolean(this.state.previouslyInsured) : '';

        return(
                <div>
                     <div className="s12">
                        <div>
                            <span className="indigo-text"> <b>3. Health Declaration</b> </span>
                        </div>
                    </div>
                    <div className="s12">
                        <FormControl>
                            <label>Is the insured between the ages of {this.state.minAge} and {this.state.maxAge}, with no serious weight issues? </label>
                            <RadioGroup row  aria-label= 'rightAge' value={ rightAge_value }  onChange={ this.onRightAgeChange } >
                                <FormControlLabel
                                    control={<Radio checked={rightAge_value == '1'}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'rightAge_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={rightAge_value == '0'}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'rightAge_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12">
                        <FormControl>
                        <label>Has the insured been treated in the last 10 years for any conditions like - heart disease, diabetes, liver problems, HIV, cancer, or schizophrenia? </label>
                            <RadioGroup row aria-label= 'ped' value={ ped_value } onChange={ this.onPedChange }>
                                <FormControlLabel
                                    control={<Radio checked={ped_value == '1'}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'ped_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={ped_value == '0'}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'ped_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12">
                        <FormControl>
                        <label>Does the insured have / have had in the past, the habit of smoking? </label>
                            <RadioGroup row aria-label= 'smoking' value={ smoking_value } onChange={ this.onSmokingChange }>
                                <FormControlLabel
                                    control={<Radio checked={smoking_value == '1'}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'smoking_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={smoking_value == '0'}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'smoking_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12">
                        <FormControl>
                        <label>Has the insured been treated for being alcoholic? </label>
                            <RadioGroup row aria-label= 'drinking' value={ drinking_value } onChange={ this.onDrinkingChange }>
                                <FormControlLabel
                                    control={<Radio checked={drinking_value == '1'}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'drinking_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={drinking_value == '0'}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'drinking_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12">
                        <FormControl>
                        <label>Has the insured undergone any medical procedure (such as a surgery) in the last 10 years? </label>
                            <RadioGroup row aria-label= 'undergoneProcedure' value={ undergoneProcedure_value } onChange={ this.onUndergoneProcedureChange }>
                                <FormControlLabel
                                    control={<Radio checked={undergoneProcedure_value == '1'}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'undergoneProcedure_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={undergoneProcedure_value == '0'}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'undergoneProcedure_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
        );
    }
}

export default withStyles(styles)(HealthDeclarationInfo);