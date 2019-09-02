import tl = require("azure-pipelines-task-lib/task");
import IncrementProjectBuildNumberImpl from "./IncrementProjectBuildNumberImpl";

async function run() {
  try {
    const segment: string = tl.getInput("segment", true);
    const sfdx_package: string = tl.getInput("package", false);
    const project_directory: string = tl.getInput("project_directory", false);
    const set_build_number: boolean = tl.getBoolInput("set_build_number",true);

    let incrementProjectBuildNumberImpl: IncrementProjectBuildNumberImpl = new IncrementProjectBuildNumberImpl(
      project_directory,
      sfdx_package,
      segment
    );

    let version_number: string = await incrementProjectBuildNumberImpl.exec();

    if (set_build_number) {
      console.log("Updating build number");
      tl.setVariable("Build.BuildNumber", version_number, false);
      tl.setVariable("Build.UpdateBuildNumber", version_number, false);
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
