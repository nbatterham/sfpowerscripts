import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
var fs = require("fs");
const path = require("path");

async function run() {
  try {


    const username = tl.getInput("username",true);
    const password = tl.getInput("password",true);

    const artifact =tl.getInput("artifactname",true);

    let artifact_directory = tl.getVariable("system.artifactsDirectory");

      let package_version_id_file_path = path.join(
        artifact_directory,
        artifact,
        "sfdx_unlocked_package_version_id",
        "package_version_id"
      );

     let package_metadata_json = fs
        .readFileSync(package_version_id_file_path)
        .toString();


   let package_metadata = JSON.parse(package_metadata_json);

   console.log(package_metadata);

   
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
