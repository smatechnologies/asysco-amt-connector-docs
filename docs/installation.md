# Installation

The Asysco AMT Connector installation consists of multiple steps that are required to complete the installation successfully. 

The connector requires a SMA OpCon Windows Agent. 
While it is not a requirement as the connection between the Asysco AMT Connector and the Asysco AMT Batch Environment uses web services, it is recommended that an OpCon Windows Agent should be installed on the AMT Batch server.

A separate Asysco AMT Connector should be installed for each Asysco AMT Environment.
 
## Supported Software Levels
The following software levels are required to implement the Asysco AMT Connector.

- OpCon Release 17.0 or higher.
- Embedded Java OpenJDK 11 (part of installation).
- The Asysco AMT Environment must support the required web services (AmtOpConService).
- The user code required to connect to the web services must be defined within AMT Control Center.

## Installation
The installation process consists of the following steps:

- Windows Agent on the AMT Batch Server.
- Asysco AMT Connector Installation.
- Adding Asysco AMT Connector job sub-type to Enterprise Manager.
- Asysco AMT Connector Configuration.
 
### Connector Installation
The Asysco AMT connector can be installed on any Windows Server as long as there is an OpCon MSLSAM Agent installed on that Windows Server.
Copy the downloaded install file AsyscoAmtConnector-win.zip and extract it into a temp directory (c:\temp). Extract the information including sub-directories into the required directory.

After the installation is complete, the installation root directory contains the connector executable, the encryption software module, the Connector.config file, a java directory containing 
the required Java environment and a emplugins directory containing the Job Sub type.

### Job Subtype Installation
Copy the Enterprise Manager plug-in from the installation /emplugins directory to the dropins directory of the Enterprise Manager installation. 
If the dropins directory does not exist, create the dropins directory off the root directory. 

Restart Enterprise Manager and a new Windows job subtype called Asysco AMT will be visible.

If not restart Enterprise Manager using 'Run as Administrator'. After this Enterprise Manager can be used normally.

Create a global property **AMTPath** that contains the full path of the installation directory.

### Connector Configuration
The configuration of the Asysco AMT Connector requires setting the connection values to match the Asysco AMT environment. 
The USER and PASSWORD values must be encrypted using the Encrypt.exe tool provided with the connector.

#### Encrypt Utility
The Encrypt utility uses standard 64 bit encryption.

Supports a -v argument and displays the encrypted value

On Windows, example on how to encrypt the value "abcdefg":

```
Encrypt.exe -v abcdefg

```

#### Configuration
Configure the Connector.config file in the installation directory setting the required information.
The Connector.config contains the following values

Property Name | Value
--------- | -----------
**[CONNECTOR]**                     | header
**NAME**                            | The name of the connector. This value should not change.
**STATUS_CHECK_POLL_INTERVAL**      | The time wait in seconds between checking the status of submitted web service request. Default value is 5.
**STATUS_CHECK_INITIAL_POLL_DELAY** | The time wait in seconds before starting to check the status of submitted web service request. Default value is 10.
**DEBUG**                           | The Connector supports a debug mode which can be enabled by setting the value to ON. The connector should be run with DEBUG disabled (OFF) and enabled (ON) when requested to capture an error condition. Value either ON or OFF (default OFF).
**[AMT_BATCH_SERVER]**              | header
**SERVER_ADDRESS**                  | The address and port number of the Asysco AMT web server.
**SERVER_USES_TLS**                 | Defines if TLS is used on the communications link between the Asysco AMT Connector and the Asysco AMT web server. Values are True or False (default True).
**USER**                            | The AMT user that has the required privileges to interact with the AMT Batch Environment via the web services interface. The value must be encrypted using the Encrypt.exe tool. The user must be defined within AMT Control Center.
**PASSWORD**                        | The password of the AMT user that has the required privileges to interact with the AMT Batch Environment via the web services interface. The value must be encrypted using the Encrypt.exe tool.
 
Example configuration file. 

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

