import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useExercise } from "@daml/react";
import { Asset } from "@daml2ts/daml-ui-template-0.0.1/lib/Main";

export default function Report() {

  const assets = useStreamQuery(Asset);
  const exerciseGive = useExercise(Asset.Give);

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
          { name: "Give", handle: (c, newOwner) => { exerciseGive(c.contractId, { newOwner: newOwner }); }, paramName: "New Owner" }
        ]}
      />
    </>
  );
}
