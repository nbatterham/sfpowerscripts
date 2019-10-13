import tl = require("azure-pipelines-task-lib/task");
import AnalyzeWithPMDImpl from "./AnalyzeWithPMDImpl";
import { isNullOrUndefined } from "util";
import child_process = require("child_process");
import { onExit } from "../Common/OnExit";

async function run() {
  try {

    const project_directory = tl.getInput("project_directory", false);
    const directory: string = tl.getInput("directory", false);
    const ruleset: string = tl.getInput("ruleset", false);
    let rulesetpath:string;
    if(ruleset == "Custom" && isNullOrUndefined(rulesetpath))
    {
     rulesetpath = tl.getInput("rulesetpath", false);
    }
   
   
    const format: string = tl.getInput("format", false);
    const outputPath: string = tl.getInput("outputPath", false);
    const version: string = tl.getInput("version", false);

    
    let pmdImpl:AnalyzeWithPMDImpl = new AnalyzeWithPMDImpl(project_directory,directory,rulesetpath,format,outputPath,version);
    let command = await pmdImpl.buildExecCommand();
    await pmdImpl.exec(command);

    

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
