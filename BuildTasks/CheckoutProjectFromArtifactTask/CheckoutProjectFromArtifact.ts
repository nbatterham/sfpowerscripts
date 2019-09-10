import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
var fs = require("fs");
const path = require("path");
import * as simplegit from 'simple-git/promise';
const git = simplegit();


async function run() {
  try {


    const username = tl.getInput("username",true);
    const password = tl.getInput("password",true);

    const artifact =tl.getInput("artifactname",true);

    let artifact_directory = tl.getVariable("system.artifactsDirectory");

      let package_version_id_file_path = path.join(
        artifact_directory,
        artifact,
        "sfdx_source_package_commit_id",
        "package_version_id"
      );

     let package_metadata_json = fs
        .readFileSync(package_version_id_file_path)
        .toString();


   let package_metadata = JSON.parse(package_metadata_json);
   let local_source_directory=path.join(
    artifact_directory,
    artifact,
    "source"
  );

  //Strinp https
  const removeHttps = input => input.replace(/^https?:\/\//, '');

  package_metadata.repository_url = removeHttps( package_metadata.repository_url);

   console.log(package_metadata);
  
   const remote = `https://${username}:${password}@${package_metadata.repository_url}`;

   console.log(remote);


   status = await git.silent(true).clone(remote,local_source_directory);
   console.log(status);

   await git.checkout(package_metadata.sourceVersion);


   
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
