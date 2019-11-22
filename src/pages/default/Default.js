import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useLedgerState, getContracts } from "../../context/LedgerContext";

function Default() {

  const ledger = useLedgerState();
  const allContracts = getContracts(ledger);

  return (
    <>
      <Contracts contracts={allContracts} />
    </>
  );
}

export default Default