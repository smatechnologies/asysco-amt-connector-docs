---
sidebar_label: 'Installation'
title: Installation
description: "Install and configure the Asysco AMT Connector, including the Enterprise Manager job subtype and connection settings required to communicate with the Asysco AMT environment."
tags:
  - Procedural
  - System Administrator
  - Installation
---

# Installation

**Theme:** Configure  
**Who Is It For?** System Administrator

The Asysco AMT Connector installation consists of multiple steps that are required to complete the installation successfully. The connector requires an OpCon Windows Agent and communicates with the Asysco AMT Batch environment through a RESTful web services interface. A separate connector should be installed for each Asysco AMT environment.

- Use this guide when installing the connector for the first time or when adding an instance for a new or separate AMT environment
- A separate connector instance per AMT environment keeps each environment's configuration isolated, reducing the risk of cross-environment job submissions
- Encrypting AMT credentials with `Encrypt.exe` prevents plain-text authentication values from being stored in `Connector.config`

## How to implement it

### Prerequisites

The following software levels are required before beginning the installation.

- OpCon release 17.0 or higher
- Embedded Java OpenJDK 11 (part of installation — no separate install required)
- The Asysco AMT environment must support the required web services (AmtOpConService)
- The user code required to connect to the web services must be defined within AMT Control Center

### Installation steps

To install the connector, complete the following steps:

1. Copy the downloaded install file `AsyscoAmtConnector-win.zip` to a temp directory (for example, `c:\temp`).
2. Extract the contents, including sub-directories, into the required directory.

After installation, the root directory contains the connector executable, the encryption software module, the `Connector.config` file, a `java` directory containing the required Java environment, and an `emplugins` directory containing the job subtype.

To install the job subtype, complete the following steps:

1. Copy the Enterprise Manager plug-in from the installation `emplugins` directory to the `dropins` directory of the Enterprise Manager installation. If the `dropins` directory does not exist, create it off the root directory.
2. Restart Enterprise Manager. The Asysco AMT Windows job subtype is now visible.

   If the subtype is not visible, restart Enterprise Manager using **Run as Administrator**. After this step, Enterprise Manager can be used normally.

3. Create a global property **AMTPath** that contains the full path of the installation directory.

To configure the connector, complete the following steps:

