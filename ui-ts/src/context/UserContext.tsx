import React from "react";
import { History } from 'history';
import { createToken, dablLoginUrl } from "../config";


type UserState = {
  isAuthenticated : boolean
  token : string | null
  party : string | null
}

type LoginSuccess = {
  type : "LOGIN_SUCCESS"
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

const UserStateContext = React.createContext<UserState>({ isAuthenticated: false, token: "", party: "" });
const UserDispatchContext = React.createContext<React.Dispatch<LoginAction>>({} as React.Dispatch<LoginAction>);

function userReducer(state : UserState, action : LoginAction) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, token: action.token, party: action.party };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
  }
}

const UserProvider : React.FC = ({ children }) => {
  const party = localStorage.getItem("daml.party")
  const token = localStorage.getItem("daml.token")

  var [state, dispatch] = React.useReducer<React.Reducer<UserState,LoginAction>>(userReducer, {
    isAuthenticated: !!token,
    token,
    party
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext<UserState>(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext<React.Dispatch<LoginAction>>(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


// ###########################################################

function loginUser(
    dispatch : React.Dispatch<LoginAction>,
    party : string,
    userToken : string,
    history : History,
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setError : React.Dispatch<React.SetStateAction<boolean>>) {
  setError(false);
  setIsLoading(true);

  if (!!party) {
    const token = userToken || createToken(party)
    localStorage.setItem("daml.party", party);
    localStorage.setItem("daml.token", token);

    dispatch({ type: "LOGIN_SUCCESS", token, party });
    setError(false);
    setIsLoading(false);
    history.push("/app");
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

const loginDablUser = () => {
  window.location.assign(`https://${dablLoginUrl}`);
}

function signOut(dispatch : React.Dispatch<LoginAction>, history : History) {
  // event.preventDefault();
  localStorage.removeItem("daml.party");
  localStorage.removeItem("daml.token");

  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, loginDablUser, signOut };
