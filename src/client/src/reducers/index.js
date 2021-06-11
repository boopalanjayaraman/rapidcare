import { combineReducers } from "redux";
import authReducers from "./authReducers";
import errorReducers from "./errorReducers";
import userReducers from "./userReducers";

export default combineReducers({
  auth: authReducers,
  errors: errorReducers,
  userReducer: userReducers
});

