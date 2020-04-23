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

    daml start --start-navigator 'no'

Generate the Typescript code:

    daml codegen js -o daml2ts .daml/dist/*.dar

Build and run the UI:

For Javascript:

    cd ui-js
    yarn install
    yarn start

For Typescript:

    cd ui-ts
    yarn install
    yarn start

This opens a browser page pointing to `http://localhost:3000/#/login`. Note that the development server serves content via http and should not be exposed as is to a public-facing network.

Login as `Alice` (case sensitive), leaving the password blank.

You are now redirected to `http://localhost:3000/#/app/report` where you see the contract listed with an explorable JSON tree in the `Argument` column. This the default view implemented in [src/pages/default/Default.js](src/pages/Default.js), which uses the `Contracts` React component's defaults. It is useful to explore a contracts data to determine which fields to display.

In the report tab you can see a ledger view with specific fields displayed for the contract, a textfield and button to exercise a choice. It is implemented in [src/pages/report/Report.js](src/pages/report/Report.js), where you can see how custom columns and actions can be passed to the `Contracts` component.

You can now transfer asset from Alice to Bob by entering `Bob` as the new owner and hitting hit `Enter`. This exercises the `Give` choice on the contract, which assigns the new owner. Notice how the `owner` changes when you do that.

By modifying this template you can now create a custom UI for your DAML application.

## Deploying to DABL

Deploying `daml-ui-template` to the hosted DAML platform project:DABL is quite simple. Log into your DABL account, create a new ledger and upload your DAML models and your UI.

To upload the DAML models, compile them into a DAR by executing

```bash
daml build -o daml-ui-template.dar
```

at the root of your repository. Afterwards, open to the DABL website, select the ledger you want to deploy to, go to the "DAML" selection and upload the DAR `daml-ui-template.dar` you have just created.

To upload the UI, create a ZIP file containing all your UI assets. First build all projects:

```bash
daml build
daml codegen js -o daml2ts .daml/dist/daml-ui-template-0.0.1.dar
```

Then, zip either the Javascript build output:

```bash
    cd ui-js
    yarn install
    yarn build
    zip -r ../daml-ui-template.zip build
```

Or the Typescript build output:

```bash
    cd ui-ts
    yarn install
    yarn build
    zip -r ../daml-ui-template.zip build
```

Afterwards, select the "UI Assets" tab of your chosen ledger on the DABL website, upload the ZIP file `daml-ui-template.zip` you have just created and publish it.

To see your deployed instance of create-daml-app in action, follow the "Visit site" link at the top right corner of your "UI Assets" page.
