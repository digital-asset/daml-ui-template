import React, { useState } from "react";
import { useQuery } from "@daml/react";
import { ContractId } from "@daml/types";
import { PersonWithAddress  } from "@daml.js/daml-ui-template-0.0.1/lib/Main";

//type RecordProps ={
//  showMe :  ContractId<PersonWithAddress>
//}

export default function Record(){
  const q = useQuery(PersonWithAddress);

  return (
    <div>
      {JSON.stringify(q)}
    </div>
  );
}