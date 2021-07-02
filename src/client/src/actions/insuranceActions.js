import axios from "axios";
import { GET_ERRORS, SET_INSURANCES, SET_INSURANCE_INFO, SET_INSURANCE_PRICE, SET_CHECKOUT_URL, SET_BOUGHT_INSURANCE } from "./types";



export const getInsurancesAction = (criteria, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/insurances/getinsurances", { params:{ ...criteria} })
    .then(res => {
        const insurances = res.data;
        dispatch(setInsurances(insurances));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setInsurances = (insurances) => {
    return {
        type: SET_INSURANCES,
        payload: insurances
    };
}

export const getInsuranceInfoAction = (insuranceId, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/insurances/getinsuranceinfo", { params:{ _id: insuranceId} })
    .then(res => {
        const insurance  = res.data;
        dispatch(setInsuranceInfo(insurance));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

//// set current insurance object for view  
export const setInsuranceInfo = (insurance) => {
    return {
            type: SET_INSURANCE_INFO,
            payload: insurance 
        };
};

export const getInsurancePriceAction = (data, callback) => dispatch => {

    axios
    .get("/api/insurances/getinsuranceprice", { params:{ age: data.age, no_overweight : data.no_overweight, 
                                    ped: data.ped, ped2: data.ped2, smoking: data.smoking, alcoholic: data.alcoholic,
                                    undergoneProcedure: data.undergoneProcedure, basePrice : data.basePrice } })
    .then(res => {
        const insurancePrice  = res.data;
        dispatch(setInsurancePrice(insurancePrice));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

//// set current insurance Price object for view  
export const setInsurancePrice = (insurancePrice) => {
    return {
            type: SET_INSURANCE_PRICE,
            payload: insurancePrice 
        };
};


export const getInsuranceCheckoutUrlAction = (data, callback) => dispatch => {

    axios
    .post("/api/insurances/getcheckouturl", data)
    .then(res => {
        const insuranceCheckout  = res.data;
        dispatch(setInsuranceCheckoutUrl(insuranceCheckout));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

//// set current insurance object for view  
export const setInsuranceCheckoutUrl = (insuranceCheckout) => {
    return {
            type: SET_CHECKOUT_URL,
            payload: insuranceCheckout 
        };
};


export const buyInsuranceAction = (data, callback) => dispatch => {

    axios
    .post("/api/insurances/buyinsurance", data)
    .then(res => {
        const insuranceRes  = res.data;
        dispatch(setBoughtInsurance(insuranceRes)); 
        //// insuranceData, policyInfoData are in two different properties in this response
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

//// set currently bought insurance object for view  
export const setBoughtInsurance = (insuranceRes) => {
    return {
            type: SET_BOUGHT_INSURANCE,
            payload: insuranceRes 
        };
};


export const updatePaymentStatusAction = (data, callback) => dispatch => {

    axios
    .post("/api/insurances/updatepaymentstatus", data)
    .then(res => {
        const statusRes  = res.data;
        if(callback){
            callback(statusRes);
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
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