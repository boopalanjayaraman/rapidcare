import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch  } from "react-router-dom";

import './App.css';

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./layouts/Navbar";
import Landing from "./layouts/Landing";
import Login from "./views/Login"
import Register from "./views/Register"

import PrivateRoute from "./views/private-route/privateRoute";
import Dashboard from "./views/dashboard/dashboard";

import MyProfile from './views/user/myProfile';
import ViewProfile from './views/user/viewProfile';

import ScrollToTop from './views/components/ScrollToTop';
import Footer from './views/components/footer';
import TermsAndConditions from './views/TermsAndConditions';
import NoAccessMessage from './views/user/NoAccessMessage';
import ConfirmEmail from './views/ConfirmEmail';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import Browse from './views/products/browse';

import BuyInsurance from './views/products/buyinsurance';
import ErrorPayment from './views/products/errorPayment';
import CompletePayment from './views/products/completePayment';
import raiseClaim from './views/claims/raiseClaim';
import viewClaim from './views/claims/viewClaim';
import myClaims from './views/claims/myClaims';
import myInsurances from './views/products/myInsurances';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render(){

    return (
      <Provider store={store}>
        <Router>
          <ScrollToTop>
            <div className="App">
              <Navbar />
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/browseProducts" component={Browse} />
                  <Switch>
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    <PrivateRoute exact path="/myProfile/:action?" component={MyProfile} />
                    <PrivateRoute exact path="/viewProfile/:id/:action?" component={ViewProfile} />
                    <PrivateRoute exact path="/noaccessmessage" component={NoAccessMessage} />
                    <PrivateRoute exact path="/buyinsurance/:id" component={BuyInsurance} />
                    <PrivateRoute exact path="/completePayment/:id/:paymentCompleteToken" component={CompletePayment} />
                    <PrivateRoute exact path="/errorPayment/:id/:paymentErrorToken" component={ErrorPayment} />
                    <PrivateRoute exact path="/newClaim" component={raiseClaim} />
                    <PrivateRoute exact path="/viewClaim/:id/:action?" component={viewClaim} />
                    <PrivateRoute exact path="/myclaims" component={myClaims} />
                    <PrivateRoute exact path="/myinsurances" component={myInsurances} />
                  </Switch>
                    <Route exact path="/TermsAndConditions" component={TermsAndConditions} />
                    <Route exact path="/ConfirmEmail/:id/:tokenCode" component={ConfirmEmail} />
                    <Route exact path="/ForgotPassword" component={ForgotPassword} />
                    <Route exact path="/ResetPassword/:token1/:token2" component={ResetPassword} />
                <Footer/>
            </div>
          </ScrollToTop>
        </Router>
      </Provider>
    );
  }
  
}

export default App;
