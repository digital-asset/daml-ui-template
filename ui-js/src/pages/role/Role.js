import React, { useEffect, useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { field } from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";

export default function Role() {

  const ledger = useLedger();
  const roles = useStreamQuery(Main.AssetCreatorRole);

  const party = useParty();
  const [createRequestSent, setCreateRequestSent] = useState(false);
  useEffect(() => {
    async function createAssetCreatorRole(){
      setCreateRequestSent(true);
      await ledger.create(Main.AssetCreatorRole, {roleOwner:party} );
    }
    if(!roles.loading && roles.contracts.length === 0 && !createRequestSent){
      createAssetCreatorRole();
    }
    // eslint-disable-next-line
  }, [roles]);

  const doCreate = function(contract, params) {
    const payload = {
      owner: params["Owner"],
      name: params["Name"],
      dateOfIssuance: params["Date of issuance"],
      value: params["Value"]
    }
    ledger.exercise(Main.AssetCreatorRole.CreateAsset, contract.contractId, payload);
  };

  return (
    <>
      <Contracts
        contracts={roles.contracts}
        columns={[
          ["ContractId", "contractId"],
          ["Owner", "payload.roleOwner"],
        ]}
        dialogs={[
          ["Create new asset",
          [field("Name", "text"),
           field("Value", "number"),
           field("Owner", "menu", ["Alice", "Bob"]),
           field("Date of issuance", "date")],
           doCreate
        ]]}
      />
    </>
  );
}
