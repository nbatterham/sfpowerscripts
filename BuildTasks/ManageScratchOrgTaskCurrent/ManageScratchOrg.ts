import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import DeleteScratchOrgImpl from "./DeleteScratchOrgImpl";
import CreateScratchOrgImpl from "./CreateScratchOrgImpl";

import { AppInsights } from "../Common/AppInsights";

async function run() {
  try {
    


    const action:string = tl.getInput("action",true);
    const devhub_alias: string = tl.getInput("devhub_alias", true);
   
    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled",true));

 
    if(action == "Create")
    {
    console.log("SFPowerScript.. Create a scratch org");
    const alias: string = tl.getInput("alias", true);
    const config_file_path: string = tl.getInput("config_file_path", true);
    const working_directory: string = tl.getInput("working_directory", false);


    let createScratchOrg:CreateScratchOrgImpl = new CreateScratchOrgImpl(working_directory,config_file_path,devhub_alias,alias);
    console.log("Generating Create Scratch Org command");
    let createCommand = await createScratchOrg.buildExecCommand();
    tl.debug(createCommand);
   
    let result = await createScratchOrg.exec(createCommand);

    tl.setTaskVariable('sfpowerscripts_scratch_org_username',result.result.username,false);
    
    console.log(
      `Successfully created a scratch org with devhub ${devhub_alias} , The username  is ${result.result.username}`
    );

    //Open up the scratch org to get the URL
    console.log(`Opening up the created scratch org to retrieve URL`)
    result = child_process.execSync(`npx sfdx force:org:open -r --json`, { cwd: working_directory, encoding: "utf8" });
    tl.debug(result);
    let resultAsJSON=JSON.parse(result);
    tl.setTaskVariable('sfpowerscripts_scratch_org_url',resultAsJSON.result.url,false);
    
    console.log(
      `Successfully retrieved scratch org url ${resultAsJSON.result.url}`
    );
   
   
    AppInsights.trackTaskEvent("sfpwowerscript-managescratchorg-task","scratchorg_created");    

    }
    else
    {
      console.log("SFPowerScript.. Delete a scratch org");


      const target_org: string = tl.getInput("target_org", true);

      let deleteScratchOrgImpl:DeleteScratchOrgImpl = new DeleteScratchOrgImpl(target_org,devhub_alias);
      console.log("Generating Delete Scratch Org command");
      let command = await deleteScratchOrgImpl.buildExecCommand();
      tl.debug(command);
      await deleteScratchOrgImpl.exec(command);

      AppInsights.trackTaskEvent("sfpwowerscript-managescratchorg-task","scratchorg_deleted");    
      
    }

    AppInsights.trackTask("sfpwowerscript-managescratchorg-task");
   
  } catch (err) {
    AppInsights.trackExcepiton("sfpwowerscript-managescratchorg-task",err);    
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
