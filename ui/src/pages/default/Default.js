import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useQuery } from "@daml/react";
import { Asset } from "@daml2ts/daml-ui-template/lib/daml-ui-template-0.0.1/Main";

export default function Default() {

  const assets = useQuery(Asset);

  return (<Contracts contracts={assets.contracts} />);
}
