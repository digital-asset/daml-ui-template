import React, { useEffect } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { fromLocalStorage, fromURL, useUserState, useUserDispatch } from "../context/UserContext";
import Layout from "./Layout/Layout";
import ErrorComponent from "../pages/error/Error";
import Login from "../pages/login/Login";
import Users from "../pages/users/Users";

export default function App() {
  const userState = useUserState();

  return (
    <HashRouter>
      <Switch>
        <PrivateRoute exact path="/"      component={Layout} />
        <PrivateRoute       path="/app"   component={Layout} />
        <PublicRoute  exact path="/login" component={Login} />
        <Route        exact path="/users" component={Users} />
        <Route component={ErrorComponent} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ path, component, ...rest } : any) {
    var userDispatch = useUserDispatch();

    useEffect(() => {
      if(!userState.isAuthenticated){
        const userInfo = fromLocalStorage() || fromURL();
        if(userInfo !== null){
          localStorage.setItem("daml.party", userInfo.party);
          localStorage.setItem("daml.token", userInfo.token);

          userDispatch({ type: "LOGIN_SUCCESS", ...userInfo});
        }
      }
      // only depends on userDispatch
      // eslint-disable-next-line
    },[]);

    return (
      <Route
        {...rest}
        render={props =>
          userState.isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest } : any) {
    return (
      <Route
        {...rest}
        render={props =>
          userState.isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
