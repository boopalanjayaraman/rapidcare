import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import dateFormat from 'dateformat';
import constants from '../../utils/constants';


class HolderInfo extends Component{

    constructor(props){
        super(props);
        this.state = {
            age : props.age ?? "",
            photo : "",
            contactPhoneNumber : props.contactPhoneNumber ?? "",
            socialSecurityNumber : props.socialSecurityNumber ?? "",
            userId : props.userId ?? "",
            occupation : props.occupation ?? "",
            readOnly : props.readOnly ?? false,
            forSelf : props.forSelf ?? false,
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

    onAgeChange = e => {
        this.setState({age: e.target.value});
    }

    onUserIdChange= e => {
        this.setState({userId: e.target.value});
    }


    render(){
        const { errors } = this.state;

        return(
                <div>
                    <div className="s12">
                        <div>
                            <span className="indigo-text"> <b>2. Identity Information</b> </span>
                        </div>
                    </div>
                    {/* <div className="s12">
                        <label> Age </label>
                        <input
                            value= { this.state.age }
                            error={ errors.age}
                            id="age"
                            type="text"
                            onChange = { this.onAgeChange }
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
                    </div> */}
                    <div className="s12">
                        <label className="pink-text"> RapydCare User Id (Necessary) </label>
                        <input
                            value= { this.state.userId }
                            error={ errors.userId}
                            id="userId"
                            type="text"
                            onChange = { this.onUserIdChange }
                            disabled = { this.state.forSelf || this.state.readOnly }
                        />
                    </div>
                    <div className="s12">
                        <label> Social Security Number / Aadhar Number </label>
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

export default HolderInfo;