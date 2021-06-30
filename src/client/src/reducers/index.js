import { combineReducers } from "redux";
import authReducers from "./authReducers";
import errorReducers from "./errorReducers";
import productReducers from "./productReducers";
import userReducers from "./userReducers";

export default combineReducers({
  auth: authReducers,
  errors: errorReducers,
  userReducer: userReducers,
  productReducer: productReducers
});
