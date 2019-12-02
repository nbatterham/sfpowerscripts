import * as React from "react";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { ISimpleListCell, ListSelection } from "azure-devops-ui/List";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
  renderSimpleCell,
  ColumnFill,
  Table
} from "azure-devops-ui/Table";
import { Card } from "azure-devops-ui/Card";

const commandBarItems: IHeaderCommandBarItem[] = [
  {
    id: "deleteEnv",
    text: "Delete",
    onActivate: () => {
      alert("Example text");
    },
    iconProps: {
      iconName: "Delete"
    }
  },
  {
    important: true,
    id: "addEnv",
    text: "Add",
    onActivate: () => {
      alert("This would normally trigger a modal popup");
    },
    iconProps: {
      iconName: "Add"
    },
    isPrimary: true,
    tooltipProps: {
      text: "This is the tooltip"
    }
  }
];

interface ITableItem {
  name: ISimpleListCell;
  sandbox: string;
  pipelines: string;
}

function onSizeSizable(event: MouseEvent, index: number, width: number) {
  (sizableColumns[index].width as ObservableValue<number>).value = width;
}

const sizableColumns = [
  {
    id: "name",
    name: "Name",
    minWidth: 50,
    width: new ObservableValue(300),
    renderCell: renderSimpleCell,
    onSize: onSizeSizable
  },
  {
    id: "sandbox",
    name: "Sandbox",
    maxWidth: 300,
    width: new ObservableValue(200),
    renderCell: renderSimpleCell,
    onSize: onSizeSizable
  },
  {
    id: "pipelines",
    name: "Associated Pipelines",
    width: new ObservableValue(300),
    renderCell: renderSimpleCell
  },
  ColumnFill
];

const tableItems = new ArrayItemProvider<ITableItem>([
  {
    name: { iconProps: { iconName: "Home" }, text: "ST-Lic" },
    sandbox: "wsvstlic",
    pipelines: "Licensing,Core,Commons,Utils"
  },
  {
    name: { iconProps: { iconName: "Home" }, text: "ST-Ins" },
    sandbox: "wsvstins",
    pipelines: "Inspections,Core,Commons,Utils"
  },
  {
    name: { iconProps: { iconName: "Home" }, text: "ST-Commons" },
    sandbox: "wsvstcom",
    pipelines: "Core,Commons"
  }
]);

export class EnvironmentTab extends React.Component<{}> {

  private selection = new ListSelection(true);

  
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.initialize();
  }

  public render(): JSX.Element {
    return (
      <div className="page-content page-content-top flex-column rhythm-vertical-16">
        <Card
          className="flex-grow bolt-table-card"
          titleProps={{ text: "Environments" }}
          headerCommandBarItems={commandBarItems}
        >
          <Table<Partial<ITableItem>>
            columns={sizableColumns}
            itemProvider={tableItems}
            selection={this.selection}
            onSelect={(event, data) =>
              console.log("Select Row - " + data.index)
            }
          />
        </Card>
      </div>
    );
  }

  private async initialize() {}
}
