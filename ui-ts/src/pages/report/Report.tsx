import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { Main } from "@daml2js/daml-ui-template-0.0.1";
import { ContractId, Party } from "@daml/types";

export default function Report() {

  const ledger = useLedger();
  const assets = useStreamQuery(Main.Asset);
  const exerciseGive = (cid : ContractId<Main.Asset>, newOwner : Party) => {
    ledger.exercise(Main.Asset.Give, cid, { newOwner });
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
        ]}
        actions={[
          { name: "Give", handle: (c, newOwner) => { exerciseGive(c.contractId, newOwner); }, paramName: "New Owner" }
        ]}
      />
    </>
  );
}
