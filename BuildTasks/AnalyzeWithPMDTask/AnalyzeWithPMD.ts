import tl = require("azure-pipelines-task-lib/task");
import AnalyzeWithPMDImpl from "./AnalyzeWithPMDImpl";
import { isNullOrUndefined } from "util";
import child_process = require("child_process");

async function run() {
  try {
    const directory: string = tl.getInput("directory", true);
    const ruleset: string = tl.getInput("ruleset", true);
    let rulesetpath:string;
    if(ruleset == "Custom" && isNullOrUndefined(rulesetpath))
    {
     rulesetpath = tl.getInput("rulesetpath", false);
    }
    else
    {
     rulesetpath = "";
    }
    

    child_process.execSync("wget https://github.com/pmd/pmd/releases/download/pmd_releases%2F6.18.0/pmd-bin-6.18.0.zip");
    child_process.execSync("unzip pmd-bin-6.18.0.zip");
    child_process.execSync("cwd");
    child_process.execSync("pmd-bin-6.18.0/bin/run.sh pmd ");
    
    

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
