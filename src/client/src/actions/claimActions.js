import axios from "axios";
import { GET_ERRORS, SET_CLAIMS, SET_CLAIM_DOCUMENT, SET_CLAIM_DOCUMENTSLIST, SET_CLAIM_INFO, SET_RAISED_CLAIM } from "./types";

import download from "downloadjs";

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


export const uploadDocumentsAction = (data, callback) => dispatch => {

    axios
    .post("/api/claims/uploaddocuments", data)
    .then(res => {
        const docsRes  = res.data;
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};


export const getDocumentsAction = (data, callback) => dispatch => {

    axios
    .get("/api/claims/getdocuments", { params:{ ...data} })
    .then(res => {
        const docsRes  = res.data;
        dispatch(setClaimDocumentsList(docsRes)); 
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setClaimDocumentsList = (docsRes) => {
    return {
        type: SET_CLAIM_DOCUMENTSLIST,
        payload: docsRes
    };
}


export const getDocumentAction = (data, callback) => dispatch => {

    axios
    .get("/api/claims/getdocument", { params:{ ...data}, responseType: 'blob' })
    .then(res => {
        //const docRes  = res.data;
        download(res.data, data.documentName);
        //dispatch(setClaimDocument(docRes)); 
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setClaimDocument = (docRes) => {
    return {
        type: SET_CLAIM_DOCUMENT,
        payload: docRes
    };
}

//// act on error
export const publishError = (err) => {
    let payload_obj = null;
    payload_obj = err.response.data;

    return {
            type: GET_ERRORS,
            payload: payload_obj
        };
};