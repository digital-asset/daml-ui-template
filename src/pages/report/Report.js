import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useLedgerDispatch, useLedgerState, getContracts, sendCommand, fetchContracts } from "../../context/LedgerContext";
import { useUserState } from "../../context/UserContext";

export default function Report() {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const assets = getContracts(ledger, "Main", "Asset");

  const exerciseChoice = async (c, newOwner) => {
    const command = {
      templateId: { moduleName: "Main", entityName: "Asset" },
      contractId: c.contractId,
      choice: "Give",
      argument: { newOwner: newOwner },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, user.party, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
    <>
      <Contracts
        contracts={assets}
        columns={[
          ["ContractId", "contractId"],
          ["Issuer", "argument.issuer"],
          ["Owner", "argument.owner"],
          ["Name", "argument.name"],
        ]}
        actions={[["Give", exerciseChoice, "New Owner"]]}
      />
    </>
  );
}
