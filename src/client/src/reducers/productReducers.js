import { BROWSE_PRODUCTS } from '../actions/types';

const initialState = {
    browseProducts: [],
};

function productReducers(state = initialState, action) {
    switch(action.type){
        case BROWSE_PRODUCTS:
            return {
                ...state,
                browseProducts: action.payload
            };
        default:
            return state;
    }
};

export default productReducers;