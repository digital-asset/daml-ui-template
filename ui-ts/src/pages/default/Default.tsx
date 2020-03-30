import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery } from "@daml/react";
import { Asset } from "@daml2ts/daml-ui-template-0.0.1/lib/Main";

export default function Default() {

  const assets = useStreamQuery(Asset);

  return (<Contracts contracts={assets.contracts} columns={[]} actions={[]} />);
}
