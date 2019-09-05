import tl = require("azure-pipelines-task-lib/task");
import InstallUnlockedPackageImpl from "./InstallUnlockedPackageImpl";
import child_process = require("child_process");
import { isNullOrUndefined } from "util";
var fs = require("fs");
const path = require("path");


async function run() {
  try {
    const envname: string = tl.getInput("envname", true);
    const sfdx_package:string = tl.getInput("package",true);

    const package_installedfrom = tl.getInput("packageinstalledfrom",true);

    let package_version_id;

    if(package_installedfrom == 'BuildArtifact')
    {
      //Figure out the id from the artifact

      const artifact = tl.getInput("artifact",true);
      
      let artifact_directory = tl.getVariable("system.artifactsDirectory");

      let package_version_id_file_path = path.join(
        artifact_directory,
        artifact,
        "sfdx_unlocked_package_version_id",
        "package_version_id"
      );
      
      package_version_id=fs.readFileSync(package_version_id_file_path).toString();
      console.log(package_version_id);
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

   

    
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
