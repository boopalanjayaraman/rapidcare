import axios from "axios";
import { GET_ERRORS, SET_CLAIMS, SET_CLAIM_INFO, SET_RAISED_CLAIM } from "./types";



export const getClaimsAction = (criteria, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/claims/getclaims", { params:{ ...criteria} })
    .then(res => {
        const claims = res.data;
        dispatch(setClaims(claims));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setClaims = (claims) => {
    return {
        type: SET_CLAIMS,
        payload: claims
    };
}

export const getClaimInfoAction = (claimId, callback) => dispatch => {

    axios
    .get("/api/claims/getclaimInfo", { params:{ _id: claimId} })
    .then(res => {
        const claim  = res.data;
        dispatch(setClaimInfo(claim));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setClaimInfo = (claim) => {
    return {
            type: SET_CLAIM_INFO,
            payload: claim 
        };
}; 

export const raiseClaimAction = (data, callback) => dispatch => {

    axios
    .post("/api/claims/raiseClaim", data)
    .then(res => {
        const claimRes  = res.data;
        dispatch(setRaisedClaim(claimRes)); 
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setRaisedClaim = (claimRes) => {
    return {
            type: SET_RAISED_CLAIM,
            payload: claimRes 
        };
};
 

export const reviewClaimAction = (data, callback) => dispatch => {

    axios
    .post("/api/claims/reviewclaim", data)
    .then(res => {
        const claimRes  = res.data;
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const processClaimAction = (data, callback) => dispatch => {

    axios
    .post("/api/claims/processclaim", data)
    .then(res => {
        const claimRes  = res.data;
        if(callback){
            callback();
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