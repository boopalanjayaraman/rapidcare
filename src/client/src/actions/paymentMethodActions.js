import axios from "axios";
import { GET_ERRORS } from "./types";


//// save payment method Action
export const savePaymentmethodAction = (beneficiaryData, callback) => dispatch => {
    axios
    .post("/api/paymentmethods/savepaymentmethod", beneficiaryData)
    .then(res => {
        const { _id } = res.data;
        if(callback){
            callback();
        }
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};

//// act on error
export const publishError = (err) => {
    let payload_obj = null;
      payload_obj = err.response.data;
     

    return {
            type: GET_ERRORS,
            payload: payload_obj
        };
};