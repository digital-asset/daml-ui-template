import React, { useState } from "react";
import { useLedger } from "@daml/react";
import { User } from "@daml.js/daml-ui-template-0.0.1";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import { useUserState } from "../../context/UserContext";

export default function Session() {

  const ledger = useLedger();
  const userState = useUserState()
  const defaultUserName = userState.type === "AuthenticatedWithSession"
                        ? userState.session.payload.userName
                        : "";
  console.log(`Sessions is ${JSON.stringify(userState)}`);
  const [userName, setUserName] = useState<string>(defaultUserName);
  if(userState.type !== "AuthenticatedWithSession"){
    return null;
  }

  const session = userState.session;
  async function rename(){
    let res = await ledger.exercise( User.Session.Rename, session.contractId, { newUserName:userName } );
    console.log(`Asked to rename: ${JSON.stringify(res)}!`);
  }

  return (
    <Grid container>
    <Grid item xs={12} style={{ paddingBottom: "30px" }}><Typography variant="h2">Session Information</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>Admin Party</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>{session.payload.admin}</Typography></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>User Party</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>{session.payload.user}</Typography></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>User Name</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><TextField onChange={e => setUserName(e.target.value)} defaultValue={userName} /></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Button color="primary" variant="contained" onClick={rename}>Update Your User Name</Button></Grid>
  </Grid>
  );
}
