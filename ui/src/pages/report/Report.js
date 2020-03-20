import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useExercise } from "@daml/react";
import { Asset } from "@daml2ts/daml-ui-template-0.0.1/lib/Main";

export default function Report() {

  const assets = useStreamQuery(Asset);
  const [exerciseGive] = useExercise(Asset.Give);

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
        actions={[["Give", (c, newOwner) => { exerciseGive(c.contractId, { newOwner: newOwner }); }, "New Owner"]]}
      />
    </>
  );
}
