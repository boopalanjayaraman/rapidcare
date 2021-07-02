import { SET_INSURANCES, SET_INSURANCE_INFO, SET_INSURANCE_PRICE, SET_CHECKOUT_URL } from '../actions/types';

const initialState = {
    setInsurances: [],
    setInsuranceInfo: {},
    setInsurancePrice: {},
    setCheckoutUrl: {},
};

function insuranceReducers(state = initialState, action) {
    switch(action.type){
        case SET_INSURANCES:
            return {
                ...state,
                setInsurances: action.payload
            };
        case SET_INSURANCE_INFO:
            return {
                ...state,
                setInsuranceInfo: action.payload,
            };
        case SET_INSURANCE_PRICE:
            return {
                ...state,
                setInsurancePrice: action.payload
            };
        case SET_CHECKOUT_URL:
            return {
                ...state,
                setCheckoutUrl: action.payload,
            };
        default:
            return state;
    }
};

export default insuranceReducers;