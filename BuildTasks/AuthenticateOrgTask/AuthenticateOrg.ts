import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
import * as secureFilesCommon from "../Common/SecureFileHelpers";
import { isNullOrUndefined } from "util";
import { AppInsights } from "../Common/AppInsights";

async function run() {
  try {
    const method: string = tl.getInput("method", true);
    const username: string = tl.getInput("username", true);
    const isDevHub: boolean = tl.getBoolInput("isdevhub", true);
    const alias: string = tl.getInput("alias", true);

    AppInsights.setupAppInsights(true);
    AppInsights.trackTask("sfpwowerscript-authenticateorg-old-task");

    if (method == "JWT") {
      const jwt_key_file: string = tl.getInput("jwt_key_file", true);
      const clientid: string = tl.getInput("clientid", true);

      const secureFileHelpers: secureFilesCommon.SecureFileHelpers = new secureFilesCommon.SecureFileHelpers();
      const jwt_key_filePath: string = await secureFileHelpers.downloadSecureFile(
        jwt_key_file
      );

      AppInsights.trackTaskEvent("sfpwowerscript-authenticateorg-old-task","authUsingJWT");

      authUsingJWT(isDevHub, alias, clientid, jwt_key_filePath, username);
    } else if (method == "Credentials") {
      const password: string = tl.getInput("password", true);
      const securitytoken: string = tl.getInput("securitytoken", false);

      authUsingCreds(isDevHub, alias, username, password, securitytoken);
      
      AppInsights.trackTaskEvent("sfpwowerscript-authenticateorg-old-task","authUsingCreds");
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();

function authUsingCreds(
  isDevHub: boolean,
  alias: string,
  username: string,
  password: string,
  securitytoken: string
) {
  if (isDevHub) {
    console.log(`SFPowerScript.. Authenticate DevHub ${alias}`);
    if (isNullOrUndefined(securitytoken)) {
      child_process.execSync(
        `sfdx sfpowerkit:auth:login -u ${username} -p ${password} -r https://login.salesforce.com -a ${alias} `
      );
    } else {
      child_process.execSync(
        `sfdx sfpowerkit:auth:login -u ${username} -p ${password} -s ${securitytoken}  -r https://login.salesforce.com -a ${alias} `
      );
      console.log(
        `Successfully authenticated to DevHub with username ${username} using credentials, The alias is ${alias} `
      );
    }
  } else {
    if (isNullOrUndefined(securitytoken)) {
      child_process.execSync(
        `sfdx sfpowerkit:auth:login -u ${username} -p ${password}  -a ${alias} `
      );
    } else {
      child_process.execSync(
        `sfdx sfpowerkit:auth:login -u ${username} -p ${password} -s ${securitytoken} -a ${alias} `
      );

      console.log(
        `Successfully authenticated to Sandbox with username ${username} using credentials, The alias is  ${alias} `
      );
    }
  }
}

function authUsingJWT(
  isDevHub: boolean,
  alias: string,
  clientid: string,
  jwt_key_filePath: string,
  username: string
) {
  if (isDevHub) {
    console.log(`SFPowerScript.. Authenticate DevHub ${alias}`);
    console.log(
      `Successfully authenticated to DevHub with username ${username} using JWT based authentication, The alias is ${alias} `
    );
    child_process.execSync(
      `npx sfdx force:auth:jwt:grant --clientid ${clientid} --jwtkeyfile ${jwt_key_filePath} --username ${username} --setdefaultdevhubusername --setalias ${alias}`
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
}
