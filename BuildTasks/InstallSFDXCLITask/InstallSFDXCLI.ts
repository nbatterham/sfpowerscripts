import tl = require('azure-pipelines-task-lib/task');
import child_process = require('child_process');
import { AppInsights } from "../Common/AppInsights";


async function run() {
    try {
      
        console.log("SFPowerScript.. Install SFDX/SFPowerkit")

        AppInsights.setupAppInsights(true);

        const cli_version: string = tl.getInput('sfdx_cli_version', false);
        const sfpowerkit_version: string = tl.getInput('sfpowerkit_version', false);
        

        child_process.execSync(`sudo yarn global add sfdx-cli@${cli_version}`);
        child_process.execSync(`echo 'y' | npx sfdx plugins:install sfpowerkit@${sfpowerkit_version}`);

        console.log("SFDX along with SFPowerkit installed succesfully");
        AppInsights.trackTask("sfpwowerscript-installsfdx-old-task");
        AppInsights.trackTaskEvent("sfpwowerscript-installsfdx-old-task");
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();