import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { PublicLedger, useWellKnownParties, WellKnownPartiesProvider } from "@daml/dabl-react";
import Themes from "./themes";
import App from "./components/App";
import { UserProvider } from "./context/UserContext";
import { ledgerId, httpBaseUrl, wsBaseUrl, defaultPublicToken, isLocalDev  } from "./config";

const WrapPublicLedger : React.FC = ({children}) => {
  const wellKnownParties = useWellKnownParties();
  return (
    <PublicLedger ledgerId={ledgerId} publicParty={wellKnownParties.publicParty} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl} defaultToken={defaultPublicToken}>
      {children}
    </PublicLedger>
  )
}

const defaultWkp = isLocalDev ? {userAdminParty:"UserAdmin", publicParty:"Public"} : undefined;
ReactDOM.render(
  <WellKnownPartiesProvider defaultWkp={defaultWkp}>
    <WrapPublicLedger>
      <UserProvider>
        <ThemeProvider theme={Themes.default}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </UserProvider>
    </WrapPublicLedger>
  </WellKnownPartiesProvider>,
  document.getElementById("root"),
);
