import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

export interface Selection {
  items : string[]
}

export interface Field {
  name : string
  label : string
  type : string | Selection
}

export interface InputDialogProps {
  open : boolean
  title : string
  fields : Field[]
  onClose : (state : any) => Promise<void>
}

export const InputDialog = (props : InputDialogProps) => {
  const [ state, setState ] = useState<any>({});

  return (
    <Dialog open={props.open} onClose={() => props.onClose(undefined)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
        {props.fields.map((f, i) => {
          if ((f.type as Selection).items) {
            return (<FormControl key={i} fullWidth>
              <InputLabel>{f.label}</InputLabel>
              <Select value={state[f.name] || ""} defaultValue="" onChange={e => setState({ ...state, [f.name]: e.target.value })}>
                {(f.type as Selection).items.map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
              </Select>
            </FormControl>)
          } else {
            return (<TextField required autoFocus fullWidth key={i} label={f.label} type={f.type as string} onChange={e => setState({ ...state, [f.name]: e.target.value })} />)
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(undefined)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => props.onClose(state)} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}