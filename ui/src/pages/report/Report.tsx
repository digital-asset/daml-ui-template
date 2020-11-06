import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Ledger from "@daml/ledger";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { ContractId } from "@daml/types";
import { Appraise, Asset, Give, NewOwner  } from "@daml.js/daml-ui-template-0.0.1/lib/Main";
import { InputDialog, InputDialogProps } from "./InputDialog";
import useStyles from "./styles";

type NameLess = Pick<NewOwner, "owner">

export default function Report() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const assets = useStreamQuery(Asset).contracts;

  const defaultGiveProps : InputDialogProps<NameLess> = {
    open: false,
    title: "Give Asset",
    defaultValue: { owner : ""},
    fields: {
      owner : {
        label: "New Owner",
        type: "selection",
        items: [ "Alice", "Bob" ] } },
    onClose: async function() {}
  };

  const [ giveProps, setGiveProps ] = useState(defaultGiveProps);
  // One can pass the original contracts CreateEvent
  function showGive(asset : Asset.CreateEvent) {
    async function onClose(state : NameLess | null) {
      setGiveProps({ ...defaultGiveProps, open: false});
      // if you want to use the contracts payload
      if (!state || asset.payload.owner === state.owner) return;
      await ledger.exercise(Asset.Give, asset.contractId, {newOwner: { ... state, ownerName: "foobar"}});
    };
    setGiveProps({ ...defaultGiveProps, open: true, onClose})
  };

  type UserSpecifiedAppraise = Pick<Appraise, "newValue">;
  const today = (new Date()).toISOString().slice(0,10);
  const defaultAppraiseProps : InputDialogProps<UserSpecifiedAppraise> = {
    open: false,
    title: "Appraise Asset",
    defaultValue: { newValue: "0" },
    fields: {
      newValue : {
        label: "New Value",
        type: "number" }
      },
    onClose: async function() {}
  };
  const [ appraiseProps, setAppraiseProps ] = useState(defaultAppraiseProps);

  // Or can pass just the ContractId of an
  function showAppraise(assetContractId : ContractId<Asset>) {
    async function onClose(state : UserSpecifiedAppraise | null) {
      setAppraiseProps({ ...defaultAppraiseProps, open: false});
      if (!state) return;
      const withNewDateOfAppraisal = { ...state, newDateOfAppraisal:today};
      await ledger.exercise(Asset.Appraise, assetContractId, withNewDateOfAppraisal);
    };
    setAppraiseProps({...defaultAppraiseProps, open: true, onClose});
  };

  type InputFieldsForNewAsset = Omit<Asset, "issuer">;
  const defaultNewAssetProps : InputDialogProps<InputFieldsForNewAsset> = {
    open: false,
    title: "New Asset",
    defaultValue: {
      owner: party,
      name: "",
      dateOfAppraisal: today,
      value: "0",
    },
    fields: {
      owner: {
        label: "Owner",
        type: "selection",
        items: [ "Alice", "Bob" ],
      },
      name: {
        label: "Name of Asset",
        type: "text"
      },
      dateOfAppraisal: {
        label: "Date of Appraisal",
        type: "date"
      },
      value: {
        label: "Value",
        type: "number"
      }
    },
    onClose: async function() {}
  };
  const [newAssetProps, setNewAssetProps] = useState(defaultNewAssetProps);
  function showNewAsset() {
    async function onClose(state : InputFieldsForNewAsset | null) {
      setNewAssetProps({ ...defaultNewAssetProps, open: false});
      if (!state) return;
      const withIssuer = { ...state, issuer:party};
      await ledger.create(Asset, withIssuer);
    };
    setNewAssetProps({...defaultNewAssetProps, open: true, onClose});
  };

  return (
    <>
      <InputDialog { ...giveProps } />
      <InputDialog { ...appraiseProps } />
      <InputDialog { ...newAssetProps } />
      <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => showNewAsset()}>
        Create New Asset
      </Button>
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
          {assets.map(a => (
            <TableRow key={a.contractId} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{a.payload.issuer}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{a.payload.owner}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{a.payload.name}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{a.payload.value}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{a.payload.dateOfAppraisal}</TableCell>
              <TableCell key={5} className={classes.tableCellButton}>
                <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={a.payload.owner !== party} onClick={() => showGive(a)}>Give</Button>
              </TableCell>
              <TableCell key={6} className={classes.tableCellButton}>
                <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={a.payload.issuer !== party} onClick={() => showAppraise(a.contractId)}>Appraise</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
