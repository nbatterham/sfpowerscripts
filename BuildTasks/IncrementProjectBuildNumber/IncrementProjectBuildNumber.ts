import tl = require("azure-pipelines-task-lib/task");
import IncrementProjectBuildNumberImpl from "./IncrementProjectBuildNumberImpl";
import child_process = require("child_process");

async function run() {
  try {
    const segment: string = tl.getInput("segment", true);
    const sfdx_package: string = tl.getInput("package", false);
    const project_directory: string = tl.getInput("project_directory", false);
    const set_build_number: boolean = tl.getBoolInput("set_build_number",true);

    const commit_changes: boolean = tl.getBoolInput("commit_changes",false);


    let incrementProjectBuildNumberImpl: IncrementProjectBuildNumberImpl = new IncrementProjectBuildNumberImpl(
      project_directory,
      sfdx_package,
      segment
    );

    let version_number: string = await incrementProjectBuildNumberImpl.exec();

    if (set_build_number) {
      console.log(`Updating build number to ${version_number}`);
      tl.updateBuildNumber(version_number);
    }

    tl.setVariable("sfpowerscripts_incremented_project_version", version_number,false);

    if(commit_changes)
    {
    
      let exec_result = child_process.execSync("git add sfdx-project.json", {
        cwd: this.project_directory
      });
      console.log("Test");
      console.log(exec_result);
  
      exec_result = child_process.execSync(
        `git commit  -m "[skip ci] Updated Version "`,
        { cwd: this.project_directory }
      );
      console.log("Test2");
      console.log(exec_result);
    }
    

    
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
