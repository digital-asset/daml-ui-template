# DAML App Template

## Overview

This repository contains a simple UI template for a DAML application. It provides ledger connectivity and shows how to create simple reports from contracts. The template is based on [create-react-app](https://github.com/facebook/create-react-app) and the [Material UI](https://material-ui.com/) framework.

## Prerequisites

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* [DAML SDK](https://docs.daml.com/getting-started/installation.html)

## Running the app

1. Start the sandbox ledger
```
daml start
```

Wait until the ledger has started up.

2. In a new shell, start the UI
```
cd ui
yarn install --force --frozen-lockfile
yarn start
```

This opens a browser page pointing to `http://localhost:3000/#/login`. Note that the development server serves content via http and should not be exposed as is to a public-facing network.

If you change the Daml code you need to rerun all of the steps above in order for the changes to propagate properly into the UI code.

Note that in order to support login with party aliases (like "Alice") we output a `[(Text, Party)]` mapping from the init script. This output file (`ui/parties.json`) is used to map party aliases to party ids.
For this to work the ledger has to have completed the init script before starting up the UI server. This is of course only a convenience practice and should not be used in production.

## Exploring the application

- Login as `Alice` (case sensitive), leaving the password blank.

- You are now redirected to `http://localhost:3000/#/app/report` where you see a table with all `Asset` contracts listed.

- Two choice buttons are displayed for each contract: the `Give` choice is enabled if the logged-in party is the `owner` of an asset. The `Appraise` button is enabled if the logged-in user is the `issuer` of the asset.

- Both choices will open a dialog to enter the required parameters. The dialog currently supports `text`, `number`, `date`, and `selection` input types.

The `Report` page is meant as an example, which you can copy and modify to your needs.
