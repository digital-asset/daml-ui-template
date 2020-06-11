import React, { useEffect, useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { field, text, menu, number, date } from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";
import { CreateEvent } from "@daml/ledger";

export default function Role() {

  const party = useParty();
  const ledger = useLedger();
  const roles = useStreamQuery(Main.AssetCreatorRole);
  const [createRequestSent, setCreateRequestSent] = useState<boolean>(false);
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

  const doCreate = function(contract: CreateEvent<Main.AssetCreatorRole>, params: any) {
    const payload : Main.CreateAsset = {
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
          { name: "ContractId", path: "contractId" },
          { name: "Owner", path: "payload.roleOwner" },
        ]}
        actions={[]}
        dialogs={
          [{
            name: "Create new asset",
            dialogFields: [
              field("Name", text),
              field("Value", number),
              field("Owner", menu(["Alice", "Bob"])),
              field("Date of issuance", date)
            ],
            action: doCreate
          }]}
      />
    </>
  );
}
