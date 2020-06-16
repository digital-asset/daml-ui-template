import React, { useEffect, useReducer } from "react";
import { User } from "@daml.js/daml-ui-template-0.0.1";
import { useLedger, useStreamQuery } from '@daml/react';
import { partyNameFromJwtToken,  useWellKnownParties } from "@daml/dabl-react";
import { isLocalDev, partyNameFromLocalJwtToken } from "../config"
import { useUserState } from "./UserContext";

type Without = {
  type : "Without"
  requested : boolean
}

type With = {
  type : "With"
  session : User.Session.CreateEvent
}

type SessionState = Without | With

type Request = {
  type : "REQUEST"
}

type Receive = {
  type : "RECEIVE"
  session : User.Session.CreateEvent
}

type Action = Request | Receive

const SessionStateContext = React.createContext<SessionState>({type:"Without", requested:false});

function sessionReducer(state : SessionState, action : Action):SessionState{
  switch(action.type){
    case "REQUEST":
      return { type:"Without", requested:true}
    case "RECEIVE":
      return { type:"With", session:action.session}
  }
}

export const SessionProvider : React.FC = ({children}) => {

  let initState:Without = { type: "Without", requested:false};
  let [state, dispatch] = useReducer<React.Reducer<SessionState,Action>>(sessionReducer, initState);
  const wellKnownParties = useWellKnownParties();
  const ledger = useLedger();
  const sessions = useStreamQuery(User.Session);
  const user = useUserState();
  useEffect(() => {
    async function requestSession(userAdminParty:string, party:string, token:string){
      let userName = isLocalDev ? partyNameFromLocalJwtToken(token) : partyNameFromJwtToken(token);
      let sessionRequest = await ledger.create( User.SessionRequest
                                              , { admin: userAdminParty
                                                , user: party
                                                , userName
                                                });
      console.log(`Session request: ${JSON.stringify(sessionRequest)}`);
    }
    if(wellKnownParties !== null && user.isAuthenticated && !sessions.loading){
      switch(state.type){
        case "Without":
          if(sessions.contracts.length > 0){
            dispatch({ type:"RECEIVE", session:sessions.contracts[0] });
          } else if(state.requested) {
            console.log(`Requested but did not receive a Session!`);
          } else {
            requestSession(wellKnownParties.userAdminParty, user.party, user.token);
            dispatch({ type:"REQUEST" });
          }
          break;
        case "With":
          if(sessions.contracts.length > 0 && state.session.contractId !== sessions.contracts[0].contractId){
            dispatch({ type:"RECEIVE", session:sessions.contracts[0] });
          } else {
            console.log(`Session update ${JSON.stringify(sessions)}`);
          }
          break;
      }
    }
  // We depend on [state] in the hook, but we don't want changes to that to rerun this effect.
  // eslint-disable-next-line
  }, [sessions, ledger, wellKnownParties]);

  return (
    <SessionStateContext.Provider value={state}>
      {children}
    </SessionStateContext.Provider>
  );
}

export function useSessionState() {
  const context = React.useContext<SessionState>(SessionStateContext);
  if (context === undefined){
    throw new Error("useSessionState must be within a SessionContext");
  }
  return context;
}