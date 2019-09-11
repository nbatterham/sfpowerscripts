import child_process = require("child_process");
import tl = require("azure-pipelines-task-lib/task");
import { delay } from "../Common/Delay";
import rimraf = require("rimraf");
import { copyFile, copyFileSync } from "fs";

export default class DeploySourceToOrgImpl {
  public constructor(
    private target_org: string,
    private project_directory: string,
    private source_directory: string,
    private deployment_options: any
  ) {}

  public async exec() {

    //Clean mdapi directory
    rimraf.sync('mdapi');

    tl.debug("Converting source to mdapi");
    await this.convertSourceToMDAPI();

    try
    {
    if(this.deployment_options["checkonly"])
     copyFileSync(this.deployment_options["validation_ignore"],this.project_directory);
    }
    catch(err)
    {
     
    }

    let command = await this.buildExecCommand();
    let result = child_process.execSync(command, {
      cwd: this.project_directory,
      encoding: "utf8"
    });
    tl.debug(result);
    let resultAsJSON = JSON.parse(result);
    let deploy_id = resultAsJSON.result.id;

    tl.setVariable("sfpowerkit_deploysource_id", deploy_id);

    if (this.deployment_options["checkonly"])
      console.log(
        `Validation is in progress....  Unleashing the power of your code!`
      );
    else
      console.log(
        `Deployment is in progress....  Unleashing the power of your code!`
      );

    while (true) {
      let result = child_process.execSync(
        `npx sfdx force:mdapi:deploy:report --json -i ${deploy_id} -u ${this.target_org}`,
        {
          cwd: this.project_directory,
          encoding: "utf8"
        }
      );
      let resultAsJSON = JSON.parse(result);

      if (resultAsJSON["status"] == "1") {
        console.log("Validation/Deployment Failed");
        break;
      } else if (
        resultAsJSON["result"]["status"] == "InProgress" ||
        resultAsJSON["result"]["status"] == "Pending"
      ) {
        console.log(
          `Checking ${resultAsJSON.result.numberComponentsDeployed} out of ${resultAsJSON.result.numberComponentsTotal}`
        );
      } else if (resultAsJSON["result"]["status"] == "Succeeded") {
        console.log("Validation/Deployment Succeeded");
        break;
      }

      delay(30000);
    }

    result = child_process.execSync(
      `npx sfdx force:mdapi:deploy:report  -i ${deploy_id} -u ${this.target_org}`,
      {
        cwd: this.project_directory,
        encoding: "utf8"
      }
    );
    console.log(result);
  }

  private async buildExecCommand(): Promise<string> {
    let apexclasses;

    let command = `npx sfdx force:mdapi:deploy -u ${this.target_org}`;

    if (this.deployment_options["checkonly"]) command += ` -c`;

    //directory
    command += ` -d mdapi`;

    //testlevel
    command += ` -l ${this.deployment_options["testlevel"]}`;

    //add json
    command += ` --json`;

    if (this.deployment_options["testlevel"] == "RunApexTestSuite") {
      apexclasses = await this.convertApexTestSuiteToListOfApexClasses(
        this.deployment_options["apextestsuite"]
      );
      command += ` -r ${apexclasses}`;
    } else if (this.deployment_options["testlevel"] == "RunSpecifiedTests") {
      apexclasses = this.deployment_options["specified_tests"];
      command += ` -r ${apexclasses}`;
    }

    tl.debug("Generated Command");
    tl.debug(command);

    return command;
  }

  private async convertApexTestSuiteToListOfApexClasses(
    apextestsuite: string
  ): Promise<string> {
    console.log(
      "Converts an apex test suite to its consituent apex classes as a single line separated by commas"
    );
    let result = child_process.execSync(
      `npx sfdx sfpowerkit:source:apextestsuite:convert  -n ${apextestsuite}`,
      { cwd: this.project_directory, encoding: "utf8" }
    );
    return result;
  }

  private async convertSourceToMDAPI(): Promise<void> {
    console.log(`Converting to Source Format ${this.source_directory} in project directory  ${this.project_directory}`);
    child_process.execSync(
      `npx sfdx force:source:convert -r ${this.source_directory}  -d  mdapi`,
      { cwd: this.project_directory, encoding: "utf8" }
    );
    console.log("Converting to Source Format Completed");
  }
}
