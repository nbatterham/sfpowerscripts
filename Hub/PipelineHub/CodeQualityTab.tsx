import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { Button } from "azure-devops-ui/Button";
import { TextField } from "azure-devops-ui/TextField";
import { Card } from "azure-devops-ui/Card";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";

const stats = [
  {
    label: "Code Coverage",
    value: 68,
    trent : 1
  },
  {
    label: "Minor Bugs",
    value: 20,
    trent : 1
  },
  {
    label: "Major",
    value: 3,
    trent : 1
  },
  {
    label: "Critical",
    value: 5,
    trent : -1
  }
];

const commandBarItemsSimple: IHeaderCommandBarItem[] = [
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
    text: "Action",
    tooltipProps: {
      text: "Custom tooltip for create"
    }
  },
  {
    iconProps: {
      iconName: "Delete"
    },
    id: "deleteProject",
    important: false,
    onActivate: () => {
      alert("submenu clicked");
    },
    text: "Menu row with delete icon"
  }
];

export class CodeQualityTab extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

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
      <div className="page-content page-content-top flex-row rhythm-horizontal-16">
        <Header
          title={"Projects"}
          commandBarItems={commandBarItemsSimple}
          titleSize={TitleSize.Medium}
          titleIconProps={{ iconName: "OpenSource" }}
        />


        // Need to create cards as much as we can 
        
        <Card
          className="flex-grow"
          titleProps={{ text: "Code Analysis : <<Inspections>>" }}
        >
          <div className="flex-row" style={{ flexWrap: "wrap" }}>
            {stats.map((items, index) => (
              <div
                className="flex-column"
                style={{ minWidth: "120px" }}
                key={index}
              >
                <div className="body-m secondary-text">{items.label}</div>
                <div className="body-m primary-text">{items.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
}
