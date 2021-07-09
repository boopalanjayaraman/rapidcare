import { SET_CLAIMS, SET_REVIEW_CLAIMS, SET_CLAIM_INFO, SET_RAISED_CLAIM, SET_CLAIM_DOCUMENT, SET_CLAIM_DOCUMENTSLIST, SET_APPROVAL_CLAIMS } from '../actions/types';

const initialState = {
    setClaims: [],
    setClaimInfo: {},
    setRaisedClaim : {},
    setClaimDocument: {},
    setClaimDocumentsList: [],
    setReviewClaims : [],
    setApprovalClaims : []
};

function claimReducers(state = initialState, action) {
    switch(action.type){
        case SET_CLAIMS:
            return {
                ...state,
                setClaims: action.payload
            };
        case SET_REVIEW_CLAIMS:
            return {
                ...state,
                setReviewClaims: action.payload
            };
        case SET_APPROVAL_CLAIMS:
            return {
                ...state,
                setApprovalClaims: action.payload
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
        case SET_CLAIM_DOCUMENT:
            return {
                ...state,
                setClaimDocument: action.payload,
            };
        case SET_CLAIM_DOCUMENTSLIST:
            return {
                ...state,
                setClaimDocumentsList: action.payload,
            };
        default:
            return state;
    }
};

export default claimReducers;