import { SET_PROFILE_USER, BROWSE_UNLOCK_USERS, SET_MY_PROFILE } from '../actions/types';

const initialState = {
    setProfileUser: {},
    setMyProfile: {},
    browseUnlockUsers: [],
};

function userReducers(state = initialState, action) {
    switch(action.type){
        case SET_PROFILE_USER:
            return {
                ...state,
                setProfileUser: action.payload,
            };
        case SET_MY_PROFILE:
            return {
                ...state,
                setMyProfile: action.payload,
            };
        case BROWSE_UNLOCK_USERS:
            return {
                ...state,
                browseUnlockUsers: action.payload
            };
        default:
            return state;
    }
};

export default userReducers;