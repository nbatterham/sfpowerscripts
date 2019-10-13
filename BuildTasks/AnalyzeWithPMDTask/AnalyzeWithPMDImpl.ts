import child_process = require("child_process");
import { onExit } from "../Common/OnExit";
import { isNullOrUndefined } from "util";


export default class AnalyzeWithPMDImpl {


  public constructor(private project_directory:string, private directory: string, private ruleset:string, private format:string, private ouputPath: string, private version:string) {}

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
        command = `npx sfdx sfpowerkit:source:pmd`;


    if(!isNullOrUndefined(this.directory))
    command+=` -d  ${this.directory}`;


    if(!isNullOrUndefined(this.format))
    command+=` -f  ${this.format}`;

    if(!isNullOrUndefined(this.ouputPath))
    command+=` -o  ${this.ouputPath}`;

    if(!isNullOrUndefined(this.ruleset))
    command+=` -r  ${this.ruleset}`;

    if(!isNullOrUndefined(this.version))
    command+=` --version=${this.version}`;


    return command;
  }

 
}
