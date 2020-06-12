import React, {useEffect, useState} from "react";
import { useStreamFetchByKey } from "@daml/react";
import { useWellKnownParties } from "@daml/dabl-react";
import { User } from "@daml.js/daml-ui-template-0.0.1";

export type AliasRecord = {
  alias : string
  partyId : string
}

export type AliasMap = Record<string,string>

const AliasesContext = React.createContext<[AliasRecord[], AliasMap]>([[],{}]);

export function AliasesContextProvider({children}:{children:React.ReactNode}){

  const [aliases, setAliases] = useState<AliasRecord[]>([]);
  const [aliasMap, setAliasMap] = useState<AliasMap>({});
  const wellKnownParties = useWellKnownParties();
  const aliasesQuery = useStreamFetchByKey( User.Aliases
                                          , () => wellKnownParties.userAdminParty
                                          , [wellKnownParties.userAdminParty]);

  useEffect(() => {
    console.log(`aliasesQuery ${JSON.stringify(aliasesQuery)}`);
    if(!aliasesQuery.loading && !!aliasesQuery.contract){
      let recordObj : Record<string,string> = aliasesQuery.contract.payload.userNames.textMap ?? {};
      let records = Object.entries(recordObj).map(([alias,partyId])=>({alias,partyId}));
      setAliases(records);
      let reversed = Object.entries(recordObj).map(([alias,partyId])=>[partyId,alias]);
      let aliasMap = Object.fromEntries(reversed);
      setAliasMap(aliasMap);
    }
  }, [aliasesQuery]);

  return (
    <AliasesContext.Provider value={[aliases, aliasMap]}>
      {children}
    </AliasesContext.Provider>
  )
}

export function useAliases():AliasRecord[]{
  var context = React.useContext(AliasesContext);
  if(context === undefined){
    throw new Error("useAliases must be within AliasesContext Provider");
  }
  return context[0]
}

export function useAliasMap():AliasMap{
  var context = React.useContext(AliasesContext);
  if(context === undefined){
    throw new Error("useAliases must be within AliasesContext Provider");
  }
  return context[1]
}
