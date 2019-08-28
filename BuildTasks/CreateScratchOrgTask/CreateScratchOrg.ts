import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");


async function run() {
  try {
    console.log("SFPowerScript.. Create a scratch org");

    const devhub_alias: string = tl.getInput("devhub_alias", true);
    const config_file_path: string = tl.getInput("config_file_path", true);
    const working_directory: string = tl.getInput("working_directory", false);

    let result = child_process.execSync(
      `npx sfdx force:org:create -v ${devhub_alias} -s -f ${config_file_path} --json -a scratchorg -d 1`,
      { cwd: working_directory, encoding: "utf8" }
    );

  
    tl.debug(result);
    let resultAsJSON=JSON.parse(result);
    tl.setTaskVariable('sfpowerscripts_scratch_org_username',resultAsJSON.result.username,false);
    
    console.log(
      `Successfully created a scratch org with devhub ${devhub_alias} , The username  is ${resultAsJSON.result.username}`
    );

    //Open up the scratch org to get the URL
    console.log(`Opening up the created scratch org to retrieve URL`)
    result = child_process.execSync(`npx sfdx force:org:open -r --json`, { cwd: working_directory, encoding: "utf8" });
    tl.debug(result);
    resultAsJSON=JSON.parse(result);
    tl.setTaskVariable('sfpowerscripts_scratch_org_url',resultAsJSON.result.url,false);
    
    console.log(
      `Successfully retrieved scratch org url ${resultAsJSON.result.url}`
    );

   
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
