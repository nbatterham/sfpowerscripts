import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import DeploySourceToOrgImpl from "./DeploySourceToOrgImpl";
import { AppInsights } from "../Common/AppInsights";

async function run() {
  try {
    console.log("SFPowerScript.. Deploy Source to Org");

    const target_org: string = tl.getInput("target_org", true);
    const project_directory: string = tl.getInput("project_directory", false);
    const source_directory: string = tl.getInput("source_directory", true);

    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled",true));


    let deploySourceToOrgImpl: DeploySourceToOrgImpl;
    let mdapi_options = {};

    mdapi_options["wait_time"] = tl.getInput("wait_time", true);
    mdapi_options["checkonly"] = tl.getBoolInput("checkonly", true);
    

    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled",true));
    
   if(mdapi_options["checkonly"])
   mdapi_options["validation_ignore"]=tl.getInput("validation_ignore",false);

    mdapi_options["testlevel"] = tl.getInput("testlevel", true);

    if (mdapi_options["testlevel"] == "RunSpecifiedTests")
      mdapi_options["specified_tests"] = tl.getInput("specified_tests", true);
    if (mdapi_options["testlevel"] == "RunApexTestSuite")
      mdapi_options["apextestsuite"] = tl.getInput("apextestsuite", true);

    
   
   
      deploySourceToOrgImpl = new DeploySourceToOrgImpl(
      target_org,
      project_directory,
      source_directory,
      mdapi_options
    );
    await deploySourceToOrgImpl.exec();

    AppInsights.trackTask("sfpowerscript-deploysourcetoorg-task");
    AppInsights.trackTaskEvent("sfpowerscript-deploysourcetoorg-task","source_deployed");    


  } catch (err) {
    AppInsights.trackExcepiton("sfpowerscript-deploysourcetoorg-task",err);
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
