import tl = require("azure-pipelines-task-lib/task");
import CreateUnlockedPackageImpl from "./CreateUnlockedPackageImpl";
const fs = require("fs");

async function run() {
  try {
    let sfdx_package: string = tl.getInput("package", true);
    let version_number: string = tl.getInput("version_number", false);
    let tag: string = tl.getInput("tag", false);
    let config_file_path = tl.getInput("config_file_path", true);
    let installationkeybypass = tl.getBoolInput("installationkeybypass", true);

    let installationkey;

    if (!installationkeybypass)
      installationkey = tl.getBoolInput("installationkey", true);

    let project_directory = tl.getInput("project_directory", false);
    let devhub_alias = tl.getInput("devhub_alias", true);
    let wait_time = tl.getInput("wait_time", true);

    let build_artifact_enabled = tl.getBoolInput(
      "build_artifact_enabled",
      true
    );

    let createUnlockedPackageImpl: CreateUnlockedPackageImpl = new CreateUnlockedPackageImpl(
      sfdx_package,
      version_number,
      tag,
      config_file_path,
      installationkeybypass,
      installationkey,
      project_directory,
      devhub_alias,
      wait_time
    );

    let command: string = await createUnlockedPackageImpl.buildExecCommand();

    let package_version_id: string = await createUnlockedPackageImpl.exec(
      command
    );

    tl.setVariable("sfpowerscripts_package_version_id", package_version_id);

    if (build_artifact_enabled) {
      fs.writeFileSync(__dirname + "/package_version_id", package_version_id);

      let data = {
        artifacttype: "container",
        artifactname: "sfdx_unlocked_package_version_id"
      };

      // upload or copy
      data["containerfolder"] = "sfdx_unlocked_package_version_id";

      // add localpath to ##vso command's properties for back compat of old Xplat agent
      data["localpath"] = __dirname + "/package_version_id";
      tl.command("artifact.upload", data, __dirname + "/package_version_id");
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
