import { SET_INSURANCES, SET_INSURANCE_INFO, SET_INSURANCE_PRICE, SET_CHECKOUT_URL, SET_BOUGHT_INSURANCE } from '../actions/types';

const initialState = {
    setInsurances: [],
    setInsuranceInfo: {},
    setInsurancePrice: {},
    setCheckoutUrl: {},
    setBoughtInsurance : {},
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
        case SET_BOUGHT_INSURANCE:
            return {
                ...state,
                setBoughtInsurance: action.payload,
            };
        default:
            return state;
    }
};

export default insuranceReducers;