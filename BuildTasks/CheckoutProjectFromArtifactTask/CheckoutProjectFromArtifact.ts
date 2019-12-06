import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
var fs = require("fs");
const path = require("path");
import simplegit from "simple-git/promise";
import { AppInsights } from "../Common/AppInsights";


async function run() {
  try {
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
        connection = tl.getInput("bitbucket", true);
        break;
      case "otherGit":
        connection = tl.getInput("other_git_connection", true);
        break;
    }

    let token;
    if (version_control_provider == "azure_repo") {
      token = tl.getVariable("system.accessToken");
    } else {
      token = tl.getEndpointAuthorizationParameter(
        connection,
        "AccessToken",
        true
      );
    }

    let artifact_directory = tl.getVariable("system.artifactsDirectory");

    AppInsights.setupAppInsights(tl.getBoolInput("isTelemetryEnabled", true));

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
    let local_source_directory = path.join(
      artifact_directory,
      artifact,
      "source"
    );

    fs.mkdirSync(local_source_directory, { recursive: true });

    //Strinp https
    const removeHttps = input => input.replace(/^https?:\/\//, "");

    package_metadata.repository_url = removeHttps(
      package_metadata.repository_url
    );

    console.log(package_metadata);

    let remote: string;
    if (version_control_provider == "bitbucket") {
       remote = `https://x-token-auth:${token}@${package_metadata.repository_url}.git`;
    } else  {
       remote = `https://${token}@${package_metadata.repository_url}.git`;
    }

    const git = simplegit(local_source_directory);
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
    AppInsights.trackExcepiton("sfpwowerscripts-createsourcepackage-task", err);
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
