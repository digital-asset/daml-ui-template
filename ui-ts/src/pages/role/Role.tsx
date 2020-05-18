import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { field, text, menu, number, date } from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";
import { CreateEvent } from "@daml/ledger";

export default function Role() {

  const ledger = useLedger();
  const roles = useStreamQuery(Main.AssetCreatorRole);
  const doCreate = function(contract: CreateEvent<any>, params: any) {
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
