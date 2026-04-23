---
sidebar_label: 'Operation'
title: Asysco AMT job definitions
description: "Reference for defining Asysco AMT jobs in OpCon, including job parameters, completion codes, and job log output."
tags:
  - Reference
  - Automation Engineer
  - Jobs
---

# Asysco AMT job definitions

**Theme:** Configure  
**Who Is It For?** Automation Engineer

Within OpCon, job definitions are created using the Asysco AMT job subtype. The subtype is installed into the Enterprise Manager `dropins` directory during installation and is visible when a Windows job type is selected. The job subtype consists of an upper and a lower portion — the upper portion defines the connector location, the Windows user the connector runs under, and the job type.

- Use this reference when creating or modifying AMT job definitions or when diagnosing a failed AMT job using completion codes
- AMT completion codes map directly to OpCon exit codes, giving standard OpCon dependency and event logic full control over AMT job outcomes
- Job output is automatically attached to the OpCon job log when a job completes, eliminating manual log collection from the AMT environment

## How to implement it

### Prerequisites

The Asysco AMT Connector must be installed and configured, and the Asysco AMT job subtype must be installed in Enterprise Manager. See [Installation](./installation.md).

### Steps

To create an Asysco AMT job definition, complete the following steps:

1. Go to the **Administration** menu and select **Job Master**.
2. Select the schedule.
3. Select the **Add** button.
4. In the **Job Type** list, select **Windows**.
5. In the **Job Sub-Type** list, select **Asysco AMT**. The Asysco AMT job definition panel is displayed.
6. In the **User Id** field, enter the Windows user account under which the connector runs.
7. In the **Connector Path** field, enter the path to the connector installation or the global property (for example, `[[AMTPath]]`).
8. In the **Job Type** field, select **Start** from the list.
9. Select the **Start** tab.
10. In the **Application Name** field, enter the AMT application name or the global token `[[AMT_APPLICATION]]`.
11. In the **Job Name** field, enter the name of the AMT job to run.
12. Configure any optional fields as needed.
13. Select the **Save** button. The job definition is saved.

### Example

A job that runs the `RUN_PARAMETERTESTA` job in the `DEMO2` AMT application uses these settings on the Start tab:

| Field | Value |
|---|---|
| **Application Name** | `DEMO2` |
| **Job Name** | `RUN_PARAMETERTESTA` |
| **Script Parameters** | `'PARAM'` |

## Configuration options

### General information

| Setting | What It Does | Default | Notes |
|---|---|---|---|
| **User Id** | Windows user account under which the connector runs | — | This user is unrelated to the Asysco LION environment |
| **Connector Path** | Full path to the connector installation directory | `[[AMTPath]]` | Use a global property; define an additional property when multiple connectors are installed on the same system |
| **Job Type** | The type of job action to perform | — | Currently only **Start** is supported |

### Start tab

| Setting | What It Does | Default | Notes |
|---|---|---|---|
| **Application Name** | The AMT application name | — | Suggest using global token `[[AMT_APPLICATION]]` for environments with a single application |
| **Job Name** | The name of the AMT job to run | — | Must be unique in combination with Application Name within the AMT environment |
| **File Name** | Absolute path or UNC path of a PowerShell script to run | — | Optional; when present, overrides the stored job definition |
| **User** | AMT user under which the task runs within the AMT environment (RunAs) | Application default | Optional; if not specified, the application's default user is used |
| **Task Value** | Values to modify, override, or elaborate existing task attributes | — | Optional |
| **Script Parameters** | Parameters to pass to the task | — | Optional; enter each parameter on a separate line |

## Exception handling

The AMT Connector returns the actual completion code of the job from the AMT environment. A successful run returns exit code 4. The following table covers common failure scenarios.

| Symptom | Meaning | Fix |
|---|---|---|
| Exit code 24 (AUTHENTICATION_ERROR) | The AMT user credentials in `Connector.config` are invalid | Verify USER and PASSWORD values are correct and properly encrypted using `Encrypt.exe` |
| Exit code 99 (INVALID AMT USER) | The RunAs user specified in the **User** field does not exist in the AMT environment | Verify the user exists in AMT Control Center and enter the correct value in the job definition |
| Exit code 11 (ERROR) with message "File not found" | The path specified in the **File Name** field does not exist | Verify the **File Name** path, or leave the field blank to run the stored AMT job definition |
| Exit code 12 (ABORTED) | The job was intentionally stopped within the AMT business logic | Review the AMT job log via JORS for the reason the job was aborted |

