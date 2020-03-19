import React from "react";
import { createToken, dablLoginUrl } from "../config";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      // return { ...state, isAuthenticated: true, token: action.token,  action.user, party: action.party };
      return { ...state, isAuthenticated: true, token: action.token, party: action.party };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const url = new URL(window.location)
  const urlParams = new URLSearchParams(url.search)
  const urlToken = urlParams.get('token')
  const storageToken = localStorage.getItem("daml.token")
  console.log(`urlToken: ${urlToken}, storageToken: ${storageToken}`)
  const urlParty = urlParams.get('party')
  const storageParty = localStorage.getItem("daml.party")
  console.log(`urlParty: ${urlParty}, storageParty: ${storageParty}`)
  const token = urlParams.get('token') || localStorage.getItem("daml.token")
  // const user = localStorage.getItem("daml.user")
  const party = urlParams.get('party') || localStorage.getItem("daml.party")
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!token,
    token,
    // user,
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
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


// ###########################################################

function loginUser(dispatch, party, userToken, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  // if (!!user && !!config.tokens[user.toString()]) {
  if (!!party) {
    const token = userToken || createToken(party)
    // const token = config.tokens[user.toString()];
    // const party = config.parties[user.toString()];  // required for DABL
    // localStorage.setItem("daml.user", user);
    localStorage.setItem("daml.party", party);
    localStorage.setItem("daml.token", token);
    // dispatch({ type: "LOGIN_SUCCESS", token, user, party });
    dispatch({ type: "LOGIN_SUCCESS", token, party });
    setError(null);
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

function signOut(event, dispatch, history) {
  event.preventDefault();
  localStorage.removeItem("daml.token");
  // localStorage.removeItem("daml.user");
  localStorage.removeItem("daml.party");
  console.log("signing out!")
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  window.location.assign(`${window.location.origin}/#/login`)

}

export { UserProvider, useUserState, useUserDispatch, loginUser, loginDablUser, signOut };
