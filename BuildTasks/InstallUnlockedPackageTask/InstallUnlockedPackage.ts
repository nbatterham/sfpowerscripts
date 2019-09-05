import tl = require("azure-pipelines-task-lib/task");
import InstallUnlockedPackageImpl from "./InstallUnlockedPackageImpl";
import child_process = require("child_process");
import { isNullOrUndefined } from "util";

async function run() {
  try {
    const envname: string = tl.getInput("envname", true);
    const sfdx_package:string = tl.getInput("package",true);

    const package_installedfrom = tl.getInput("package_installedfrom",true);

    let package_version_id;

    if(package_installedfrom == 'BuildArtifact')
    {
      //Figure out the id from the artifact

      const artifact = tl.getInput("artifact",true);
      
      let variables = tl.getVariables;


      console.log(variables);



    }
    else
    {
      package_version_id = tl.getInput("package_version_id",false);
    }

    const installationkey = tl.getInput("installationkey",false);
    const apexcompileonlypackage = tl.getInput("apexcompileonlypackage",false);
    const security_type = tl.getInput("security_type",false);
    const upgrade_type = tl.getInput("upgrade_type",false);
    const wait_time = tl.getInput("wait_time",false);
    const publish_wait_time = tl.getInput("publish_wait_time",false);
    const working_directory = tl.getInput("working_directory",false);
   

    
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
