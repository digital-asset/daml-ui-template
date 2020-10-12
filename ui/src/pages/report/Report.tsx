import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Ledger from "@daml/ledger";
import { useStreamQuery, useLedger, useParty} from "@daml/react";
import { ContractId } from "@daml/types";
import { Appraise, Asset, Give, PersonWithAddress  } from "@daml.js/daml-ui-template-0.0.1/lib/Main";
import { InputDialog, InputDialogProps } from "./InputDialog";
import useStyles from "./styles";
import { Grid } from "@material-ui/core";

export default function Report() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const assets = useStreamQuery(PersonWithAddress).contracts;
  var [nameFilter, setNameFilter] = useState('');
  var [addressFilter, setAddressFilter] = useState('');
  var [pageCount, setPageCount] = useState(0);
  var [pageSize, setPageSize] = useState<number>(16);

    const defaultGiveProps : InputDialogProps<Give> = {
    open: false,
    title: "Give Asset",
    defaultValue: { newOwner : "" },
    fields: {
      newOwner : {
        label: "New Owner",
        type: "selection",
        items: [ "Alice", "Bob" ] } },
    onClose: async function() {}
  };

  const [ giveProps, setGiveProps ] = useState(defaultGiveProps);
  // One can pass the original contracts CreateEvent
  function showGive(asset : Asset.CreateEvent) {
    async function onClose(state : Give | null) {
      setGiveProps({ ...defaultGiveProps, open: false});
      // if you want to use the contracts payload
      if (!state || asset.payload.owner === state.newOwner) return;
      await ledger.exercise(Asset.Give, asset.contractId, state);
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
      <FormControl style={{ marginLeft : '30px' }}>
        <InputLabel htmlFor="input-with-icon-adornment">Filter full name</InputLabel>
        <Input
          id="input-with-icon-adornment"
          onChange={(event) => setNameFilter(event.target.value)}
          value={nameFilter}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl style={{ marginLeft : '30px' }}>
        <InputLabel htmlFor="input-with-icon-adornment" >Filter address</InputLabel>
        <Input
          id="input-with-icon-adornment"
          onChange={(event) => setAddressFilter(event.target.value)}
          value={addressFilter}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          }
        />
      </FormControl>
      <Grid item>
      </Grid>
      <Grid item>
        <TextField style={{ marginLeft : '30px' }}
                autoFocus
                label="Page Number"
                type="number"
                onChange={(event) => setPageCount(parseInt(event.target.value))}
                value={pageCount}
                />
                </Grid>
                <Grid item>
                <TextField style={{ marginLeft : '30px' }}
                autoFocus
                label="Page Size"
                type="number"
                onChange={(event) => setPageSize(parseInt(event.target.value))}
                value={pageSize}
                />
                </Grid>

      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Party</TableCell>
            <TableCell key={1} className={classes.tableCell}>Full Name</TableCell>
            <TableCell key={2} className={classes.tableCell}>Address</TableCell>
            {/* <TableCell key={3} className={classes.tableCell}>Value</TableCell>
            <TableCell key={4} className={classes.tableCell}>DateOfAppraisal</TableCell>
            <TableCell key={5} className={classes.tableCell}>Give</TableCell>
            <TableCell key={6} className={classes.tableCell}>Appraise</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.filter(x => x.payload.details.personName.indexOf(nameFilter)!==-1
          && x.payload.details.personAddress.indexOf(addressFilter)!==-1).slice(pageSize*pageCount, pageSize*pageCount+pageSize).map(a => (
            <TableRow key={a.contractId} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{a.payload.administrator}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{a.payload.details.personName}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{a.payload.details.personAddress}</TableCell>
              {/* <TableCell key={6} className={classes.tableCellButton}>
                <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={a.payload.issuer !== party} onClick={() => showAppraise(a.contractId)}>Appraise</Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
