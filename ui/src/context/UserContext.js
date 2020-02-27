import React from "react";
import config from "../config";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, token: action.token, user: action.user, party: action.party };
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
  const token = localStorage.getItem("daml.token")
  const user = localStorage.getItem("daml.user")
  const party = localStorage.getItem("daml.party")
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!token,
    token,
    user,
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

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, user, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!user && !!config.tokens[user.toString()]) {
    const token = config.tokens[user.toString()];
    const party = config.parties[user.toString()];  // required for DABL
    localStorage.setItem("daml.token", token);
    localStorage.setItem("daml.user", user);
    localStorage.setItem("daml.party", party);
    dispatch({ type: "LOGIN_SUCCESS", token, user, party });
    setError(null);
    setIsLoading(false);
    history.push("/app");
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("daml.token");
  localStorage.removeItem("daml.user");
  localStorage.removeItem("daml.party");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
