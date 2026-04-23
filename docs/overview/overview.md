---
sidebar_label: 'Overview'
title: Asysco AMT Connector overview
description: "Understand how the Asysco AMT Connector integrates OpCon with the Asysco LION environment to schedule and monitor AMT batch jobs through a RESTful web services interface."
tags:
  - Conceptual
  - System Administrator
  - Automation Engineer
  - Getting Started
---

# Asysco AMT Connector overview

**Theme:** Overview  
**Who Is It For?** System Administrator, Automation Engineer

The Asysco AMT Connector integrates OpCon with the Asysco LION environment, allowing OpCon to manage the scheduling of AMT batch jobs through a RESTful web services interface. The connector communicates with the AMTOpCon interface jointly developed by SMA and Asysco, inserting job definitions into the AMT database and monitoring job status until completion.

- Schedule and monitor Asysco AMT batch jobs from OpCon without managing the AMT internal scheduler separately
- Retrieve AMT job output automatically through JORS, keeping job logs available alongside all other OpCon job history
- Apply standard OpCon job dependencies, events, and frequencies to AMT batch jobs, treating them the same as any other OpCon job type

## How the connector works

The Asysco LION environment includes a basic scheduler that drives batch runs from within the Asysco environment. The SMA OpCon Asysco AMT Connector provides a tight connection between the OpCon environment and the Asysco LION environment, allowing OpCon to manage batch job scheduling.

The implementation includes a connector that communicates with the AMTOpCon interface — a RESTful web services implementation jointly designed and developed by SMA and Asysco — allowing OpCon to communicate directly with the AMT database.

All job definitions are stored in the AMT environment and run by the AMT Batch Scheduler. OpCon schedules predefined jobs by inserting job execution definitions into the database and adding an entry to the AMT Batch Scheduler queue. The connector then monitors the job's status. When the job completes, the connector retrieves the job log and makes it available via JORS.

## AMTOpCon interface

The AMTOpCon interface is a RESTful web services implementation that provides the functions allowing OpCon to interact directly with the AMT Batch environment. The interface includes the following functions:

- **OpConJobAction** — Function to start, stop, or kill an AMT Batch task. During start, parameters and task values defined in OpCon can be passed to the AMT environment.
- **MonitorJob** — Function to monitor the status of a submitted job.
- **GetMessages** — Function to retrieve messages associated with the job. As a job runs, messages are written to the AMT database. When the job completes, the messages are retrieved and added to the OpCon job log, making them available via JORS.

## How to implement it

### Prerequisites

An OpCon Windows Agent must be running on a Windows server that can reach the AMT web server.

### Steps

To deploy the connector, complete the following steps:

1. Install the Asysco AMT Connector on the Windows server. See [Installation](../installation.md).
2. Install the Asysco AMT job subtype in Enterprise Manager. See [Installation](../installation.md).
3. Configure `Connector.config` with the AMT web server address and encrypted credentials. See [Installation](../installation.md).
4. Create AMT job definitions in Enterprise Manager. See [Asysco AMT job definitions](../operation.md).

### Example

Refer to [Installation](../installation.md) for a complete `Connector.config` example, including an encrypted credential configuration for a TLS-enabled AMT environment.

## Configuration options

The connector is configured using the `Connector.config` file in the installation directory. The following table lists the key settings. See [Installation](../installation.md) for the complete list of settings, defaults, and notes.

| Setting | What It Does | Default | Notes |
|---|---|---|---|
| **SERVER_ADDRESS** | Address and port number of the AMT web server | — | Required; example: `hostname:4004` |
| **SERVER_USES_TLS** | Whether communication uses TLS encryption | True | Values are `True` or `False` |
| **STATUS_CHECK_POLL_INTERVAL** | Seconds between status checks of a submitted job | 5 | Increase for long-running jobs to reduce unnecessary polling |

## Exception handling

| Symptom | Meaning | Fix |
|---|---|---|
| OpCon cannot submit jobs to the AMT environment | The connector cannot reach the AMT web server | Verify `SERVER_ADDRESS` in `Connector.config` and confirm network connectivity to the AMT web server |
| AMT job output does not appear in OpCon after a job completes | The GetMessages function cannot retrieve messages from the AMT database | Verify the AMT user has permissions to retrieve messages; check the connector log for errors |

## Administration

**Enabling and disabling the connector:** The connector operates as a component of the OpCon Windows Agent. Modify `Connector.config` to update connection settings. Deploy a separate connector instance for each AMT environment.

**Roles:** System Administrators install and configure the connector. Automation Engineers create and manage AMT job definitions in Enterprise Manager.

**Maintenance:** Maintain each connector instance independently. When AMT credentials change, re-encrypt and update `Connector.config`. See [Installation](../installation.md).

## Security considerations

**Authentication:** The connector authenticates to AMT web services using an encrypted USER and PASSWORD defined in `Connector.config`. Both must be defined in AMT Control Center.

**Authorization:** The AMT user must have the required privileges in AMT Control Center to submit jobs, monitor status, and retrieve messages.

**Data security:** Communication between the connector and the AMT web server is encrypted using TLS when `SERVER_USES_TLS=True` in `Connector.config`.

**Sensitive data:** USER and PASSWORD are credentials that must be encrypted using `Encrypt.exe` before storing in `Connector.config`. Do not store plain-text credential values.

## Operations

**Monitoring:** The connector writes a log entry for each job and retrieves AMT job output when the job completes. Output is accessible through the JORS system in OpCon.

**Alerts:** Configure OpCon job failure criteria to treat exit code 4 (DONE) as success. All other AMT completion codes indicate non-successful states. See [Asysco AMT job definitions](../operation.md) for the complete list.

**Performance and scaling:** Deploy one connector instance per AMT environment. Tune `STATUS_CHECK_POLL_INTERVAL` and `STATUS_CHECK_INITIAL_POLL_DELAY` in `Connector.config` to balance polling frequency against AMT web server load.

## FAQs

**Can OpCon trigger AMT jobs independently of the AMT internal scheduler?**  
Yes. OpCon inserts job execution definitions directly into the AMT database and adds them to the AMT Batch Scheduler queue. OpCon controls the trigger timing.

**Does the connector maintain a persistent connection to the AMT server?**  
No. The connector communicates with the AMT web server when submitting a job and when polling for status. It does not maintain a persistent connection between requests.

**What happens if the AMT web server is unavailable when a job is triggered?**  
The connector fails to submit the job. Configure OpCon retry logic or failure notifications to handle this scenario.

## Examples

**Scenario:** An OpCon schedule triggers an AMT batch job each weekday at 06:00. The connector submits the job to the AMT Batch Scheduler queue, polls for status at the configured interval, and returns the AMT completion code to OpCon. On exit code 4 (DONE), dependent OpCon jobs proceed. On any other code, an OpCon event notifies the operations team.

## Glossary

**AMTOpCon interface** — The RESTful web services API jointly developed by SMA and Asysco that allows OpCon to communicate directly with the AMT database for job submission, status monitoring, and log retrieval.

**AMT Batch Scheduler** — The scheduling component within the Asysco LION environment that processes submitted jobs and manages the batch queue.

**Completion code** — The exit code returned by the AMT environment when a job finishes, indicating the job's final state. Exit code 4 (DONE) is the only successful completion state.

**JORS** — Job Output Retrieval System; the OpCon service that stores and serves job log output. AMT job logs are automatically attached to OpCon job logs through the connector.

**Related topics:**

- [Installation](../installation.md)
- [Asysco AMT job definitions](../operation.md)