1. Encrypt the USER and PASSWORD values using `Encrypt.exe`. See [Encrypt utility](#encrypt-utility) below for instructions.
2. Open `Connector.config` in the installation directory and set the values described in the [Configuration options](#configuration-options) section below.

#### Encrypt utility

The Encrypt utility uses standard 64-bit encryption and supports a `-v` argument that displays the encrypted value.

On Windows, the following example encrypts the value `abcdefg`:

```
Encrypt.exe -v abcdefg
```

### Example configuration

The following `Connector.config` shows a complete configuration for a test AMT environment hosted at `amtopcon-tst-a1.westeurope.cloudapp.azure.com` on port 4004 with TLS enabled. The USER and PASSWORD values shown are already encrypted.

```
[CONNECTOR]
NAME=Asysco AMT Connector
STATUS_CHECK_POLL_INTERVAL=5
STATUS_CHECK_INITIAL_POLL_DELAY=5
DEBUG=OFF

[AMT BATCH SERVER]
SERVER_ADDRESS=amtopcon-tst-a1.westeurope.cloudapp.azure.com:4004
SERVER_USE_TLS=True
USER= 62324e685a47303d
PASSWORD= 6233426a6232353463484d3d
```

## Configuration options

The `Connector.config` file contains the following settings.

| Setting | What It Does | Default | Notes |
|---|---|---|---|
| **[CONNECTOR]** | Section header | — | |
| **NAME** | The name of the connector | Asysco AMT Connector | This value should not change |
| **STATUS_CHECK_POLL_INTERVAL** | Time in seconds between status checks of a submitted web service request | 5 | |
| **STATUS_CHECK_INITIAL_POLL_DELAY** | Time in seconds to wait before the first status check | 10 | |
| **DEBUG** | Enables verbose debug logging | OFF | Set to `ON` to capture error conditions; use `OFF` in production |
| **[AMT_BATCH_SERVER]** | Section header | — | |
| **SERVER_ADDRESS** | Address and port number of the Asysco AMT web server | — | Example: `hostname:4004` |
| **SERVER_USES_TLS** | Whether TLS is used for communication between the connector and the AMT web server | True | Values are `True` or `False` |
| **USER** | The AMT user with privileges to interact with the AMT Batch environment via web services | — | Must be encrypted using `Encrypt.exe`; user must be defined in AMT Control Center |
| **PASSWORD** | The password of the AMT user | — | Must be encrypted using `Encrypt.exe` |

## Exception handling

| Symptom | Meaning | Fix |
|---|---|---|
| The Asysco AMT Windows job subtype is not visible in Enterprise Manager after restart | Enterprise Manager was not restarted with administrator privileges | Restart Enterprise Manager using **Run as Administrator** |
| The connector fails to connect to the AMT web server | The `SERVER_ADDRESS` value is incorrect, or `SERVER_USES_TLS` does not match the AMT server configuration | Verify `SERVER_ADDRESS` and `SERVER_USES_TLS` in `Connector.config` |
| Jobs fail with authentication errors (exit code 24) | The `USER` or `PASSWORD` value in `Connector.config` is incorrect or was not encrypted | Re-encrypt the credentials using `Encrypt.exe` and update `Connector.config` |

## Administration

**Enabling and disabling debug mode:** Set `DEBUG=ON` in `Connector.config` to enable verbose logging for troubleshooting. Set `DEBUG=OFF` for production use.

**Roles:** System Administrators are responsible for installing and configuring the connector, managing the `Connector.config` file, and maintaining the **AMTPath** global property.

**Maintenance:** When AMT credentials change, re-encrypt the new USER and PASSWORD values using `Encrypt.exe` and update `Connector.config`. Update the **AMTPath** global property if the connector installation directory changes.

## Security considerations

**Authentication:** The connector authenticates to the Asysco AMT web services using a USER and PASSWORD defined in `Connector.config`. Both values must be defined in AMT Control Center before the connector can authenticate.

**Authorization:** The AMT user must have the required privileges to interact with the AMT Batch environment via the web services interface. Permissions are managed in AMT Control Center.

**Data security:** Communication between the connector and the AMT web server is encrypted when `SERVER_USES_TLS=True` in `Connector.config`.

**Sensitive data:** The USER and PASSWORD values are credentials. Do not store plain-text values in `Connector.config`. Always encrypt them using `Encrypt.exe` before saving.

## Operations

**Monitoring:** The connector writes a log entry for each job submitted to the AMT environment. Job output is retrieved from the AMT database when the job completes and is accessible through the JORS system in OpCon.

**Alerts:** Configure OpCon job failure criteria to treat exit code 4 (DONE) as success. All other AMT completion codes indicate non-successful states. See [Asysco AMT job definitions](./operation.md) for the complete list of completion codes.

**Performance and scaling:** Deploy one connector instance per AMT environment. Adjust `STATUS_CHECK_POLL_INTERVAL` and `STATUS_CHECK_INITIAL_POLL_DELAY` to tune how frequently the connector polls the AMT web server for job status.

## FAQs

**Can I install a single connector to manage multiple AMT environments?**  
No. A separate connector must be installed for each Asysco AMT environment. Create a unique global property for each installation path.

**What Java version does the connector require?**  
The connector bundles embedded Java OpenJDK 11 as part of the installation. No separate Java installation is required on the host server.

**How do I update the AMT credentials after the initial installation?**  
Re-encrypt the new values using `Encrypt.exe` and replace the USER and PASSWORD entries in `Connector.config`.

## Examples

**Scenario:** Deploying the connector for a test AMT environment with TLS enabled.

1. Install the connector to `C:\connectors\asysco.amt\`.
2. Create the **AMTPath** global property with the value `C:\connectors\asysco.amt\`.
3. Encrypt the AMT user credentials using `Encrypt.exe`.
4. Set `SERVER_ADDRESS` to the AMT web server address and port.
5. Set `SERVER_USES_TLS=True`.
6. Set `DEBUG=OFF`.

The connector is now ready to accept job submissions from OpCon. Verify by running a test job in OpCon and confirming the job log appears via JORS.

## Glossary

**AMTOpCon interface** — The RESTful web services API that allows OpCon to communicate directly with the Asysco AMT database for job submission, status monitoring, and log retrieval.

**AMTPath** — The OpCon global property that stores the full path to the connector installation directory, referenced by job definitions in the **Connector Path** field.

**Connector.config** — The configuration file in the connector installation directory that stores connection settings and encrypted credentials for the Asysco AMT environment.

**Encrypt.exe** — The command-line utility bundled with the connector, used to encrypt credential values using 64-bit encryption before storing them in `Connector.config`.
