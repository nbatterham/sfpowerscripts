import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import * as secureFilesCommon from "../Common/SecureFileHelpers";

async function run() {
  try {

    console.log("SFPowerScript.. Authenticate Sandbox")

    const working_directory: string = tl.getInput("working_directory", false);

    const username: string = tl.getInput("username", true);
    const jwt_key_file: string = tl.getInput("jwt_key_file", true);
    const clientid: string = tl.getInput("clientid", true);
    const envname: string = tl.getInput("envname", true);
    


    const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers();
    const jwt_key_filePath: string = await secureFileHelpers.downloadSecureFile(
      jwt_key_file
    );

    child_process.execSync(
      `npx sfdx force:auth:jwt:grant --clientid ${clientid} --jwtkeyfile ${jwt_key_filePath} --username ${username} --setdefaultusername --setalias ${envname} -r https://test.salesforce.com `,
      { cwd: working_directory }
    );


    console.log(`Successfully authenticated to Sandbox with username ${username} using JWT based authentication, The alias is ${envname} `);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
