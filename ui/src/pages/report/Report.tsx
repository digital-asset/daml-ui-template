import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { CreateEvent } from "@daml/ledger";
import { Asset } from "@daml.js/daml-ui-template-0.0.1/lib/Main";
import { InputDialog, InputDialogProps, Field } from "./InputDialog";
import useStyles from "./styles";

export default function Report() {
  const classes = useStyles();

  const [ props, setProps ] = useState<InputDialogProps>({ open: false, title: "", fields: [], onClose: async () => {} });
  const party = useParty();
  const ledger = useLedger();
  const assets = useStreamQuery(Asset).contracts;
  
  const showGive = (asset : CreateEvent<Asset>) => {
    const fields : Field[] = [
      { label: "New Owner", name: "newOwner", type: { items: [ "Alice", "Bob" ] } }
    ]
    const onClose = async (state : any) => {
      console.log(state);
      setProps({ open: false, title: "", fields: [], onClose: async () => {} });
      if (!state) return;
      await ledger.exercise(Asset.Give, asset.contractId, state);
    }
    setProps({ open: true, title: "Give Asset", fields, onClose})
  };

  const showAppraise = (asset : CreateEvent<Asset>) => {
    const fields : Field[] = [
      { label: "New Date of Appraisal", name: "newDateOfAppraisal", type: "date" },
      { label: "New Value", name: "newValue", type: "number" }
    ]
    const onClose = async (state : any) => {
      console.log(state);
      setProps({ open: false, title: "", fields: [], onClose: async () => {} });
      if (!state) return;
      await ledger.exercise(Asset.Appraise, asset.contractId, state);
    }
    setProps({ open: true, title: "Appraise Asset", fields, onClose})
  };

  return (
    <>
      <InputDialog { ...props } />
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
