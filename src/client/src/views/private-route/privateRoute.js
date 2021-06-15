import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { path } from "app-root-path";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render = { props =>
                      auth.isAuthenticated === true ? 
                      (
                        ( ((auth.user.isUser === true && auth.user.isLocked === false && auth.user.isActive === true) 
                            || props.location.pathname.toLowerCase().startsWith('/myprofile')
                            || props.location.pathname.toLowerCase().startsWith('/viewprofile') 
                            || props.location.pathname.toLowerCase().startsWith('/noaccessmessage')  
                            || props.location.pathname.toLowerCase().startsWith('/dashboard')
                            ) ?
                          <Component {...props} /> 
                           :
                          <Redirect to="/noaccessmessage" />)
                      ) : 
                      (
                        <Redirect to="/login" />
                      )
                      
        }
    />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);