import { BROWSE_PRODUCTS, SET_CURRENT_PRODUCT } from '../actions/types';

const initialState = {
    browseProducts: [],
    setCurrentProduct: {},
};

function productReducers(state = initialState, action) {
    switch(action.type){
        case BROWSE_PRODUCTS:
            return {
                ...state,
                browseProducts: action.payload
            };
        case SET_CURRENT_PRODUCT:
            return {
                ...state,
                setCurrentProduct: action.payload,
            };
        default:
            return state;
    }
};

export default productReducers;