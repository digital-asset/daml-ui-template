import React, { useState } from "react";
import ReactJson from "react-json-view";
import { Grid, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from "@material-ui/core";
import useStyles from "./styles";
import { CreateEvent } from "@daml/ledger";

type ColumnAction = {
  name : string
  handle : (c : CreateEvent<any>, p : string) => void
  paramName : string
}

type ColumnDefinition = {
  name : string
  path : string
}

type ContractsProps = {
  contracts : readonly CreateEvent<any>[]
  columns : ColumnDefinition[]
  actions : ColumnAction[]
}

export default function Contracts({ contracts, columns, actions } : ContractsProps) {

  const isDefault = columns.length === 0;
  const cols = isDefault ? [ { name: "TemplateId", path: "templateId" }, { name: "ContractId", path: "contractId" } ] : columns;

  const classes = useStyles();
  var [state, setState] = useState<any>({});
  const handleChange = (name : string) => (event : any) => { setState({ ...state, [name]: event.target.value }); };

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Grid>
      </Grid>
    </>
  );
}
