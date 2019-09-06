


# SFPowerscripts

SFPowerscripts is an Azure Pipelines Extension that converts Azure Pipelines into a CI/CD platform for Salesforce. The extension features the following the tasks

## Authentication Related Tasks

 
 - Authenticate a DevHub using JWT
 - Authenticate a Sandbox using JWT
 - Create a Scratch Org
 - Delete a Scratch Org

## Build/ Deployment Related Tasks

 
 -  Install SFDX along with SFPowerkit Plugin
 -  Deploy a source format based repo to an org (scratch org/sandbox/prod)
 -  Create an unlocked package 
 -  Deploy an unlocked package to an org
 -  Trigger Apex Test
 -  Validate Apex Test Coverge of an org
 -  Validate a Unlocked package for metadata coverage 
 -   Install all the dependencies of an unlocked package

The extension is designed with tasks which are granular,  which means all the above tasks has to be orchestrated in a valid order required to reach the required objective.  This allows one to utilise other commands or extensions between the tasks and be highly effective.  Sample orchestration pipelines are available in the Sample Pipelines Folder. Import these pipelines (in JSON Format) to your Azure  Pipelines instance , set the variables and other parameters and you will be ready to utilize a highly customizable pipeline in the shortest time.

For eg: a Pull Request validation for an unlocked package  should feature the tasks in this order

![PR Pipeline](https://github.com/azlamsalam/sfpowerscripts/blob/master/images/pr_pipeline.PNG)


 1. Install the SFDX CLI
 2. Validate the unlocked package for metadata coverage
 3. Authenticate DevHub
 4.  Create a Scratch Org
 5. Install Package Dependencies in the target scratch org
 6. Deploy source to the target scratch org
 7. Delete the scratch org
 
 The sample pipelines are available at 
 
 [PR Pipeline using a Scratch Org](https://github.com/azlamsalam/sfpowerscripts/blob/master/SamplePipelines/PR%20Source%20Format%20%5BScratch%20Orgs%5D%20using%20sfpowerscripts.json)
 
  [Unlocked Package Build Pipeline](https://github.com/azlamsalam/sfpowerscripts/blob/master/SamplePipelines/Unlocked%20Package%20Build%20using%20sfpowerscript.json)




