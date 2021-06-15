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
                        
                        <p>This agreement (or “EULA”) is a legal agreement between the person, company or organization (“You”) that has licensed a software product (“Product”) and RapydCare (“Licensor” or “Application Provider”). The Product is to be obtained through website use and are referred to in this license as “Services”. By installing and/or using any Product provided by the Licensor, You are confirming your acceptance of this agreement and you are agreeing to become bound by the terms of this agreement.</p>
                        
                        <p style={{color: "rgb(90, 114, 209)"}}>Just kidding. This software application has been built as part of Rapyd Fintech Hackathon (2021) and is meant to function only as a demo of the idea.</p> 

                    </div>
                </div>
            </div>
        );
    }
}

export default TermsAndConditions;