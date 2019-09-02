import tl = require("azure-pipelines-task-lib/task");
import IncrementProjectBuildNumberImpl from "./IncrementProjectBuildNumberImpl";

async function run() {
  try {
    const segment: string = tl.getInput("segment", true);
    const sfdx_package: string = tl.getInput("package", false);
    const project_directory: string = tl.getInput("project_directory", false);
    
    
    let incrementProjectBuildNumberImpl:IncrementProjectBuildNumberImpl = new IncrementProjectBuildNumberImpl(project_directory,sfdx_package,segment);
 
    await incrementProjectBuildNumberImpl.exec();

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
