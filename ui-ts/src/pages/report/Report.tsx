import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { field, number, date} from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";
import { ContractId, Party } from "@daml/types";
import { CreateEvent } from "@daml/ledger";

export default function Report() {

  const ledger = useLedger();
  const assets = useStreamQuery(Main.Asset);
  const exerciseGive = (cid : ContractId<Main.Asset>, newOwner : Party) => {
    ledger.exercise(Main.Asset.Give, cid, { newOwner });
  };

  const doAppraise = function(contract: CreateEvent<Main.Asset>, params: any) {
    const payload : Main.Appraise = {
      newValue: params["New value"],
      newDateOfAppraisal: params["Date of appraisal"],
    }
    console.log(`wwwwwwwwwwwwwwww ${JSON.stringify(contract)} ${JSON.stringify(payload)}`);
    ledger.exercise(Main.Asset.Appraise, contract.contractId, payload);
  };

  return (
    <>
      <Contracts
        contracts={assets.contracts}
        columns={[
          { name: "ContractId", path: "contractId" },
          { name: "Issuer", path: "payload.issuer" },
          { name: "Owner", path: "payload.owner" },
          { name: "Name", path: "payload.name" },
          { name: "Date of Appraisal", path: "payload.dateOfAppraisal" },
          { name: "Value", path: "payload.value" },
        ]}
        actions={[
          { name: "Give", handle: (c, newOwner) => { exerciseGive(c.contractId, newOwner); }, paramName: "New Owner" }
        ]}
        dialogs={
          [{
            name: "Appraise asset",
            dialogFields: [
              field("New value", number),
              field("Date of appraisal", date)
            ],
            action: doAppraise
          }]}
      />
    </>
  );
}
