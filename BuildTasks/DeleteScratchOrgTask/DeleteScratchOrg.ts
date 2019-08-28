import tl = require("azure-pipelines-task-lib/task");
import DeleteScratchOrgImpl from "./DeleteScratchOrgImpl";

async function run() {
  try {
    const target_org: string = tl.getInput("target_org", true);
    const devhub_alias: string = tl.getInput("devhub_alias", true);
    
    
    let deleteScratchOrgImpl:DeleteScratchOrgImpl = new DeleteScratchOrgImpl(target_org,devhub_alias);
    console.log("Generating command");
    let command = await deleteScratchOrgImpl.buildExecCommand();
    tl.debug(command);
    await deleteScratchOrgImpl.exec(command);

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
