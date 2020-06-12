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
import AliasedTextfield from "../../components/AliasedTextfield/AliasedTextfield";

export interface RegularField {
  label : string
  type : "text" | "number" | "date"
}

export interface SelectionField {
  label : string
  type : "selection"
  items : string[]
}

export interface AliasedPartiesField {
  label : string
  type : "aliasedParties"
  placeholder : string
}

export type Field = RegularField | SelectionField | AliasedPartiesField

export interface InputDialogProps<T extends {[key: string]: any }> {
  open : boolean
  title : string
  defaultValue : T
  fields : Record<keyof T, Field>
  onClose : (state : T | null) => Promise<void>
}

export function InputDialog<T extends { [key : string] : any }>(props : InputDialogProps<T>) {
  const [ state, setState ] = useState<T>(props.defaultValue);

  const fieldsToInput = ([fieldName, field]:[string, Field], index:number) : JSX.Element => {
    switch(field.type) {
      case "selection":
        return (
          <FormControl key={index} fullWidth>
            <InputLabel required>{field.label}</InputLabel>
            <Select
                value={state[fieldName]}
                defaultValue={""}
                onChange={e => setState({ ...state, [fieldName]: e.target.value })}>
              {field.items.map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
            </Select>
          </FormControl>
        )
      case "aliasedParties":
        return (
          <AliasedTextfield
            placeholder={field.placeholder}
            onChange={e => {
              if(e === null){
                setState({ ...state, [fieldName]: e })}
              }
            }
          />
        )
      case "date":
        return (
          <TextField
            required
            autoFocus
            fullWidth
            key={index}
            label={field.label}
            type={field.type}
            onChange={e => setState({ ...state, [fieldName]: e.target.value })}
            InputLabelProps={{ shrink:true, required:true }}
            placeholder="YYYY-MM-DD"
          />
        )
      case "text":
      case "number":
        return (
          <TextField
            required
            autoFocus
            fullWidth
            key={index}
            label={field.label}
            type={field.type}
            onChange={e => setState({ ...state, [fieldName]: e.target.value })}
            InputLabelProps={{ required:true }}
          />
        )
    }
  }
  const fieldsAsArray : [string, Field][] = Object.entries(props.fields);

  return (
    <Dialog open={props.open} onClose={() => props.onClose(null)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
        {fieldsAsArray.map((value, index) => fieldsToInput(value, index))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(null)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => props.onClose(state)} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}