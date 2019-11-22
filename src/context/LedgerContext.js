import React from "react";

var LedgerStateContext = React.createContext();
var LedgerDispatchContext = React.createContext();

function ledgerReducer(state, action) {
  switch (action.type) {
    case "CONTRACT_REQUEST":
      return { ...state, isFetching: true };
    case "CONTRACT_RESPONSE":
      return { ...state, isFetching: false, contracts: action.contracts };
    case "CONTRACT_ERROR":
      return { ...state, isFetching: false, error: action.error };
    case "COMMAND_SEND":
      return { ...state, isSending: true };
    case "COMMAND_SENT":
      return { ...state, isSending: false };
    case "COMMAND_ERROR":
      return { ...state, isSending: false, error: action.error };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function LedgerProvider({ children }) {
  var [state, dispatch] = React.useReducer(ledgerReducer, {
    isFetching: false,
    isSending: false,
    contracts: [],
  });

  return (
    <LedgerStateContext.Provider value={state}>
      <LedgerDispatchContext.Provider value={dispatch}>
        {children}
      </LedgerDispatchContext.Provider>
    </LedgerStateContext.Provider>
  );
}

function useLedgerState() {
  var context = React.useContext(LedgerStateContext);
  if (context === undefined) {
    throw new Error("useLedgerState must be used within a LedgerProvider");
  }
  return context;
}

function useLedgerDispatch() {
  var context = React.useContext(LedgerDispatchContext);
  if (context === undefined) {
    throw new Error("useLedgerDispatch must be used within a LedgerProvider");
  }
  return context;
}

export { LedgerProvider, useLedgerState, useLedgerDispatch };

// ###########################################################

export async function sendCommand(dispatch, token, party, commandType, command, setIsSending, setError) {
  setError(false);
  setIsSending(true);

  if (!!token) {
    dispatch({ type: "COMMAND_SEND"});
    try {
      const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + token };
      if (!!party) { headers["X-DA-Party"] = party; }

      const options = { method: "POST", headers, body: JSON.stringify(command) };
      console.log(options);
      const response = await fetch("/command/" + commandType, options);
      const res = await response.json();
      if (res.status !== 200) throw new Error(res.errors);
      dispatch({ type: "COMMAND_SENT" });
      setIsSending(false);
    }
    catch (error) {
      console.log(error)
      dispatch({ type: "COMMAND_ERROR", error });
      setError(true);
      setIsSending(false);
    }
  } else {
    console.log("No token found")
    dispatch({ type: "COMMAND_ERROR", error: "No token found" });
    setError(true);
    setIsSending(false);
  }
}

export async function fetchContracts(dispatch, token, setIsFetching, setError) {
  setError(false);
  setIsFetching(true);

  if (!!token) {
    dispatch({ type: "CONTRACT_REQUEST"});
    try {
      const options = { method: 'GET', headers: { "Authorization": "Bearer " + token } };
      const response = await fetch("/contracts/search", options);
      const json = await response.json();
      if (json.status !== 200) throw new Error(json.errors);
      const contracts = [].concat.apply([], json.result);
      dispatch({ type: "CONTRACT_RESPONSE", contracts });
      setIsFetching(false);
    }
    catch (error) {
      console.log(error)
      dispatch({ type: "CONTRACT_ERROR", error });
      setError(true);
      setIsFetching(false);
    }
  } else {
    console.log("No token found")
    dispatch({ type: "CONTRACT_ERROR", error: "No token found" });
    setError(true);
    setIsFetching(false);
  }
}

function templateFilter(contract, moduleName, entityName) {
  if (moduleName && entityName) {
    return (contract.templateId.moduleName === moduleName
      && contract.templateId.entityName === entityName);
  } else if (moduleName) {
    return contract.templateId.moduleName === moduleName;
  } else if (entityName) {
    return contract.templateId.entityName === entityName;
  }
  return true;
}

export function getContracts(state, moduleName, entityName) {
  return state.contracts.filter(c => templateFilter(c, moduleName, entityName));
}

export function getContract(state, moduleName, entityName) {
  return state.contracts.find(c => templateFilter(c, moduleName, entityName));
}
