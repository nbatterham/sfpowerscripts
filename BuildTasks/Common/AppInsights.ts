import * as config from "../Common/config.json";
import applicationinsights = require("applicationinsights");
import tl = require("azure-pipelines-task-lib/task");

export  class AppInsights {
  public static applicationInsightsClient: applicationinsights.TelemetryClient;

  public static setupAppInsights(enabled:boolean) {
    applicationinsights
      .setup(config.key)
      .setAutoDependencyCorrelation(false)
      .setAutoCollectRequests(false)
      .setAutoCollectPerformance(false)
      .setAutoCollectExceptions(false)
      .setAutoCollectDependencies(false)
      .setAutoCollectConsole(false)
      .setUseDiskRetryCaching(false)
      .start();

    this.applicationInsightsClient = applicationinsights.defaultClient;
    this.applicationInsightsClient.config.disableAppInsights = !enabled;
  }

  public static trackTask(taskName: string, additionalContext: string = 'none') {
    let taskType = tl.getVariable("Release.ReleaseId") ? "Release" : "Build";
    this.applicationInsightsClient.trackEvent({
      name: "Task Execution",
      properties: {
        task: taskName,
        taskContext: taskType,
        additionalContext: additionalContext,
        collection: tl.getVariable("system.collectionId"),
        projectId: tl.getVariable("system.teamProjectId")
      }
    });
    this.applicationInsightsClient.flush();
  }

  public static trackExcepiton(taskName: string, err: any) {
    this.applicationInsightsClient.trackException({ exception: err });

    let taskType = tl.getVariable("Release.ReleaseId")
      ? "Release Task"
      : "Build Task";

    this.applicationInsightsClient.trackEvent({
      name: "Task Execution",
      properties: {
        failed: "true",
        taskType: taskType,
        task: taskName,
        collection: tl.getVariable("system.collectionId"),
        projectId: tl.getVariable("system.teamProjectId")
      }
    });

    this.applicationInsightsClient.flush();
  }
}
