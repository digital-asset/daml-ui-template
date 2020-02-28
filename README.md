# DAML App Template

## Overview

This repository contains a simple UI template for a DAML application. It provides ledger connectivity and shows how to create simple reports from contracts. The template is based on [create-react-app](https://github.com/facebook/create-react-app) and the [Material UI](https://material-ui.com/) framework.

## Prerequisites

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* [DAML SDK](https://docs.daml.com/getting-started/installation.html)

## Quick Start

Build the DAML project:

    daml build
    
Start the sandbox ledger:

    daml start --sandbox-option '--ledgerid=daml-ui-tempalte' --sandbox-option '-w' --start-navigator 'no'

Run the initialization script:

    daml script --dar .daml/dist/daml-ui-template-0.0.1.dar --script-name Main:setup --ledger-host localhost --ledger-port 6865 --wall-clock-time

Generate the Typescript code:

    daml codegen ts .daml/dist/daml-ui-template-0.0.1.dar -o daml-ts/src

Install the Javascript dependencies:
    
    yarn workspaces run install

Build the UI code:

    yarn workspaces run build

Start up the development server:

    cd ui && yarn start

This opens a browser page pointing to `http://localhost:3000/#/login`. Note that the development server serves content via http and should not be exposed as is to a public-facing network.

Login as `Alice` (case sensitive), leaving the password blank.

You are now redirected to `http://localhost:3000/#/app/report` where you see the contract listed with an explorable JSON tree in the `Argument` column. This the default view implemented in [src/pages/default/Default.js](src/pages/Default.js), which uses the `Contracts` React component's defaults. It is useful to explore a contracts data to determine which fields to display.

In the report tab you can see a ledger view with specific fields displayed for the contract, a textfield and button to exercise a choice. It is implemented in [src/pages/report/Report.js](src/pages/report/Report.js), where you can see how custom columns and actions can be passed to the `Contracts` component.

You can now transfer asset from Alice to Bob by entering `Bob` as the new owner and hitting hit `Enter`. This exercises the `Give` choice on the contract, which assigns the new owner. Notice how the `owner` changes when you do that.

By modifying this template you can now create a custom UI for your DAML application.

## Running against DABL

First, deploy your DAML model to DABL and create the `Alice` and `Bob` parties. Then, make the folloing changes in [src/config.js](src/config.js):

1. Switch the `isLocalDev` flag to `false`
2. Set the `ledgerId` to the one found on the *Ledger Settings* page in DABL
3. Copy the JWT tokens for each party from the *Ledger Settings* page in DABL into the `tokens` field on the `dablConfig` object
4. Lookup the obfuscated party names for each party in the *Live Data* page in DABL on the `LedgerParty` contracts and copy them into the `parties` field on the `dablConfig` object

Finally, you need to change the `proxy` config entry in [package.json](package.json) to point to the DABL API endpoint, which can also be copied from the *Ledger Settings* page in DABL.

Now you can run `yarn start` and interact with the application as described above. Note that when exercising the `Give` choice you now need to paste in the obfuscated DABL party name.
