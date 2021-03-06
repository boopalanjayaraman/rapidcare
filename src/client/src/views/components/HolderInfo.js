import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import dateFormat from 'dateformat';
import constants from '../../utils/constants';
import { textProvider } from '../../content/textProvider';


class HolderInfo extends Component{

    constructor(props){
        super(props);
        this.state = {
            age : props.age ?? "",
            photo : "",
            userId : props.userId ?? "",
            readOnly : props.readOnly ?? false,
            forSelf : props.forSelf ?? false,
            errors : props.errors ?? {},
            onHolderChange : props.onHolderChange ?? null,
            holderInfo : props.holderInfo ?? {
                _id : "",
                name : "-",
                dateOfBirth : Date.now(),
                socialSecurityNumber :   "",
                nomineeInfo : {
                    name : "-",
                    contactPhoneNumber : "-"
                }
            }
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
                userId : nextProps.userId ?? this.state.userId,
                readOnly : nextProps.readOnly ?? this.state.readOnly,
                forSelf : nextProps.forSelf ?? this.state.forSelf,
                onHolderChange: nextProps.onHolderChange ?? this.state.onHolderChange,
                holderInfo: nextProps.holderInfo ?? this.state.holderInfo,
            });
        }
    }

    componentDidMount(){
    }

    onUserIdChange= e => {
        this.setState({userId: e.target.value});
    }

    onUserIdEntered = e => {
        this.setState({userId: e.target.value});
        if(this.state.onHolderChange){
            this.state.onHolderChange(e.target.value);
        }
    }


    render(){
        const { errors } = this.state;
        let holderInfo = this.state.holderInfo;

        const text = textProvider();
        let chosen_language = localStorage['chosen_language'] ?? 'en'; 

        let dobText = this.state.holderInfo._id === "" ? "" : dateFormat(this.state.holderInfo.dateOfBirth, constants.dateDisplayFormat);

        return(
                <div>
                    <div className="s12">
                        <div>
                            <span className="indigo-text"> <b>{text.holderInfo_identityInformation}</b> </span>
                        </div>
                    </div>
                    <div className="s12">
                        <label className="pink-text"> {text.holderInfo_RapydCareUserId} </label>
                        <input
                            value= { this.state.userId }
                            error={ errors.userId}
                            id="userId"
                            type="text"
                            onChange = { this.onUserIdChange }
                            onBlur = { this.onUserIdEntered }
                            disabled = { this.state.forSelf || this.state.readOnly }
                        />
                        {/* <button 
                           type="button" 
                           className="btn btn-medium waves-effect waves-light red hoverable accent-3"
                            onClick = { this.onCheckUserClick }>
                                Check &amp; Fetch Info
                        </button> */}
                    </div>
                    <div className="s12">
                        <label> { text.holderInfo_SocialSecurityNumber } </label> 
                        <input
                            value= { holderInfo.socialSecurityNumber }
                            error={ errors.socialSecurityNumber}
                            id="socialSecurityNumber"
                            type="text"
                            disabled = { true }
                        />
                    </div>
                    <div className="s12">
                        <label>  { text.holderInfo_NameAsPerOurRecords } </label> 
                        <label className="black-text"> 
                            { holderInfo.name } </label>
                        <label> | </label> 
                        <label> {text.holderInfo_DateOfBirth} </label> 
                        <label className="black-text"> { dobText } </label> 
                        <label> | </label> 
                        <label> { text.holderInfo_NomineeName } </label>
                        <label className="black-text"> 
                            { holderInfo.nomineeInfo === undefined? "-" : holderInfo.nomineeInfo.name } </label>
                        
                         
                    </div>
                    
                </div>
        );
    }
}

export default HolderInfo;