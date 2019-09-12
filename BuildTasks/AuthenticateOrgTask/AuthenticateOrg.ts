import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import * as secureFilesCommon from "../Common/SecureFileHelpers";

async function run() {
  try {
    const username: string = tl.getInput("username", true);
    const isDevHub: boolean = tl.getBoolInput("isdevhub", true);
    const jwt_key_file: string = tl.getInput("jwt_key_file", true);
    const clientid: string = tl.getInput("clientid", true);
    const alias: string = tl.getInput("alias", true);

    const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers();
    const jwt_key_filePath: string = await secureFileHelpers.downloadSecureFile(
      jwt_key_file
    );

    if (isDevHub) {
      console.log(`SFPowerScript.. Authenticate DevHub ${alias}`);

      child_process.execSync(
        `npx sfdx force:auth:jwt:grant --clientid ${clientid} --jwtkeyfile ${jwt_key_filePath} --username ${username} --setdefaultdevhubusername --setalias ${alias}`
      );

      console.log(
        `Successfully authenticated to DevHub with username ${username} using JWT based authentication, The alias is ${alias} `
      );
    } else {
      console.log(`SFPowerScript.. Authenticate Sandbox ${alias} `);

      child_process.execSync(
        `npx sfdx force:auth:jwt:grant --clientid ${clientid} --jwtkeyfile ${jwt_key_filePath} --username ${username} --setdefaultusername --setalias ${alias} -r https://test.salesforce.com `
      );

      console.log(
        `Successfully authenticated to Sandbox with username ${username} using JWT based authentication, The alias is  ${alias} `
      );
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
