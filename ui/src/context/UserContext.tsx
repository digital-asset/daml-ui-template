import React, { useEffect, useReducer } from "react";
import { History } from 'history';
import { createToken, dablLoginUrl } from "../config";
import { User } from "@daml.js/daml-ui-template-0.0.1";
import { CreateEvent } from '@daml/ledger';
import { useLedger, useStreamQuery } from '@daml/react';
import { expiredToken, partyNameFromJwtToken,  useWellKnownParties, WellKnownPartiesProvider } from "@daml/dabl-react";
import { isLocalDev, partyNameFromLocalJwtToken } from "../config"

type UnAthenticated = {
  type : "UnAuthenticated"
  isAuthenticated : false
}

type Authenticated = {
  type : "Authenticated"
  isAuthenticated : true
  token : string
  party : string
}

type AuthenticatedSessionRequested = {
  type : "AuthenticatedSessionRequested"
  isAuthenticated : true
  token : string
  party : string
}

type AuthenticatedWithSession = {
  type : "AuthenticatedWithSession"
  isAuthenticated : true
  token : string
  party : string
  session : CreateEvent<User.Session, any, any>
}

type UserState = UnAthenticated
               | Authenticated
               | AuthenticatedSessionRequested
               | AuthenticatedWithSession

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

type SessionRequested = {
  type : "SESSION_REQUESTED"
  token : string
  party : string
}

type WithSession = {
  type : "WITH_SESSION"
  token : string
  party : string
  session : CreateEvent<User.Session>
}

type LoginAction = LoginSuccess | LoginFailure | SignoutSuccess | SessionRequested | WithSession

const UserStateContext = React.createContext<UserState>({ type: "UnAuthenticated", isAuthenticated: false });
const UserDispatchContext = React.createContext<React.Dispatch<LoginAction>>({} as React.Dispatch<LoginAction>);

function userReducer(state : UserState, action : LoginAction) : UserState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { type:"Authenticated", isAuthenticated: true, token: action.token, party: action.party };
    case "LOGIN_FAILURE":
      return { type:"UnAuthenticated", isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { type:"UnAuthenticated", isAuthenticated: false };
    case "SESSION_REQUESTED":
      return { type:"AuthenticatedSessionRequested", isAuthenticated: true, token: action.token, party: action.party };
    case "WITH_SESSION":
      return { type:"AuthenticatedWithSession", isAuthenticated: true, token: action.token, party: action.party, session:action.session };
  }
}

function localExpiredToken(token:string):boolean{
  return isLocalDev ? false : expiredToken(token);
}

const UserProvider : React.FC = ({ children }) => {
  const party = localStorage.getItem("daml.party")
  const token = localStorage.getItem("daml.token")

  let initState : UserState = (!!party && !!token && !localExpiredToken(token))
                            ? { type:"Authenticated", isAuthenticated : true, token, party }
                            : { type:"UnAuthenticated", isAuthenticated : false };
  var [state, dispatch] = useReducer<React.Reducer<UserState,LoginAction>>(userReducer, initState);
  const defaultWkp = isLocalDev ? {userAdminParty:"UserAdmin", publicParty:"UserAdmin"} : undefined;

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        <WellKnownPartiesProvider defaultWkp={defaultWkp}>
          {children}
        </WellKnownPartiesProvider>
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

// This is that can only be called within our DablLedger
const CompleteWithinLedgerLogin : React.FC = ({ children }) => {

  const state = useUserState();
  const userDispatch = useUserDispatch();
  const wellKnownParties = useWellKnownParties();
  const ledger = useLedger();
  const sessions = useStreamQuery(User.Session);
  // If we login transition to session.
  useEffect(() => {
    /*console.log(`Here we go!
        ${state.type}
        ${JSON.stringify(sessions)}
        ${JSON.stringify(ledger)}
        ${JSON.stringify(wellKnownParties)}
    `); */
    function considerSessions(state:(Authenticated | AuthenticatedSessionRequested), userAdminParty:string){
      if(!sessions.loading){
        if(sessions.contracts.length > 0){
          userDispatch({ type:"WITH_SESSION", party:state.party, token:state.token, session:sessions.contracts[0] });
        } else {
          if(state.type === "AuthenticatedSessionRequested"){
            console.log("Login sent, but still no session.");
          } else {
            requestSession(state.party, state.token, userAdminParty);
            userDispatch({ type:"SESSION_REQUESTED", party:state.party, token:state.token });
          }
        }
      } // wait for sessions to load
    }

    async function requestSession(party:string, token:string, userAdminParty:string){
      let userName = isLocalDev ? partyNameFromLocalJwtToken(token) : partyNameFromJwtToken(token);
      let sessionRequest = await ledger.create( User.SessionRequest
                                              , { admin: userAdminParty
                                                , user: party
                                                , userName
                                                });
      console.log(`Session request: ${JSON.stringify(sessionRequest)}`);
    }
    if(wellKnownParties !== null){
      if(state.type === "Authenticated" || state.type === "AuthenticatedSessionRequested"){
        considerSessions(state, wellKnownParties.userAdminParty);
      }
    }
  }, [state, sessions, ledger, wellKnownParties, userDispatch]);

  return (
    <>
      {children}
    </>
  );
}

export { UserProvider, useUserState, useUserDispatch, loginUser, loginDablUser, signOut, CompleteWithinLedgerLogin };
