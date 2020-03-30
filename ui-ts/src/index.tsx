import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import App from "./components/App";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <ThemeProvider theme={Themes.default}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById("root"),
);
