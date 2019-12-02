import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { Button } from "azure-devops-ui/Button";
import { TextField } from "azure-devops-ui/TextField";
import { Card } from "azure-devops-ui/Card";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";

const stats = [
  {
    label: "Name",
    value: "Inspections",
  },
  {
    label: "Pull Request Pipeline",
    value: "Scratch Org Based",
  },
  {
    label: "Packaging Pipeline",
    value: "Source Based",
  },
  {
    label: "Release Pipeline",
    value: "Source Based"
  }
];



export class ProjectTab extends React.Component<{}> {


  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  private commandBar: IHeaderCommandBarItem[] = [
    {
      iconProps: {
        iconName: "Add"
      },
      id: "addProject",
      important: true,
      onActivate: () => {
        //How to add a new project?
        alert("This would normally trigger a modal popup");
      },
      text: "Add",
      tooltipProps: {
        text: "Custom tooltip for create"
      }
    },
    {
      iconProps: {
        iconName: "Delete"
      },
      id: "deleteProject",
      important: true,
      onActivate: () => {
        alert("submenu clicked");
      },
      text: "Delete"
    }
  ];


  
  public componentDidMount() {
    this.initializeState();
  }

  private async initializeState(): Promise<void> {
    await SDK.ready();
    const accessToken = await SDK.getAccessToken();

    //Magic here
  }

  public render(): JSX.Element {
    //https://developer.microsoft.com/en-us/azure-devops/components/card#advanced-card

    return (
      <Page>
        <Header
          title={"Projects"}
          commandBarItems={this.commandBar}
          titleSize={TitleSize.Medium}
          titleIconProps={{ iconName: "OpenSource" }}
        />

        <div className="page-content page-content-top flex-row rhythm-horizontal-16">
          <Card
            className="flex-grow"
            titleProps={{ text: "Code Analysis : <<Inspections>>" }}
          >
            <div className="flex-row" style={{ flexWrap: "wrap" }}>
              {stats.map((items, index) => (
                <div
                  className="flex-column"
                  style={{ minWidth: "180px" }}
                  key={index}
                >
                  <div className="body-m secondary-text">{items.label}</div>
                  <div className="body-m primary-text">{items.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Page>
    );
  }
}
