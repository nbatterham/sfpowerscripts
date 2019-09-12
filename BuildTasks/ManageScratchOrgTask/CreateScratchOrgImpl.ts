import child_process = require("child_process");

export default class CreateScratchOrgImpl {
  
  public constructor(private working_directory:string,private config_file_path: string, private devhub: string) {}

  public async exec(command: string): Promise<any> {
    let result = child_process.execSync(command, {
      cwd: this.working_directory,
      encoding: "utf8"

    });
   console.log(result);
   let resultAsJSON=JSON.parse(result);
   return resultAsJSON;
  }

  public async buildExecCommand(): Promise<string> {
    let command = `npx sfdx force:org:create -v ${this.devhub} -s -f ${this.config_file_path} --json -a scratchorg -d 1`;
    return command;
  }

  
}
