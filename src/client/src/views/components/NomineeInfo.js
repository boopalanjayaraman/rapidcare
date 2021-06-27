import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import dateFormat from 'dateformat';
import constants from '../../utils/constants';


class NomineeInfo extends Component{

    constructor(props){
        super(props);
        this.state = {
            name : props.name?? "",
            contactPhoneNumber : props.contactPhoneNumber ?? "",
            socialSecurityNumber : props.socialSecurityNumber ?? "",
            userId : props.userId ?? "",
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

    onNameChange = e => {
        this.setState({name: e.target.value});
    }

 

    render(){
        const { errors } = this.state;
        return(
                <div>
                    <div className="s12">
                        <div>
                            <span className="indigo-text"> <b>4. Nominee Information </b></span>
                        </div>
                    </div>
                    <div className="s12">
                        <label> Name </label>
                        <input
                            value= { this.state.name }
                            error={ errors.name}
                            id="name"
                            type="text"
                            onChange = { this.onNameChange }
                            disabled = { this.state.readOnly }
                        />
                    </div>
                    <div className="s12">
                        <label> Contact Phone Number </label>
                        <input
                            value= { this.state.contactPhoneNumber }
                            error={ errors.contactPhoneNumber}
                            id="contactPhoneNumber"
                            type="text"
                            onChange = { this.onContactPhoneNumberChange }
                            disabled = { this.state.readOnly }
                        />
                    </div>
                    <div className="s12">
                        <label> Social Security Number </label>
                        <input
                            value= { this.state.socialSecurityNumber }
                            error={ errors.socialSecurityNumber}
                            id="socialSecurityNumber"
                            type="text"
                            onChange = { this.onSocialSecurityNumberChange }
                            disabled = { this.state.readOnly }
                        />
                    </div>
                </div>
        );
    }
}

export default NomineeInfo;