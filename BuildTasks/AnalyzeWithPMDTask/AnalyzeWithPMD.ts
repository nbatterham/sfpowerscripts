import tl = require("azure-pipelines-task-lib/task");
import AnalyzeWithPMDImpl from "./AnalyzeWithPMDImpl";
import { isNullOrUndefined } from "util";
import FileSystemInteractions from "../Common/FileSystemInteractions";
const os = require("os");
const path = require("path");
import xml2js = require("xml2js");
const fs = require("fs");

async function run() {
  try {
    let stagingDir: string = path.join(
      tl.getVariable("build.artifactStagingDirectory"),
      ".codeAnalysis"
    );

    const project_directory = tl.getInput("project_directory", false);
    const directory: string = tl.getInput("directory", false);
    const ruleset: string = tl.getInput("ruleset", false);

    let rulesetpath: string;
    if (ruleset == "Custom" && isNullOrUndefined(rulesetpath)) {
      rulesetpath = tl.getInput("rulesetpath", false);
    }

    const format: string = tl.getInput("format", false);
    const outputPath: string = tl.getInput("outputPath", false);
    const version: string = tl.getInput("version", false);
    let result: [number, number,number];

    let pmdImpl: AnalyzeWithPMDImpl = new AnalyzeWithPMDImpl(
      project_directory,
      directory,
      rulesetpath,
      format,
      outputPath,
      version
    );
    let command = await pmdImpl.buildExecCommand();
    await pmdImpl.exec(command);

    let artifactFilePath = path.join(os.homedir(), "sfpowerkit","pmd",`pmd-bin-${version}`, "sf-pmd-output.xml");

    

    tl.debug(`Artifact File Path : ${artifactFilePath}`);

    if (fs.existsSync(artifactFilePath)) {
      result = parseXmlReport(artifactFilePath);
    }

    if (result != null) {
      let summary = createSummaryLine(result);
      let buildSummaryFilePath: string = path.join(
        stagingDir,
        "CodeAnalysisBuildSummary.md"
      );
      FileSystemInteractions.createDirectory(stagingDir);
      fs.writeFileSync(buildSummaryFilePath, summary);

      tl.command(
        "task.addattachment",
        {
          type: "Distributedtask.Core.Summary",
          name: tl.loc("codeAnalysisBuildSummaryTitle")
        },
        buildSummaryFilePath
      );

      tl.command(
        "artifact.upload",
        { artifactname: `Code Analysis Results` },
        artifactFilePath
      );
    }
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

function parseXmlReport(xmlReport: string): [number, number,number] {
  let fileCount = 0;
  let violationCount = 0;
  let criticaldefects = 0;

  let reportContent: string = fs.readFileSync(xmlReport, "utf-8");
  xml2js.parseString(reportContent, (err, data) => {
    // If the file is not XML, or is not from PMD, return immediately
    if (!data || !data.pmd) {
      console.debug(`Empty or unrecognized PMD xml report ${xmlReport}`);
      return null;
    }

    if (!data.pmd.file || data.pmd.file.length === 0) {
      // No files with violations, return now that it has been marked for upload
      return null;
    }

    data.pmd.file.forEach((file: any) => {
      if (file.violation) {
        fileCount++;
        violationCount += file.violation.length;
      }
    });

   data.pmd.file[0].violation.forEach(element => {
      if(element["$"]["priority"]==5)
       {
         criticaldefects++;
       }
   });


  });

  

  return [violationCount, fileCount,criticaldefects];
}

// For a given code analysis tool, create a one-line summary from multiple AnalysisResult objects.
function createSummaryLine(analysisreport: [number, number,number]): string {
  let violationCount: number = analysisreport[0];
  let affectedFileCount: number = analysisreport[1];
  let criticaldefects:number = analysisreport[2];
  let toolName = "PMD";

  if (violationCount > 1) {
    if (affectedFileCount > 1) {
      // Looks like: 'PMD found 13 violations in 4 files.'
      return `${toolName} found ${violationCount} violations in ${affectedFileCount} files with ${criticaldefects}`;
    }
    if (affectedFileCount === 1) {
      // Looks like: 'PMD found 13 violations in 1 file.'
      return `${toolName} found ${violationCount} violations in 1 file with ${criticaldefects}`;
    }
  }
  if (violationCount === 1 && affectedFileCount === 1) {
    // Looks like: 'PMD found 1 violation in 1 file.'
    return `${toolName} found 1 violation in 1 file with ${criticaldefects}`;
  }
  if (violationCount === 0) {
    // Looks like: 'PMD found no violations.'
    return `${toolName} found no violations.`
  }

  // There should be no valid code reason to reach this point - '1 violation in 4 files' is not expected
  throw new Error(
    "Unexpected results from " +
      toolName +
      ": " +
      violationCount +
      " total violations in " +
      affectedFileCount +
      " files"
  );
}

run();
