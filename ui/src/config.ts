import * as jwt from "jsonwebtoken";
import partyList from "./parties.json";

const parties : any = {};
partyList.forEach(p => parties[p._1] = p._2);
const names : any = {};
partyList.forEach(p => names[p._2] = p._1);

const applicationId = 'daml-ui-template'
const ledgerId = "sandbox";

// Unfortunately, the development server of `create-react-app` does not proxy
// websockets properly. Thus, we need to bypass it and talk to the JSON API
// directly in development mode.
export const wsBaseUrl = "ws://localhost:7575/";
export const httpBaseUrl = undefined;

export const createToken = (party : string) => jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret")

export const damlAppKey = applicationId + ".daml.name";

const tokens : any = {};
partyList.forEach(p => tokens[p._2] = createToken(p._2));

export function getParty(name : string) : string {
  return (parties[name] || "") as string;
}

export function getName(party : string) : string {
  return (names[party] || "") as string;
}

export function getToken(party : string) {
  return (tokens[party] || "") as string;
}
