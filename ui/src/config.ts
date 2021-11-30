import * as jwt from "jsonwebtoken";

export const isLocalDev = process.env.NODE_ENV === 'development';

let host = window.location.host.split('.')

const applicationId = 'daml-ui-template'
export const ledgerId = isLocalDev ? applicationId : host[0];

const apiUrl = host

export const httpBaseUrl = isLocalDev ? undefined : ('https://' + apiUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/');

// Unfortunately, the development server of `create-react-app` does not proxy
// websockets properly. Thus, we need to bypass it and talk to the JSON API
// directly in development mode.
export const wsBaseUrl = isLocalDev ? 'ws://localhost:7575/' : undefined;

export const createToken = (party : string) => jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret")

let loginUrl = host.slice(1)
loginUrl.unshift('login')

export const dablLoginUrl = loginUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/auth/login?ledgerId=' + ledgerId;

export const damlPartyKey = applicationId + ".daml.party";
export const damlTokenKey = applicationId + ".daml.token";
