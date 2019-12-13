
SET INPUT_TARGET_ORG=acn_cidemo
SET INPUT_SOURCE_DIRECTORY=force-di
SET INPUT_WAIT_TIME=60
SET INPUT_CHECKONLY=true
SET INPUT_TESTLEVEL=NoTestRun
SET INPUT_VALIDATION_IGNORE=C:\Projects\force-di\.forceignore







ts-node ..\..\BuildTasks\DeploySourceToOrgTask\DeploySourceToOrg.ts

