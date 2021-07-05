import React, { Component } from "react";
 
class TermsAndConditions extends Component {

    constructor(props){
        super(props);
        
    }

    componentDidUpdate(prevProps){
         
    }

    componentWillReceiveProps(nextProps){
        
    }


    render(){

        return(
            <div>
                <div class="row">
                    <div className="col s12 m10">
                        <h6 className="sectionheading">Terms and Conditions - RapydCare</h6>
                        
                        <p style={{color: "rgb(90, 114, 209)"}}>Nah, Just kidding. This software application has been built as part of Rapyd Fintech Hackathon (2021) and is meant to function only as a demo of the idea.</p> 

                    </div>
                </div>
            </div>
        );
    }
}

export default TermsAndConditions;