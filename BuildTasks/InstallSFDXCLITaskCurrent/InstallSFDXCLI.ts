import tl = require('azure-pipelines-task-lib/task');
import child_process = require('child_process');
import { AppInsights } from "../Common/AppInsights";


async function run() {
    try {
      
        AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled",true));
        console.log("SFPowerScript.. Install SFDX/SFPowerkit")

        const cli_version: string = tl.getInput('sfdx_cli_version', false);
        const sfpowerkit_version: string = tl.getInput('sfpowerkit_version', false);
        
    
        child_process.execSync(`npm install sfdx-cli@${cli_version} --global`);
        child_process.execSync(`echo 'y' | npx sfdx plugins:install sfpowerkit@${sfpowerkit_version}`);
        

      

        console.log("SFDX along with SFPowerkit installed succesfully")

        AppInsights.trackTask("sfpwowerscript-installsfdx-task");
        AppInsights.trackTaskEvent("sfpwowerscript-installsfdx-task");
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
        AppInsights.trackExcepiton("Install SFDX with sfpowerkit",err);
    }
}

run();