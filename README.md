# DAML App Template

## Overview

This repository contains a simple UI template for a DAML application. It provides ledger connectivity and shows how to create simple reports from contracts. The template is based on [create-react-app](https://github.com/facebook/create-react-app) and the [Material UI](https://material-ui.com/) framework.

## Prerequisites

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* [DAML SDK](https://docs.daml.com/getting-started/installation.html)

## Building and running locally

1. Build the DAML models and the UI project
```
make build
```

2. Start the sandbox ledger
```
daml start

(Note that in this usecase, the script will populate the ledger with 1024 dummy People contracts, which takes around 30 seconds.)
```

3. In a new shell, start the UI
```
cd ui
yarn start
```

This opens a browser page pointing to `http://localhost:3000/#/login`. Note that the development server serves content via http and should not be exposed as is to a public-facing network.

Note that if you change your DAML models you need to run a full rebuild for the changes to propagate to your UI code:
```
make build
```

## Exploring the application

- Login as `Administrator` (case sensitive), leaving the password blank.

- You are now redirected to `http://localhost:3000/#/app/report` where you see a table with all `Person` contracts listed.

- Two filter inputs are provided, and the results can be paged, according to the `Page Size` input.

## Deploying to production

Deploying `daml-ui-template` to the hosted DAML platform [project:DABL](http://projectdabl.com/) is straight forward:

1. Build the deployment artifacts:

```bash
make deploy
```

2. Log into your DABL account and create a new project and ledger.

3. Select the ledger, click on `Update .dar` in the DAML section of the app artifacts, and upload `deploy/daml-ui-template-0.0.1.dar`.

4. Select `Upload .zip` in the UI Assets section, and upload `deploy/daml-ui-template.zip`.

5. Publish the deployed UI artifact from the App UI section of the page.

6. Follow the `View Site` link in the App UI section to open your fully deployed application.
