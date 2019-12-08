import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
var fs = require("fs");
const path = require("path");
import simplegit from "simple-git/promise";
import { AppInsights } from "../Common/AppInsights";
var shell = require("shelljs");


async function run() {
  try {

    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled", true));


    const artifact = tl.getInput("artifact", true);
    const version_control_provider: string = tl.getInput(
      "versionControlProvider",
      true
    );

    let connection: string;
    switch (version_control_provider) {
      case "github":
        connection = tl.getInput("github_connection", true);
        break;
      case "githubEnterprise":
        connection = tl.getInput("github_enterprise_connection", true);
        break;
      case "bitbucket":
        connection = tl.getInput("bitbucket_connection", true);
        break;
      case "otherGit":
        connection = tl.getInput("other_git_connection", true);
        break;
    }

    let token;
    let username:string;
    if (version_control_provider == "azureRepo") {
      token = tl.getVariable("system.accessToken");
    } else if(version_control_provider == "github" ||version_control_provider == "githubEnterprise" ) {
      token = tl.getEndpointAuthorizationParameter(
        connection,
        "AccessToken",
        true
      );
    } else if(version_control_provider == "bitbucket") {
      token = tl.getEndpointAuthorizationParameter(
        connection,
        "AccessToken",
        true
      );
    } else
    {

     

      var auth = tl.getEndpointAuthorization(connection, false);
      username = getAuthParameter(auth, 'username');
      token = getAuthParameter(auth, 'password');
      

     console.log(`USERNAME  ${username} ${username.length}`)
     console.log(`TOKEN ${token} ${token.length}`)

    }

    let artifact_directory = tl.getVariable("system.artifactsDirectory");

   

    let package_version_id_file_path = path.join(
      artifact_directory,
      artifact,
      "sfpowerkit_artifact",
      "artifact_metadata"
    );

    let package_metadata_json = fs
      .readFileSync(package_version_id_file_path)
      .toString();

    let package_metadata = JSON.parse(package_metadata_json);

    
    console.log(package_metadata);


    let local_source_directory = path.join(
      artifact_directory,
      artifact,
      "source"
    );

    fs.mkdirSync(local_source_directory, { recursive: true });

    console.log(`Source Directory created at ${local_source_directory}`)

    //Strinp https
    const removeHttps = input => input.replace(/^https?:\/\//, "");

    let repository_url = removeHttps(
      package_metadata.repository_url
    );


    const git = simplegit(local_source_directory);

    let remote: string;
    if (version_control_provider == "bitbucket" || version_control_provider == "azureRepo") {
       remote = `https://x-token-auth:${token}@${repository_url}`;
    } else  if(version_control_provider == "github" || version_control_provider == "githubEnterprise") {
       remote = `https://${token}:x-oauth-basic@${repository_url}`;
    } else if (version_control_provider == "otherGit")
    {
      remote = `https://${username}:${token}@${package_metadata.repository_url}`;

      await git.addConfig(`${package_metadata.repository_url}.extraheader`,`AUTHORIZATION: basic ${auth}`);
     
    }



   
    await git.silent(false).clone(remote, local_source_directory);
    await git.checkout(package_metadata.sourceVersion);

    console.log(`Checked Out ${package_metadata.sourceVersion} sucessfully`);

    fs.readdirSync(local_source_directory).forEach(file => {
      console.log(file);
    });

    tl.setVariable("sfpowerscripts_checked_out_path", local_source_directory);

    AppInsights.trackTask("sfpwowerscript-checkoutprojectfromartifact-task");
    AppInsights.trackTaskEvent(
      "sfpwowerscript-checkoutprojectfromartifact-task",
      "project_checked_out"
    );
  } catch (err) {
    
    AppInsights.trackExcepiton("sfpwowerscripts-checkoutprojectfromartifact-task", err);
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

function getAuthParameter(auth, paramName) {
  var paramValue = null;
  var parameters = Object.getOwnPropertyNames(auth['parameters']);
  var keyName;
  parameters.some(function (key) {
      if (key.toLowerCase() === paramName.toLowerCase()) {
          keyName = key;
          return true;
      }
  });
  paramValue = auth['parameters'][keyName];
  return paramValue;
}

run();