### Completion codes reference

```
Completion Codes

0	IDLE                   Job is idle.
1	QUEUED                 Job is queued for future start in current timeframe.
2	RUNNING                Job was started manually or by the scheduler.
3	KILLED                 Job was terminated by a 'kill' command.
4	DONE                   Job completed normally.
5	SUSPENDED              Queued job has not started on time.
6	SKIPPED_BY_OPS         Suspended Job has been skipped by control center.
7	RUN_MANUAL             Job was started by control center.
8	RUN_FORCED             Forced start manual, start this job even when job server halted.
9	RUN_DEBUG              When a report is started from Visual Studio.
10	DEL_QUEUE              Job is deleted from queue.
11	ERROR                  Job Ended in Error. When executing a script and the script does not exist, an error code of 11 will be returned with a description of 'File not found'.
12	ABORTED                The Job was aborted on purpose in the business-logic.
13	WAIT FOR FILE          Waiting for a file.
14	WAIT FOR INPUT REQUEST Waiting for Request.
15	WAIT FOR JOB           Waiting for another job to finish.
16	WAIT FOR REPORT        Waiting for a report to finish, for future use.
18	RECOVER_CP             This job (report) is a request to recover from a saved critical point.
19	UNDEFINED              State is undefined.
20	WAIT_FOR QUEUE         Waiting for queue start time.
21	WAIT_FOR_DEBUGGER      Waiting for a LION Debugger to start debug session for the job.
22	ABORTED_WITH_RECOVER   Aborted with recover.
23	WEB_SERVER_ERROR
24	AUTHENTICATION_ERROR
99	INVALID AMT USER       When executing an AMT script with a named AMT user and the user is invalid.

```

## Administration

**Enabling and disabling jobs:** Individual OpCon jobs targeting the AMT environment can be enabled or disabled using standard OpCon job management in Enterprise Manager or Solution Manager.

**Roles:** Automation Engineers create and manage AMT job definitions. System Administrators manage the connector installation and credentials.

**Maintenance:** When the AMT application name changes, update the `[[AMT_APPLICATION]]` global property in OpCon to apply the change to all job definitions that reference the token.

## Security considerations

**Authentication:** The connector uses the AMT credentials configured in `Connector.config`. See [Installation](./installation.md) for credential management.

**Authorization:** The AMT user defined in `Connector.config` must have appropriate privileges in AMT Control Center. The optional **User** (RunAs) field on the job definition must also reference a user defined in AMT.

**Data security:** Job parameters are transmitted to the AMT environment through the web services interface. Communication is encrypted using TLS when `SERVER_USES_TLS=True` in `Connector.config`.

**Sensitive data:** The **User** (RunAs) field references AMT user accounts. Do not use privileged AMT accounts unless required by the specific job.

## Operations

**Monitoring:** After each job run, the connector retrieves the AMT job log from the AMT database and attaches it to the OpCon job log. Review the full job output through the JORS system in Enterprise Manager.

**Alerts:** Set each job's failure criteria in OpCon to accept only exit code 4 (DONE) as success. All other completion codes indicate a non-successful state and should trigger failure handling or notifications.

**Performance and scaling:** The `STATUS_CHECK_POLL_INTERVAL` and `STATUS_CHECK_INITIAL_POLL_DELAY` settings in `Connector.config` control how frequently the connector polls the AMT web server. Increase these values for long-running jobs to reduce unnecessary polling.

## FAQs

**What exit code indicates a successful AMT job?**  
Exit code 4 (DONE) is the only code that indicates the job completed normally. Configure OpCon failure criteria to treat all other exit codes as failures.

**Can I use the same connector for jobs that target different AMT applications?**  
Yes. The **Application Name** field on each job definition specifies the target application. Using the global token `[[AMT_APPLICATION]]` simplifies management when most jobs share the same application.

