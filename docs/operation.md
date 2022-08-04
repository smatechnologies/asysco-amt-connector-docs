# Operation

Within OpCon the job definitions are defined using the Asysco AMT Job-Subtype. The subtype is installed into the Enterprise Manager dropins directory during installation and is visible when a Windows Job Type is selected.
The Job-Subtype consists of an upper and a lower portion with the upper portion defining the location of the connector, the Windows User that the connector will execute under and the job type selected from the drop-down list.

## Asysco AMT Job definitions
The Cegid ORLI Definition, defines various jobs that can be executed within the Cegid ORLI environment using the defined web services. 
These include requestFiles, requestLog, requestStatus, requestTechnicalData and executeRequest job types. 

When defining the Cegid ORLI job, first select a Job Type of Windows and then Cegid ORLI Job Subtype. The Cegid ORLI Definition screen will then appear.

The job definition consists of 2 separate areas, with a general area required by all Cegid Orli jobs and specific information depending on the selected job type (requestFiles, requestLog, requestStatus, requestTechnicalData and executeRequest).
 
### General Information
 
The general area contains the following fields:

Field | Description
--------- | -----------
**User Id**          | The name of the Windows batch user that will be used execute the connector. This user has nothing to do with the Asysco LION environment.
**Connector Path**   | Contains the installed location of the Asysco AMT Connector. This consists of a global property value which contains the root installation directory. Default value is **AMTPath**. If more than one Orli Connectors is installed on the same system, then an additional global property should be defined and the entry in this field updated. 
**Job Type**         | The action to perform can be selected from the drop-down list. Currently only **Start** is supported for the connector. 

### Start Operation Information 
 
The field definitions for a Start job consist of the Application Name, either a Job Name or a File Name, the optional Windows User to execute the job under within the AMT Environment (RunAs), optionally any Task Values to submit to the job and any parameters that the job requires. In the AMT interface two values are set by default by the connector. The user that submitted the task will be set to OPCON (not be confused with the RunAs value and the Queue that the request will be submitted on will be set to BATCH.

The **Start** TAB contains the following fields.

Field | Description
--------- | -----------
**Application Name**   | The AMT Application Name. Most customers have only a single application installed within the AMT Environment. Suggest that this be a global token field [[AMT_APPLICATION]] by default.
**Job Name**           | The name of the job to execute in the AMT environment. The Application Name and the Job Name combination must be a unique value within the AMT Environment. 
**File Name**          | (Optional) Absolute path or UNC definition of a PowerShell script to execute. When present will override the stored job to execute meaning that if the script name has the same name as job definition, the script will be executed and not the definition defined within the AMT Environment.
**User**               | (Optional) Defines the user that the task will execute under within the AMT Environment (also known as RunAs). If not present, task will run under the default user defined for the Application.
**Task Value**         | (Optional) Defines the Task values used to modify, override, or elaborate existing task attributes that apply to the job.
**Script Parameters**  | (Optional) Defines the parameters to be passed to the task. When defining multiple parameters, they should be entered on separate lines.

### Failure Criteria
The AMT Connector returns the actual completion code of the executed task within the AMT Environment. This means that a successful execution will return an error code of 4.

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
11	ERROR                  Job Ended in Error. When executing a script and the script does not exist, an error code of 11 will be returned with a description of ‘File not found’.
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

### Job Log
When a task is executing within the AMT Environment, the job log is written to the database. This includes the information about the task as well as any children of the task. 
When the task completes the connector retrieves the information from the database and adds it to the job log of the OpCon job making it available via the JORS System.

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
