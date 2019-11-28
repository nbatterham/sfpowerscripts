import tl = require("azure-pipelines-task-lib/task");
import child_process = require("child_process");
var fs = require("fs");
const path = require("path");
import  simplegit from 'simple-git/promise';

import rimraf = require("rimraf");


async function run() {
  try {


    const username = tl.getInput("username",true);
    const password = tl.getInput("password",true);

    const artifact =tl.getInput("artifact",true);

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
   let local_source_directory=path.join(
    artifact_directory,
    artifact,
    "source"
  );


  fs.mkdirSync(local_source_directory,{ recursive: true });

  //Strinp https
  const removeHttps = input => input.replace(/^https?:\/\//, '');

  package_metadata.repository_url = removeHttps( package_metadata.repository_url);

   console.log(package_metadata);
  
   const remote = `https://${username}:${password}@${package_metadata.repository_url}.git`;


   const git =  simplegit(local_source_directory);
   await git.silent(false).clone(remote,local_source_directory);  
   await git.checkout(package_metadata.sourceVersion);

   console.log(`Checked Out ${package_metadata.sourceVersion} sucessfully`);

   fs.readdirSync(local_source_directory).forEach(file => {
    console.log(file);
  });

 
  tl.setVariable("sfpowerscripts_checked_out_path", local_source_directory);
   
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
