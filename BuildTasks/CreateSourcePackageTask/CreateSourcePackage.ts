import tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");

async function run() {
  try {
    //let sfdx_package: string = tl.getInput("package", true);
    //let version_number: string = tl.getInput("version_number", false);
    //let project_directory = tl.getInput("project_directory", false);
    


      let commit_id = tl.getVariable("build.sourceVersion");
      let repository_url = tl.getVariable("build.repository.uri")


      
     let metadata = {
      sourceVersion: commit_id,
      repository_url:repository_url
   };


      fs.writeFileSync(__dirname + "/artifact_metadata", JSON.stringify(metadata));

      let data = {
        artifacttype: "container",
        artifactname: "sfpowerkit_artifact"
    
      }
      // upload or copy
      data["containerfolder"] = "sfpowerkit_artifact";

      // add localpath to ##vso command's properties for back compat of old Xplat agent
      data["localpath"] = __dirname + "/artifact_metadata";
      tl.command("artifact.upload", data, __dirname + "/artifact_metadata");
    }
   catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
