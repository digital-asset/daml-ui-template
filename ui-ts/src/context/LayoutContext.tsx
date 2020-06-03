import React from "react";


type LayoutState = {
  isSidebarOpened : boolean
}

type LayoutAction = {
  type : "TOGGLE_SIDEBAR"
}

const LayoutStateContext = React.createContext<LayoutState>({ isSidebarOpened: true });
const LayoutDispatchContext = React.createContext<React.Dispatch<LayoutAction>>({} as React.Dispatch<LayoutAction>);

function layoutReducer(state : LayoutState, action : LayoutAction) {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
  }
}

const LayoutProvider : React.FC = ({ children }) => {
  var [state, dispatch] = React.useReducer(layoutReducer, {
    isSidebarOpened: true,
  });
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
}

function useLayoutState() {
  var context = React.useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}

function useLayoutDispatch() {
  var context = React.useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context;
}

export { LayoutProvider, useLayoutState, useLayoutDispatch, toggleSidebar };

// ###########################################################
function toggleSidebar(dispatch : React.Dispatch<LayoutAction>) {
  dispatch({
    type: "TOGGLE_SIDEBAR",
  });
}
