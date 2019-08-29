import child_process = require("child_process");
import { onExit } from "../Common/OnExit";


export default class ValidateDXUnlockedPackageImpl {
  public constructor(private validate_package: string, private project_directory: string) {}

  public async exec(command: string): Promise<void> {
   
    let child=child_process.exec(command,  { encoding: "utf8", cwd:this.project_directory },(error,stdout,stderr)=>{

      if(error)
         throw error;
    });
   
    child.stdout.on("data",data=>{console.log(data.toString()); });
    child.stderr.on("data",data=>{console.log(data.toString()); });
    

    await onExit(child);

  }

  public async buildExecCommand(): Promise<string> {

    let command;
    if(this.validate_package!=null && this.validate_package.length>0)
    command = `npx sfdx sfpowerkit:package:valid -n  ${this.validate_package}`;
    else
    command = `npx sfdx sfpowerkit:package:valid`;

    return command;
  }

 
}
