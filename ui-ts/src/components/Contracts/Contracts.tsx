import React, { useState } from "react";
import ReactJson from "react-json-view";
import { DialogTitle, DialogContent, Dialog, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";
import { CreateEvent } from "@daml/ledger";

// The 'T extends object' type parameter represents the contract template type.

type ColumnAction<T extends object> = {
  name : string
  handle : (c : CreateEvent<T>, p : string) => void
  paramName : string
}

interface CommonFieldSpec { "kind": "date" | "text" | "number" }
interface MenuFieldSpec { "kind": "menu", "items": string[] }

type DialogFieldType = CommonFieldSpec | MenuFieldSpec

type DialogFieldSpec = {
  name : string
  fieldType : DialogFieldType
}

type DialogAction<T extends object> = (c : CreateEvent<T>, p : {}) => void

type ColumnDialog<T extends object> = {
  name : string
  dialogFields : DialogFieldSpec[]
  action : DialogAction<T>
}

type ColumnDefinition = {
  name : string
  path : string
}

type ContractsProps<T extends object> = {
  contracts : readonly CreateEvent<T>[]
  columns : ColumnDefinition[]
  actions : ColumnAction<T>[]
  dialogs : ColumnDialog<T>[]
}

export const text: CommonFieldSpec = { "kind": "text" }
export const date: CommonFieldSpec = { "kind": "date" }
export const number: CommonFieldSpec = { "kind": "number" }
export function menu(items: string[]): MenuFieldSpec {
  return { "kind": "menu", "items": items }
}
export function field(name: string, fieldType: DialogFieldType): DialogFieldSpec {
  return { name, fieldType }
}

export default function Contracts<T extends object>({ contracts, columns, actions, dialogs } : ContractsProps<T>) {

  const isDefault = columns.length === 0;
  const cols = isDefault ? [ { name: "TemplateId", path: "templateId" }, { name: "ContractId", path: "contractId" } ] : columns;

  const classes = useStyles();
  var [state, setState] = useState<any>({});
  const handleChange = (name : string) => (event : any) => { setState({ ...state, [name]: event.target.value }); };

  const dialogOpenStateName = "%isOpen"
  function setDialogState(name1 : string, name2 : string, value : any) {
    const lvl2 = {...state[name1], [name2]: value };
    setState({ ...state, [name1]: lvl2 });
  }

  function getDialogState(name1 : string, name2 : string, defaultValue : any) : boolean {
    if (state[name1] === undefined) {
      state[name1] = {};
    }
    const value = state[name1][name2];
    if (value === undefined) {
      state[name1][name2] = defaultValue;
      return defaultValue;
    } else {
      return value;
    }
  }

  function getByPath(data : any, path : string[]) : any {
    if (path.length === 0) return data;
    if (data[path[0]] === undefined) throw new Error("Object doesn't have key '" + path[0] + "': " + JSON.stringify(data));
    const value = getByPath(data[path[0]], path.slice(1));
    return value;
  }

  function getValue(data : any, path : string) {
    const split = typeof path === "string" && path !== "" ? path.split(".") : [];
    return getByPath(data, split);
  }

  function setDialogOpen(name : string, value : boolean) {
    setDialogState(name, dialogOpenStateName, value);
  }

  function getDialogOpen(name : string) : boolean {
    return (state[name] && state[name][dialogOpenStateName]) || false;
  }

  function doDialogAction<T extends object>(name : string, action : DialogAction<T>, contract : CreateEvent<T>) {
    const payload = { ...state[name] };
    delete payload[dialogOpenStateName];
    action(contract, payload);
    setDialogOpen(name, false);
  }

  function addFormFields(name : string, dialogFieldSpec : DialogFieldSpec[]) {
    return (
      <>
      {dialogFieldSpec.map(spec =>
       <Grid item className={classes.marginB}>
       {(spec.fieldType.kind === "menu")
        ?
          <FormControl key={spec["name"]} fullWidth={true}>
          <InputLabel>{spec["name"]}</InputLabel>
          <Select value={getDialogState(name, spec["name"], spec.fieldType.items[0])} defaultValue={spec.fieldType.items} onChange={(event) => setDialogState(name, spec.name, event.target.value)}>
            {
              spec.fieldType.items.map(item =>
                <MenuItem key={item} value={item}>{item}</MenuItem>
              )
            }
          </Select>
          </FormControl>
        : <TextField
            required
            autoFocus
            fullWidth={true}
            key={spec.name}
            label={spec.name}
            type={spec.fieldType.kind}
            onChange={(event) => setDialogState(name, spec["name"], event.target.value)}
            />}
      </Grid>
      )}
      </>
      );
  }

  function addDialogElements<T extends object>(dialog : ColumnDialog<T>, contract : CreateEvent<T>){
    let dialogKey = dialog.name + contract.contractId;    // Need a contract specific way to modify state.
    return (
      <TableCell className={classes.tableCell}>
        <Button
          color="primary"
          size="small"
          className="px-2"
          variant="contained"
          onClick={() => setDialogOpen(dialogKey, true)}
        >
          {dialog.name}
        </Button>
        <Dialog open={getDialogOpen(dialogKey)} onClose={() => ({})} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialog.name + " " + contract.contractId}
          </DialogTitle>
          <DialogContent>
            <Grid>
            <form>
              {addFormFields(dialogKey, dialog.dialogFields)}
            </form>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(dialogKey, false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => doDialogAction(dialogKey, dialog.action, contract) } color="primary">
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </TableCell>
    );
  }

  return (
    <>
      <Grid container spacing={4}>
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              { cols.map(col =>    (<TableCell className={classes.tableCell} key={col.name}>{col.name}</TableCell>)) }
              { isDefault ?           (<TableCell className={classes.tableCell} key="payload">Payload</TableCell>) : <></>}
              { actions.map(action => (<TableCell className={classes.tableCell} key={action.name}>{action.name}</TableCell>)) }
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((c, i) => (
              <TableRow key={i} className={classes.tableRow}>
                { cols.map(col => (<TableCell key={col.name} className={classes.tableCell}>{getValue(c, col.path)}</TableCell>)) }
                { isDefault
                    ? (<TableCell key="payload" className={classes.tableCell}>
                        <ReactJson src={c.payload} name={false} collapsed={true} enableClipboard={false}/>
                      </TableCell>)
                    : <></> }
                { actions.map(action => (
                  <TableCell key={action.name} className={classes.tableCell}>
                      { action.paramName
                        ? <TextField
                            InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                            onChange={handleChange(action.paramName)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                action.handle(c, state[action.paramName]);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                            placeholder={action.paramName}
                          />
                        : <></> }
                      <Button
                        color="primary"
                        size="small"
                        className="px-2"
                        variant="contained"
                        onClick={() => action.handle(c, state[action.paramName])}
                      >
                        {action.name}
                      </Button>
                    </TableCell>)
                )}
                { dialogs.map(dialog => addDialogElements(dialog, c))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Grid>
      </Grid>
    </>
  );
}
