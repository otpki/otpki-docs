---
title: Getting Started
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 2
---

Get OTPKI running locally using Docker Compose in under 10 minutes.

## Prerequisites

- Docker 24.0 or later
- Docker Compose v2.0 or later

## Step 1: Request registry credentials.

Contact us via our [online interest form](https://omnitrust.com/contact-us/) or ask your OmniTrust sales representative to request credentials to the official OmniTrust container registry.  They will provide you with access to the demo Docker
Compose resources as well.

```bash
docker login hub.omnitrustregistry.com
Username: XXXXXXXX
Password: YYYYYYYY
Login Succeeded
```

## Step 2: Configure Development Environment

Copy the example environment (`compose/dev.env`) file and edit as needed.

### Key variables

| Variable | Default | Description |
|---|---|---|
| APP_NAME | pki | Name of app, prefix for primary domain |
| APP_DOMAIN | $APP_NAME.localhost | Primary domain |
| KC_BOOTSTRAP_ADMIN_USERNAME | admin | Keycloak admin username |
| KC_BOOTSTRAP_ADMIN_PASSWORD | admin | Keycloak admin password |
| POSTGRES_PASSWORD | postgres | PostgreSQL password |

:::warning
Change default credentials to match your desired test environment.
:::

## Step 3: Start Full Stack

Using the provided compose.yml file, required third-party yaml files, and customized environment file, run 
the compose environment with the following command:

```bash
docker compose --env-file ./compose/dev.env --profile prod up -d;
```

When running in docker, all requests should route through `https://pki.localhost` and other proxied hostnames below.
This compose environment runs and initializes a stack that includes OTPKI running as a monolith container, leveraging
a PostgreSQL database, a Traefik ingress server, an OpenTelemetry observability stack, and a local Keycloak IAM service.

## Step 4: Access the Web UI

- **OTPKI Web UI**: https://pki.localhost
- **Keycloak Admin**: https://pki.localhost/kc

For the Keycloak Admin, unless modified in the dev.env file, the default admin login credentials are `admin`:`admin`.  
This is a one-time-use temporrary password and you will be prompted to change it upon first login.

For the OTPKI Web UI, unless modified in the provided realm.json file, the default admin login credentials are `admin@otpki.local`:`password`.  This is a one-time-use temporrary password and you will be prompted to change it upon first login.

