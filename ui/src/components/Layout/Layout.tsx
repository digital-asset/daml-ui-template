import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import DamlLedger from "@daml/react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Report from "../../pages/report/Report";
import Session from "../../pages/session/Session";
import { useUserState } from "../../context/UserContext";
import { SessionProvider } from "../../context/SessionContext";
import { AliasesContextProvider } from "../../context/AliasesContext";
import { wsBaseUrl, httpBaseUrl } from "../../config";
import useStyles from "./styles";

const Layout = () => {
  const classes = useStyles();
  const user = useUserState();

  if(!user.isAuthenticated){
    return null;
  } else {
    return (
      <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
        <SessionProvider>
          <AliasesContextProvider>
            <div className={classes.root}>
                <>
                  <Header />
                  <Sidebar />
                  <div className={classes.content}>
                    <div className={classes.fakeToolbar} />
                    <Switch>
                      <Route path="/app/report" component={Report} />
                      <Route path="/app/session" component={Session} />
                      {/* List this last to always redirect to Report instead of failing. */}
                      <Redirect to="/app/report"></Redirect>
                    </Switch>
                  </div>
                </>
            </div>
          </AliasesContextProvider>
        </SessionProvider>
      </DamlLedger>
    );
  }
}

export default withRouter(Layout);
