import tl = require("azure-pipelines-task-lib/task");


async function run() {
  try {
  
    let runNumber:string = tl.getVariable("Rev:.r");
   
    console.log(runNumber);

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
