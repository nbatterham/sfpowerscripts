import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import TriggerApexTestImpl from "./TriggerApexTestImpl";
import { AppInsights } from "../Common/AppInsights";

async function run() {
  try {
    
    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled",true));
    const target_org: string = tl.getInput("target_org", true);
    let test_options = {};

    test_options["wait_time"] = tl.getInput("wait_time", true);

    test_options["testlevel"] = tl.getInput("testlevel", true);

    if (test_options["testlevel"] == "RunSpecifiedTests")
    test_options["specified_tests"] = tl.getInput("specified_tests", true);
    if (test_options["testlevel"] == "RunApexTestSuite")
    test_options["apextestsuite"] = tl.getInput("apextestsuite", true);

    let triggerApexTestImpl:TriggerApexTestImpl = new TriggerApexTestImpl(target_org,test_options);
    console.log("Generating command");
    let command = await triggerApexTestImpl.buildExecCommand();
    tl.debug(command);
 
    await triggerApexTestImpl.exec(command);

    AppInsights.trackTask("sfpwowerscript-triggerapextest-task");
    AppInsights.trackTaskEvent("sfpwowerscript-triggerapextest-task","apex_test_triggered");    

  } catch (err) {
    AppInsights.trackExcepiton("sfpwowerscript-triggerapextest-task",err);    
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
