import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useLedger } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";
import { Grid, Typography, TextField, Button } from "@material-ui/core";

function NewAsset({ history } : RouteComponentProps) {

  const today = (new Date()).toISOString().slice(0,10);
  const emptyAsset =
  { issuer: "", owner: "", name: "", dateOfAppraisal: today, value: "0" }
  const ledger = useLedger();
  var [state, setState] = useState<Main.Asset>(emptyAsset);

  const createAsset = async () => {
    await ledger.create(Main.Asset, state);
    setState(emptyAsset);
    history.push("/app/report");
  }
  return (
    <Grid container>
    <Grid item xs={12} style={{ paddingBottom: "30px" }}><Typography variant="h2">New Asset</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>Issuer</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><TextField onChange={e => setState({ ...state, "issuer": e.target.value })} /></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>Owner</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><TextField onChange={e => setState({ ...state, "owner": e.target.value })} /></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>Name</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><TextField onChange={e => setState({ ...state, "name": e.target.value })} /></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>Date of Appraisal</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><TextField type="date" value={state.dateOfAppraisal} onChange={e => setState({ ...state, "dateOfAppraisal": e.target.value })} /></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><Typography>Value</Typography></Grid>
    <Grid item xs={3} style={{ padding: "10px" }}><TextField type="number" value={state.value} onChange={e => setState({ ...state, "value": e.target.value })} /></Grid>
    <Grid item xs={6}></Grid>
    <Grid item xs={12} style={{ paddingTop: "30px" }}><Button color="primary" variant="contained" onClick={createAsset}>Create</Button></Grid>
  </Grid>
  );
}

export default withRouter(NewAsset);
