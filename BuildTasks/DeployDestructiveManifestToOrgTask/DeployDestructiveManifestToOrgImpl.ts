import child_process = require("child_process");
import tl = require("azure-pipelines-task-lib/task");
import { onExit } from "../Common/OnExit";

export default class DeployDestructiveManifestToOrgImpl {
  public constructor(
    private target_org: string,
    private destructiveManifestPath: string
  ) {}

  public async exec(command: string) {
    let child = child_process.exec(
      command,
      { encoding: "utf8" },
      (error, stdout, stderr) => {
        if (error) throw error;
      }
    );

    child.stdout.on("data", data => {
      console.log(data.toString());
    });
    child.stderr.on("data", data => {
      console.log(data.toString());
    });

    await onExit(child);
  }

  public async buildExecCommand(): Promise<string> {
    let command = `npx sfdx sfpowerkit:org:destruct -u ${this.target_org} -m ${this.destructiveManifestPath}`;

    tl.debug("Generated Command");
    tl.debug(command);

    return command;
  }
}
