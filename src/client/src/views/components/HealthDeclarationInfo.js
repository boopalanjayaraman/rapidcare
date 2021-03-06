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
            no_overweight : props.no_overweight ?? null,
            ped : props.ped ?? null,
            ped2 : props.ped2 ?? null,
            smoking : props.smoking ?? null,
            alcoholic : props.alcoholic ?? null,
            previouslyInsured : props.previouslyInsured ?? null,
            undergoneProcedure : props.undergoneProcedure ?? null,
            readOnly : props.readOnly ?? false,
            errors : props.errors ?? {},
            onFormCompleted : props.onFormCompleted ?? null,
            forSelf : props.forSelf ?? false,
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
        if(nextProps){
            this.setState({
                forSelf : nextProps.forSelf ?? this.state.forSelf,
            });
        }
    }

    componentDidMount(){
         
    }

    onPedChange = e => {
        this.setState({ ped: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }

    onPed2Change = e => {
        this.setState({ ped2: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }

    onNoOverweightChange = e => {
        this.setState({ no_overweight: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }

    onSmokingChange = e => {
        this.setState({ smoking: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }
    onAlcoholicChange = e => {
        this.setState({ alcoholic: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }
    onUndergoneProcedureChange = e => {
        this.setState({ undergoneProcedure: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }
    onPreviouslyInsuredChange = e => {
        this.setState({ previouslyInsured: e.target.value =='1' }, ()=>{
            this.checkIfAllSelected(); 
        });
    }

    checkIfAllSelected() {
        if(this.state.forSelf){
            
            if((this.state.no_overweight != null)
            && (this.state.ped != null)
            && (this.state.ped2 != null)
            && (this.state.smoking != null)
            && (this.state.alcoholic != null)
            && (this.state.undergoneProcedure != null) ){

                //// call the form complete event
                if(this.state.onFormCompleted){
                    this.state.onFormCompleted({...this.state});
                }
            }
        }
        else
        {
            if((this.state.ped != null)
            && (this.state.ped2 != null)){

                //// call the form complete event
                if(this.state.onFormCompleted){
                    this.state.onFormCompleted({...this.state});
                }
            }
        }
    }


    render(){
        const { errors } = this.state;

        let no_overweight_value = this.state.no_overweight != null ? Boolean(this.state.no_overweight) : '';
        let ped_value = this.state.ped != null ? Boolean(this.state.ped) : '';
        let ped2_value = this.state.ped2 != null ? Boolean(this.state.ped2) : '';
        let smoking_value = this.state.smoking  != null ? Boolean(this.state.smoking) : '';
        let alcoholic_value = this.state.alcoholic != null ? Boolean(this.state.alcoholic) : '';
        let undergoneProcedure_value = this.state.undergoneProcedure != null ? Boolean(this.state.undergoneProcedure) : '';
        let previouslyInsured_value = this.state.previouslyInsured != null ? Boolean(this.state.previouslyInsured) : '';
        let questionDisplayFlag =  this.state.forSelf ? "block" : "none";

        return(
                <div>
                     <div className="s12">
                        <div>
                            <span className="indigo-text"> <b>3. Health Declaration</b> </span>
                        </div>
                    </div>
                    <div className="s12" style={{ display : questionDisplayFlag }}>
                        <FormControl>
                            <label>Is the insured between the ages of {this.state.minAge} and {this.state.maxAge}, with no serious weight issues? </label>
                            <RadioGroup row  aria-label= 'overweight' value={ no_overweight_value }  onChange={ this.onNoOverweightChange } >
                                <FormControlLabel
                                    control={<Radio checked={no_overweight_value === true}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'no_overweight_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={no_overweight_value === false}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'no_overweight_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12">
                        <FormControl>
                        <label>Has the insured been diagnosed for any conditions like - heart disease, liver problems, HIV, cancer, Alzheimer or schizophrenia? </label>
                            <RadioGroup row aria-label= 'ped' value={ ped_value } onChange={ this.onPedChange }>
                                <FormControlLabel
                                    control={<Radio checked={ped_value === true}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'ped_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={ped_value === false}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'ped_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12">
                        <FormControl>
                        <label>Has the insured been treated in the last 10 years for any conditions like - diabetes and hypertension? </label>
                            <RadioGroup row aria-label= 'ped2' value={ ped2_value } onChange={ this.onPed2Change }>
                                <FormControlLabel
                                    control={<Radio checked={ped2_value === true}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'ped2_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={ped2_value === false}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'ped2_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12" style={{ display : questionDisplayFlag }}>
                        <FormControl>
                        <label>Does the insured have / have had in the past, the habit of smoking? </label>
                            <RadioGroup row aria-label= 'smoking' value={ smoking_value } onChange={ this.onSmokingChange }>
                                <FormControlLabel
                                    control={<Radio checked={smoking_value === true}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'smoking_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={smoking_value === false}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'smoking_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12" style={{ display : questionDisplayFlag }}>
                        <FormControl>
                        <label>Has the insured been treated for being alcoholic? </label>
                            <RadioGroup row aria-label= 'alcoholic' value={ alcoholic_value } onChange={ this.onAlcoholicChange }>
                                <FormControlLabel
                                    control={<Radio checked={alcoholic_value === true}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'alcoholic_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={alcoholic_value === false}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'alcoholic_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="s12" style={{ display : questionDisplayFlag }}>
                        <FormControl>
                        <label>Has the insured undergone any medical procedure (such as a surgery) in the last 10 years? </label>
                            <RadioGroup row aria-label= 'undergoneProcedure' value={ undergoneProcedure_value } onChange={ this.onUndergoneProcedureChange }>
                                <FormControlLabel
                                    control={<Radio checked={undergoneProcedure_value === true}/>  }
                                    value = "1" 
                                    label= "yes"
                                    key = {'undergoneProcedure_option_yes'}
                                    />
                                <FormControlLabel
                                    control={<Radio checked={undergoneProcedure_value === false}/>  }
                                    value = "0" 
                                    label= "no"
                                    key = {'undergoneProcedure_option_no'}
                                    />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <span className="red-text"> {errors.healthDeclaration} </span>
                </div>
        );
    }
}

export default withStyles(styles)(HealthDeclarationInfo);