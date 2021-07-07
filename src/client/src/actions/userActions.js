import axios from "axios";
import { GET_ERRORS, SET_MY_PROFILE, SET_PROFILE_USER, BROWSE_UNLOCK_USERS, SET_PAYMENTINFO_ID } from "./types";


export const getUserInfoToViewAction = (userId, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/users/getuserinfo", { params:{ _id: userId} })
    .then(res => {
        const user  = res.data;
        dispatch(setProfileUser(user));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const getMyInfoToViewAction = (userId, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/users/getmyinfo", { params:{ _id: userId} })
    .then(res => {
        const user  = res.data;
        dispatch(setMyProfile(user));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};


export const getMyInfoWithPaymentAction = (userId, callback) => dispatch => {

    axios
    .get("/api/users/getmyinfowithpayment", { params:{ _id: userId} })
    .then(res => {
        const user  = res.data;
        dispatch(setMyProfile(user));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};


export const browseUnlockUsersAction = (criteria, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/users/getusers", { params:{ ...criteria} })
    .then(res => {
        const users = res.data;
        dispatch(setBrowseUnlockUsers(users));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

//// edit profile
export const editProfileAction = (userData, history) => dispatch => {
    axios
    .post("/api/users/editprofile", userData)
    .then(res => {
        const { _id } = res.data;
        history.push("/viewProfile/" + _id + '/updated');  
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};

 
//// confirm email action
export const confirmEmailAction = (userData, callBack) => dispatch => {
    axios
    .post("/api/users/confirmemail", userData)
    .then(res => {
        const { _id } = res.data;
        if(callBack){
            callBack();
        }
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};

//// resend email for confirmation
export const resendConfirmationEmailAction = (userData, callBack) => dispatch => {
    axios
    .post("/api/users/resendconfirmationemail", userData)
    .then(res => {
        const { _id } = res.data;
        if(callBack){
            callBack();
        }
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};

//// forgot password action
export const forgotPasswordAction = (userData, callBack) => dispatch => {
    axios
    .post("/api/users/forgotpassword", userData)
    .then(res => {
        const { IsSuccess, Message } = res.data;
        if(callBack){
            callBack(Message);
        }
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};

//// change forgot password action
export const changeForgotPasswordAction = (userData, callBack) => dispatch => {
    axios
    .post("/api/users/changeforgotpassword", userData)
    .then(res => {
        const { IsSuccess, Message } = res.data;
        if(callBack){
            callBack(Message);
        }
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};


//// add payment method Action
export const addPaymentInfoAction = (userData, callback) => dispatch => {
    axios
    .post("/api/users/addpaymentinfo", userData)
    .then(res => {
        const { paymentMethodId } = res.data;
        dispatch(setPaymentInfoId({_id: paymentMethodId}));
        if(callback){
            callback(paymentMethodId);
        }
    })  
    .catch(err => {
            dispatch(publishError(err));
        }
    );
};

export const setPaymentInfoId = (paymentInfo) => {
    return {
            type: SET_PAYMENTINFO_ID,
            payload: paymentInfo 
        };
};

//// set current user object for view / edit
export const setProfileUser = (user) => {
    return {
            type: SET_PROFILE_USER,
            payload: user 
        };
};



//// set my user object for view / edit
export const setMyProfile = (user) => {
    return {
            type: SET_MY_PROFILE,
            payload: user 
        };
};
 
export const setBrowseUnlockUsers = (users) => {
    return {
        type: BROWSE_UNLOCK_USERS,
        payload: users
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