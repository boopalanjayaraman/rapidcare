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
        if(nextProps){
            this.setState({
                contactPhoneNumber : nextProps.contactPhoneNumber ?? this.state.contactPhoneNumber,
                socialSecurityNumber : nextProps.socialSecurityNumber ?? this.state.socialSecurityNumber,
                userId : nextProps.userId ?? this.state.userId,
                readOnly : nextProps.readOnly ?? this.state.readOnly,
                forSelf : nextProps.forSelf ?? this.state.forSelf,
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
                        <button 
                           type="button" 
                           className="btn btn-medium waves-effect waves-light red hoverable accent-3"
                            onClick = { this.onCheckUserClick }>
                                Check &amp; Get
                        </button>
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