**How do I view AMT job output after the job completes?**  
The connector automatically retrieves AMT job log messages and attaches them to the OpCon job log. View the output through the JORS system in Enterprise Manager.

## Examples

**Scenario:** A job named `RUN_PARAMETERTESTA` in application `DEMO2` is submitted with the parameter `'PARAM'` and completes successfully.

The following job log shows a complete run. The connector submitted the job, polled for status, received exit code 4 (DONE) from the AMT environment, and attached the full job output to the OpCon job log.

```
5/18/2017 14:00:10:879 MSLSAM File Version 16.1.0.82 (Assembly version 16.1.0, Product Version 16.1.0.1195), PID : 1824
5/18/2017 14:00:10:879 The Job Parameters are ...
5/18/2017 14:00:10:879 JobName : TESTRUNPARAM     0000000194
5/18/2017 14:00:10:879 JobStartImage : C:\connectors\asysco.amt\amt.exe
5/18/2017 14:00:10:879 JobArguments :  -jt "START" -an "DEMO2" -jn "RUN_PARAMETERTESTA" -pa "'PARAM'"
5/18/2017 14:00:10:879 WorkingDirectory : C:\connectors\asysco.amt\
5/18/2017 14:00:10:879 Job User : Use Service Account
5/18/2017 14:00:11:191 C:\connectors\asysco.amt\amt.exe , File Version : , Product Version : , FileSize : 50176, File Modification Time : 12/30/2016 8:12:40 AM
5/18/2017 14:00:11:191 Job Environment : 
COMPUTERNAME=AMTOPCON-TST-S1
SMA_MSLSAM_ROOT_DIRECTORY=C:\Program Files\OpConxps\MSLSAM
PUBLIC=C:\Users\Public
LOCALAPPDATA=C:\Windows\system32\config\systemprofile\AppData\Local
PSModulePath=C:\Windows\system32\WindowsPowerShell\v1.0\Modules\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\PowerShell\Modules\
PROCESSOR_ARCHITECTURE=AMD64
Path=C:\ProgramData\Oracle\Java\javapath;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Program Files\Microsoft SQL Server\120\DTS\Binn\;C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\110\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\Binn\;C:\Program Files\Microsoft SQL Server\120\Tools\Binn\;C:\Program Files (x86)\Microsoft SQL Server\120\Tools\Binn\ManagementStudio\;C:\Program Files (x86)\Microsoft SQL Server\120\DTS\Binn\;
CommonProgramFiles(x86)=C:\Program Files (x86)\Common Files
ProgramFiles(x86)=C:\Program Files (x86)
PROCESSOR_LEVEL=6
ProgramFiles=C:\Program Files
PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
USERPROFILE=C:\Windows\system32\config\systemprofile
SMA_MSLSAM_DATA_DIRECTORY=C:\ProgramData\OpConxps\MSLSAM
ALLUSERSPROFILE=C:\ProgramData
SMA_MSLSAM_ECOF_DIRECTORY=
FP_NO_HOST_CHECK=NO
ProgramData=C:\ProgramData
PROCESSOR_REVISION=3f02
USERNAME=AMTOPCON-TST-S1$
CommonProgramW6432=C:\Program Files\Common Files
SystemRoot=C:\Windows
CommonProgramFiles=C:\Program Files\Common Files
OS=Windows_NT
PROCESSOR_IDENTIFIER=Intel64 Family 6 Model 63 Stepping 2, GenuineIntel
ComSpec=C:\Windows\system32\cmd.exe
SystemDrive=C:
TEMP=C:\Windows\TEMP
NUMBER_OF_PROCESSORS=2
APPDATA=C:\Windows\system32\config\systemprofile\AppData\Roaming
TMP=C:\Windows\TEMP
ProgramW6432=C:\Program Files
windir=C:\Windows
USERDOMAIN=WORKGROUP
SMA_MSLSAM_SAM_JOB_ID=TESTRUNPARAM     0000000194
SMA_MSLSAM_JOB_NAME=TEST_RUN_PARAMETERTESTA 0000000194
SMA_MSLSAM_SCHEDULE_DATE=20170518
SMA_MSLSAM_SCHEDULE_NAME=AMT_TEST
SMA_MSLSAM_RESTART_STEP=
SMA_MSLSAM_SCHEDULE_FREQ=ALLDAYS
SMA_MSLSAM_ROOT_DIRECTORY=C:\Program Files\OpConxps\MSLSAM
SMA_MSLSAM_DATA_DIRECTORY=C:\ProgramData\OpConxps\MSLSAM
SMA_MSLSAM_ECOF_DIRECTORY=
SMA_MSLSAM_LSAM_NAME=AMTOPCON-TST-S1
SMA_MSLSAM_JOBOUTPUT_FILENAME=C:\ProgramData\OpConxps\MSLSAM\JobOutput\Archives\2017_05_18 (Thursday)\TESTRUNPARAM_0000000194.log
SMA_MSLSAM_PRERUN_ACTIVE=FALSE

5/18/2017 14:00:11:191 Job Start Time : 140011
5/18/2017 14:00:11:191 Job Process Name : amt
5/18/2017 14:00:11:191 Job Process Id : 10080
5/18/2017 14:00:11:191 Getting Job Termination Status for Job TESTRUNPARAM     0000000194
5/18/2017 14:01:35:892 Job terminated with Exit Code : 0
5/18/2017 14:01:35:892 Job finished at : 140135
5/18/2017 14:01:40:899 Job Standard Out/Error : 
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -----------------------------------------------------------------------
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : SMA AMT Connector       : 16.01.06
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -jt (job type)          : START
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -an (application Name)  : DEMO2
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -jn (job name)          : RUN_PARAMETERTESTA
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -fn (file name)         : null
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -pa (Parameters)        : 'PARAM'
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -u  (user)              : default
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -tv (task value)        : null
14:00:14.239 [main] [AMTConnector] 20170518 14:00:14 : -----------------------------------------------------------------------
14:00:14.787 [main] [AMTJobExecutorImpl] 20170518 14:00:14 : Authentication successful
14:00:14.787 [main] [AMTJobExecutorImpl] 20170518 14:00:14 : Job 'RUN_PARAMETERTESTA' START request received
14:00:14.865 [main] [AMTJobExecutorImpl] 20170518 14:00:14 : Job 'RUN_PARAMETERTESTA' started in AMT Environment : BatchrequestId '2112'
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Job log ---------------------------------------------------------
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : Script Started: RUN_PARAMETERTEST
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 :  Amt PS library version: 0.49
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 :  date: 2016-10-17
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : Starting parametertest with RepParam set
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : Starting report: PARAMETERTEST
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Started Rev: 1.1 AMT: 8.0.16351.50. Params: /R:2103 /USEWORKINGDIR
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is started
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Value test param ['PARAM']
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 0 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 10 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 20 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 30 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 40 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 50 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is running 60 seconds
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Parameter test is ended
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Report execution time: 00:01:10:249
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : Done
14:01:35.704 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : Opening joblog succeeded
14:01:35.720 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : 0
14:01:35.720 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : Finished running parametertest
14:01:35.720 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : DEMO2 RUN_PARAMETERTEST : Job finished
14:01:35.720 [main] [AMTJobExecutorImpl] 20170518 14:01:35 : End Job log -----------------------------------------------------
14:01:35.736 [main] [AMTConnector] 20170518 14:01:35 : -----------------------------------------------------------------------
14:01:35.736 [main] [AMTConnector] 20170518 14:01:35 : Connector completed with return code 4
14:01:35.736 [main] [AMTConnector] 20170518 14:01:35 : -----------------------------------------------------------------------

```

The final line `Connector completed with return code 4` confirms exit code 4 (DONE) — the expected successful outcome.

## Glossary

**BatchrequestId** — The identifier assigned to a job when it is submitted to the AMT batch queue. Visible in the job log output.

**Completion code** — The exit code returned by the AMT environment when a job finishes, indicating the job's final state. Exit code 4 (DONE) is the only successful completion state.

**JORS** — Job Output Retrieval System; the OpCon service that stores and serves job log output. AMT job logs are attached to OpCon job logs and are available through JORS.

**RunAs** — The optional **User** field in the job definition that specifies the AMT user under which the task runs within the AMT environment.
