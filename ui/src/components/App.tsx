import React, { useEffect } from "react";
import { HashRouter, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { damlPartyKey, damlTokenKey } from "../config";
import { useUserState, useUserDispatch } from "../context/UserContext";
import Layout from "./Layout/Layout";
import ErrorComponent from "../pages/error/Error";
import Login from "../pages/login/Login";
import Report from "../pages/report/Report";

export default function App() {
  const userState = useUserState();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute/>} />
        <Route path="/app/login" element={<Login/>} />
        <Route path="/apt/report" element={<Report/>}/>
        <Route element={ErrorComponent} />
      </Routes>
    </BrowserRouter>
  );

  // #######################################################################

  function RootRoute() {
    const userDispatch = useUserDispatch();

    useEffect(() => {
      const url = new URL(window.location.toString());
      const token = url.searchParams.get('token');
      if (token === null) {
        return;
      }
      const party = url.searchParams.get('party');
      if (party === null) {
        throw Error("When 'token' is passed via URL, 'party' must be passed too.");
      }
      localStorage.setItem(damlPartyKey, party);
      localStorage.setItem(damlTokenKey, token);

      userDispatch({ type: "LOGIN_SUCCESS", token, party });
    })

    return (
      <Navigate to="/app/login" />
    )
  }

  function PrivateRoute({ element, ...rest } : any) {
    return (
      <Route
        {...rest}
        render={(props:any) =>
          userState.isAuthenticated ? (
            React.createElement(element, props)
          ) : (
            <Navigate
              to={"/login"}
              state={{from: props.location}}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ element, ...rest } : any) {
    return (
      <Route
        {...rest}
        render={(props: any) =>
          userState.isAuthenticated ? (
            <Navigate
              to={"/"}
            />
          ) : (
            React.createElement(element, props)
          )
        }
      />
    );
  }
}
