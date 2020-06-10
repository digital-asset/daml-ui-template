import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useLayoutState } from "../../context/LayoutContext";
import Role from "../../pages/role/Role";
import Report from "../../pages/report/Report";
import DamlLedger from "@daml/react";
import { useUserState } from "../../context/UserContext";
import Default from "../../pages/default/Default";
import { wsBaseUrl, httpBaseUrl } from "../../config";

function Layout() {
  const classes = useStyles();
  const user = useUserState();
  const layoutState = useLayoutState();

  if(!user.isAuthenticated){
    return null;
  } else {
    return (
      <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
        <div className={classes.root}>
            <>
              <Header />
              <Sidebar />
              <div
                className={classnames(classes.content, {
                  [classes.contentShift]: layoutState.isSidebarOpened,
                })}
              >
                <div className={classes.fakeToolbar} />
                <Switch>
                  <Route path="/app/default" component={Default} />
                  <Route path="/app/report" component={Report} />
                  <Route path="/app/role" component={Role} />
                </Switch>
              </div>
            </>
        </div>
      </DamlLedger>
    );
  }
}

export default withRouter(Layout);
