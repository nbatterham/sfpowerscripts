import tl = require("azure-pipelines-task-lib/task");
import ValidateDXUnlockedPackageImpl from "./ValidateDXUnlockedPackageImpl";

async function run() {
  try {
    const validate_package: string = tl.getInput("package", false);
    const project_directory: string = tl.getInput("working_directory", false);
    
    
    let validateApexCoverageImpl:ValidateDXUnlockedPackageImpl = new ValidateDXUnlockedPackageImpl(validate_package,project_directory);
    console.log("Generating command");
    let command = await validateApexCoverageImpl.buildExecCommand();
    tl.debug(command);
    await validateApexCoverageImpl.exec(command);

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
