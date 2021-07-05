import { SET_CLAIMS, SET_CLAIM_INFO, SET_RAISED_CLAIM } from '../actions/types';

const initialState = {
    setClaims: [],
    setClaimInfo: {},
    setRaisedClaim : {},
};

function claimReducers(state = initialState, action) {
    switch(action.type){
        case SET_CLAIMS:
            return {
                ...state,
                setClaims: action.payload
            };
        case SET_CLAIM_INFO:
            return {
                ...state,
                setClaimInfo: action.payload,
            };
        case SET_RAISED_CLAIM:
            return {
                ...state,
                setRaisedClaim: action.payload,
            };
        default:
            return state;
    }
};

export default claimReducers;