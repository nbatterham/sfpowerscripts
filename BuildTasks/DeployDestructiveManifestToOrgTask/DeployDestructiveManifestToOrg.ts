import tl = require("azure-pipelines-task-lib/task");
import DeployDestructiveManifestToOrgImpl from "./DeployDestructiveManifestToOrgImpl";
import fs = require("fs");
import path = require("path");


async function run() {
  try {
    console.log("SFPowerScript.. Deploy Destructive Manifest to Org");

    const targetOrg: string = tl.getInput("target_org", true);
    const method: string = tl.getInput("method", true);

    let destructiveManifestPath = null;

    if(method == "Text")
    {

      let destructiveManifest=  tl.getInput("destructive_manifest_text",true);
      console.log(destructiveManifest);
      destructiveManifestPath = path.join(__dirname,"destructiveChanges.xml")
      fs.writeFileSync(destructiveManifestPath,destructiveManifest);
    }
    else
    {
      destructiveManifestPath =  tl.getInput("destructive_manifest_filepath", true);
      if(!fs.existsSync(destructiveManifestPath))
      tl.setResult(tl.TaskResult.Failed,"Unable to find the specified manifest file");
      return;
    }

    let  deploySourceToOrgImpl:DeployDestructiveManifestToOrgImpl = new DeployDestructiveManifestToOrgImpl(this.targetOrg,this.destructiveManifestPath);
    
    let command:string = await deploySourceToOrgImpl.buildExecCommand();
    await deploySourceToOrgImpl.exec(command);


    let destructiveManifest:Buffer = fs.readFileSync(destructiveManifestPath);

    tl.logDetail("dc45919a-dc91-46cb-94ca-86d105a444e0",destructiveManifest.toString(),undefined,undefined,"Destructive Manifest Deployed",undefined,undefined,undefined,undefined, tl.TaskState.Completed,tl.TaskResult.Succeeded);
    tl.setResult(tl.TaskResult.Succeeded,"Destuctive Changes succesfully deployed",true);

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
