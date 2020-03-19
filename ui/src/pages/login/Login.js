import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Typography, Button, TextField, Fade } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import logo from "./logo.svg";
import { useUserDispatch, loginUser, loginDablUser } from "../../context/UserContext";
import { isLocalDev } from "../../config";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");

  useEffect(() => {
    const url = new URL(window.location.toString());
    const token = url.searchParams.get('token');
    if (token === null) {
      return;
    }
    const party = url.searchParams.get('party');
    if (party === null) {
      throw Error("When 'token' is passed via URL, 'party' must be passed too.");
    }
    localStorage.setItem("daml.party", party);
    localStorage.setItem("daml.token", token);
    console.log(`Set party to ${party} and token to ${token}`)
    // dispatch({ type: "LOGIN_SUCCESS", token, user, party });
    userDispatch({ type: "LOGIN_SUCCESS", token, party });
  })

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>App Template</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              {!isLocalDev &&
                <>
                <Button variant="contained" color="primary" size="large" onClick={loginDablUser}>
                  Log in with DABL
                </Button>
                <Typography>
                  OR
                </Typography>
                </>}
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    loginUser(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                }}
                margin="normal"
                placeholder="Username"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    loginUser(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                }}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ?
                  <CircularProgress size={26} className={classes.loginLoader} />
                : <Button
                    disabled={loginValue.length === 0}
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>}
              </div>
            </React.Fragment>
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
