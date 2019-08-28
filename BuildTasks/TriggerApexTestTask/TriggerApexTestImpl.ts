import child_process = require("child_process");
import { onExit } from "../Common/OnExit";



export default class TriggerApexTestImpl {

    public constructor(
        private target_org: string,
        private test_options: any
      ) {}


      public async exec(command:string):Promise<void>
      {
        let child=child_process.exec(command,  { encoding: "utf8" },(error,stdout,stderr)=>{

          if(error)
             throw error;
        });
       
        child.stdout.on("data",data=>{console.log(data.toString()); });

        await onExit(child);

      }
  
      public async buildExecCommand(): Promise<string> {
       
    
        let command = `npx sfdx force:apex:test:run -u ${this.target_org}`;
    

        command += ` -c`;
    
        //output
        command += ` -r human`;
    
        //testlevel
        command += ` -l ${this.test_options["testlevel"]}`;
    
   
        if (this.test_options["testlevel"] == "RunSpecifiedTests") {
         
          command += ` -t ${this.test_options["specified_tests"]}`;

        } 
        else if (this.test_options["testlevel"] == "RunApexTestSuite") {
        
          command += ` -s ${this.test_options["apextestsuite"]}`;
        }

         //wait
         command += ` -w ${this.test_options["wait_time"]}`;
    
    
         command += ` --verbose`;

        return command;
      }
    
     
}