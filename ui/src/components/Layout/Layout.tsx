import React from "react";
import { Route, Routes } from "react-router-dom";
import DamlLedger from "@daml/react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Report from "../../pages/report/Report";
import { useUserState } from "../../context/UserContext";
import { wsBaseUrl, httpBaseUrl } from "../../config";
import useStyles from "./styles";
import Login from "../../pages/login/Login";

const Layout = () => {
  const classes = useStyles();
  // const user = useUserState();
  const [user, setUser] = React.useState<any>(useUserState());

  if(!user.isAuthenticated){
    return null;
  } else {
    return (
      <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
        <div className={classes.root}>
            <>
              <Header />
              <Sidebar />
              <div className={classes.content}>
                <div className={classes.fakeToolbar} />
                <Routes>
                  <Route path="/app/report" element={Report} />
                </Routes>
              </div>
            </>
        </div>
      </DamlLedger>

    );
  }
}

export default Layout;
