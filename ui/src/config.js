import uuidv4 from "uuid/v4";
import * as jwt from "jsonwebtoken";

const isLocalDev = true;
const ledgerId = "daml-ui-tempalte"
const applicationId = uuidv4();
const createToken = party => jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret")
const parties = [ "Alice", "Bob" ];

// Dev config
const localConfig = {
  isLocalDev,
  tokens: {},
  parties: {}
}
parties.map(p => localConfig.tokens[p.toString()] = createToken(p));

// DABL config
const dablConfig = {
  isLocalDev,
  tokens: {
    Alice: "" // Copy token for Alice from DABL website
  },
  parties: {
    Alice: ""  // Copy Party ID from DABL website
  }
}

const config = isLocalDev ? localConfig : dablConfig
export default config;
