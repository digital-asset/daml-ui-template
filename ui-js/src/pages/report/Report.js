import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";

export default function Report() {

  const ledger = useLedger();
  const assets = useStreamQuery(Main.Asset);
  const exerciseGive = function(cid, newOwner) {
    ledger.exercise(Main.Asset.Give, cid, { newOwner });
  };

  return (
    <>
      <Contracts
        contracts={assets.contracts}
        columns={[
          ["ContractId", "contractId"],
          ["Issuer", "payload.issuer"],
          ["Owner", "payload.owner"],
          ["Name", "payload.name"],
        ]}
        actions={[["Give", (c, newOwner) => { exerciseGive(c.contractId, newOwner); }, "New Owner"]]}
      />
    </>
  );
}
