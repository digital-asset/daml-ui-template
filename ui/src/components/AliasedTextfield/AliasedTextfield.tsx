import React, {useState} from "react";
import { Autocomplete, createFilterOptions, FilterOptionsState } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { AliasRecord, useAliases } from "../../context/AliasesContext";

type AliasedTextfieldProps = {
  onChange : (arg1:string|null) => void
  placeholder : string
}

type AutocompleteState = AliasRecord | string | null

const filter = createFilterOptions<AutocompleteState>();

// A text field that draws input from
export default function AliasedTextfield({onChange, placeholder} : AliasedTextfieldProps){
  const aliases = useAliases();
  const [value, setValue] = useState<string|null>(null);
  function handleChange(event: any, value:AutocompleteState, reason: any){
    const newValue = (typeof value === 'string') ? value: value?.partyId ?? null;
    setValue(newValue);
    onChange(newValue);
  }

  function filterOptions(options : AutocompleteState[], state : FilterOptionsState<AutocompleteState>){
    const filtered = filter(options, state);
    if (state.inputValue !== '') {
      filtered.push({ partyId: state.inputValue, alias: `Unaliased party: "${state.inputValue}"` });
    }
    return filtered;
  }

  function getOptionLabel(option : AutocompleteState){
    return (typeof option === 'string') ? option : (option?.alias ?? "");
  }

  return (
    <Autocomplete
      multiple={false}          // Only specified to help with the type inference
      disableClearable={false}  // Only specified to help with the type inference
      value={value}
      onChange={handleChange}
      filterOptions={filterOptions}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={aliases}
      getOptionLabel={getOptionLabel}
      freeSolo
      renderInput={(params) =>
        <TextField {...params}
          placeholder={placeholder}
        />}
    />
  )
}