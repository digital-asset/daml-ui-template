import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { CreateEvent } from "@daml/ledger";
import { Appraise, Asset, Give  } from "@daml.js/daml-ui-template-0.0.1/lib/Main";
import { InputDialog, InputDialogProps } from "./InputDialog";
import useStyles from "./styles";

export default function Report() {
  const classes = useStyles();

  const defaultGive = { newOwner : " " };
  const defaultGiveProps : InputDialogProps<Give> = {
    open:false,
    title: "Give Asset",
    defaultValue:defaultGive,
    fields : {
      newOwner : {
        label: "New Owner",
        type: "selection",
        items: [ "Alice", "Bob" ] } },
    onClose: async () => {}
  };

  const [ giveProps, setGiveProps ] = useState(defaultGiveProps);
  const today = (new Date()).toISOString().slice(0,10);
  const defaultAppraise = {
    newDateOfAppraisal : today,
    newValue : "0" };
  const defaultAppraiseProps : InputDialogProps<Appraise> = {
    open:false,
    title: "Appraise Asset",
    defaultValue:defaultAppraise,
    fields : {
      newDateOfAppraisal : {
        label: "New Date of Appraisal",
        type: "date" },
      newValue : {
        label: "New Value",
        type: "number" }
      },
    onClose: async () => {}
  };

  const [ appraiseProps, setAppraiseProps ] = useState(defaultAppraiseProps);
  const showGive = (asset : CreateEvent<Asset>) => {
    const onClose = async (state : Give | null) => {
      console.log(state);
      setGiveProps({ ...defaultGiveProps, open:false});
      if (!state) return;
      await ledger.exercise(Asset.Give, asset.contractId, state);
    }
    setGiveProps({ ...defaultGiveProps, open: true, onClose})
  };

  const party = useParty();
  const ledger = useLedger();
  const assets = useStreamQuery(Asset).contracts;

  const showAppraise = (asset : CreateEvent<Asset>) => {
    const onClose = async (state : Appraise | null) => {
      console.log(state);
      setAppraiseProps({ ...defaultAppraiseProps, open:false});
      if (!state) return;
      await ledger.exercise(Asset.Appraise, asset.contractId, state);
    }
    setAppraiseProps({...defaultAppraiseProps, open:true, onClose});
  };

  return (
    <>
      <InputDialog { ...giveProps } />
      <InputDialog { ...appraiseProps } />
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Issuer</TableCell>
            <TableCell key={1} className={classes.tableCell}>Owner</TableCell>
            <TableCell key={2} className={classes.tableCell}>Name</TableCell>
            <TableCell key={3} className={classes.tableCell}>Value</TableCell>
            <TableCell key={4} className={classes.tableCell}>DateOfAppraisal</TableCell>
            <TableCell key={5} className={classes.tableCell}>Give</TableCell>
            <TableCell key={6} className={classes.tableCell}>Appraise</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((a, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{a.payload.issuer}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{a.payload.owner}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{a.payload.name}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{a.payload.value}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{a.payload.dateOfAppraisal}</TableCell>
              <TableCell key={5} className={classes.tableCell}>
                <Button color="primary" size="small" className="px-2" variant="contained" disabled={a.payload.owner !== party} onClick={() => showGive(a)}>Give</Button>
              </TableCell>
              <TableCell key={6} className={classes.tableCell}>
                <Button color="primary" size="small" className="px-2" variant="contained" disabled={a.payload.issuer !== party} onClick={() => showAppraise(a)}>Appraise</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
