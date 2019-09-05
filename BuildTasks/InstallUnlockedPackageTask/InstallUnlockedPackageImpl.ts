import child_process = require("child_process");
import { isNullOrUndefined } from "util";
const fs = require("fs");
const path = require("path");

export default class InstallUnlockedPackageImpl {
  public constructor(
    private project_directory: string,
    private sfdx_package: string,
    private segment
  ) {}

  public async exec(): Promise<string> {
    let project_config_path: string;

    if (!isNullOrUndefined(this.project_directory))
      project_config_path = path.join(
        this.project_directory,
        "sfdx-project.json"
      );
    else project_config_path = "sfdx-project.json";

    let project_json = JSON.parse(fs.readFileSync(project_config_path));

    if (isNullOrUndefined(this.sfdx_package)) this.sfdx_package = "default";

    let selected_package;
    project_json["packageDirectories"].forEach(element => {
      if (this.sfdx_package == "default" && element["default"] == true) {
        selected_package = element;
        return;
      } else if (this.sfdx_package == element["package"]) {
        selected_package = element;
        return;
      }
    });

    console.log(`Package : ${selected_package["package"]}`);
    console.log(`Version : ${selected_package["versionNumber"]}`);

    let segments = (selected_package["versionNumber"] as String).split(".");

    if (this.segment == "Major") segments[0] += String(Number(segments[0]) + 1);
    if (this.segment == "Minor") segments[1] += String(Number(segments[1]) + 1);
    if (this.segment == "Patch") segments[2] = String(Number(segments[2]) + 1);

    if (segments[3] == "NEXT") {
      throw new Error("NEXT not supported for build number");
    }

    if (this.segment == "BuildNumber")
      segments[3] = String(Number(segments[3]) + 1);

    selected_package[
      "versionNumber"
    ] = `${segments[0]}.${segments[1]}.${segments[2]}.${segments[3]}`;

    console.log(`Updated Version : ${selected_package["versionNumber"]}`);

    fs.writeFileSync(
      project_config_path,
      JSON.stringify(project_json, null, 4)
    );


    return selected_package["versionNumber"];
  }

  public async buildExecCommand(): Promise<void> {}
}
