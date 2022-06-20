import React from "react";
import { History } from 'history';
import { damlAppKey, getParty, getToken } from "../config";

type AuthenticatedUser = {
  isAuthenticated : true
  name : string
  token : string
  party : string
}

type UnAthenticated = {
  isAuthenticated : false
}

type UserState = UnAthenticated | AuthenticatedUser

type LoginSuccess = {
  type : "LOGIN_SUCCESS"
  name : string
  token : string
  party : string
}

type LoginFailure = {
  type : "LOGIN_FAILURE"
}

type SignoutSuccess = {
  type : "SIGN_OUT_SUCCESS"
}

type LoginAction = LoginSuccess | LoginFailure | SignoutSuccess

const UserStateContext = React.createContext<UserState>({ isAuthenticated: false });
const UserDispatchContext = React.createContext<React.Dispatch<LoginAction>>({} as React.Dispatch<LoginAction>);

function userReducer(state : UserState, action : LoginAction) : UserState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { isAuthenticated: true, name: action.name, token: action.token, party: action.party };
    case "LOGIN_FAILURE":
      return { isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { isAuthenticated: false };
  }
}

const UserProvider : React.FC = ({ children }) => {
  const name = localStorage.getItem(damlAppKey) || "";
  const party = getParty(name);
  const token = getToken(party);

  let initState : UserState = (!!party && !!token) ? { isAuthenticated : true, name, token, party } : { isAuthenticated : false };
  const [state, dispatch] = React.useReducer<React.Reducer<UserState,LoginAction>>(userReducer, initState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext<UserState>(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext<React.Dispatch<LoginAction>>(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


// ###########################################################

function loginUser(
    dispatch : React.Dispatch<LoginAction>,
    name : string,
    userToken : string,
    history : History,
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setError : React.Dispatch<React.SetStateAction<boolean>>) {
  setError(false);
  setIsLoading(true);

  if (!!name) {
    var party = getParty(name);
    var token = getToken(party);
    localStorage.setItem(damlAppKey, name);

    dispatch({ type: "LOGIN_SUCCESS", name, token, party });
    setError(false);
    setIsLoading(false);
    history.push("/app");
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch : React.Dispatch<LoginAction>, history : History) {
  localStorage.removeItem(damlAppKey);

  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };
