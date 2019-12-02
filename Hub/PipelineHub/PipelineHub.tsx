import "./PipelineHub.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";

import { OverviewTab } from "./OverviewTab"; 
import { EnvironmentTab } from "./EnvironmentTab";
import { CodeQualityTab } from "./CodeQualityTab";
import { SupportTab } from "./SupportTab";
import { showRootComponent } from "./Common";
import { ProjectTab } from "./ProjectTab";

interface IHubContentState {
    selectedTabId: string;
    fullScreenMode: boolean;
    headerDescription?: string;
    useLargeTitle?: boolean;
    useCompactPivots?: boolean;
}

class HubContent extends React.Component<{}, IHubContentState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            selectedTabId: "overview",
            fullScreenMode: false
        };
    }

    public componentDidMount() {
        SDK.init();
        this.initializeFullScreenState();
    }

    public render(): JSX.Element {

        const { selectedTabId, headerDescription, useCompactPivots, useLargeTitle } = this.state;

        return (
            <Page className="sfpowerscripts-hub flex-grow">

                <Header title="SFPowerscripts Hub"
                    description={headerDescription}
                    titleSize={useLargeTitle ? TitleSize.Large : TitleSize.Medium} />

                <TabBar
                    onSelectedTabChanged={this.onSelectedTabChanged}
                    selectedTabId={selectedTabId}
                    tabSize={useCompactPivots ? TabSize.Compact : TabSize.Tall}>

                    <Tab name="Overview" id="overview" />
                    <Tab name="Projects" id="projects" />
                    <Tab name="Code Quality" id="codequality" />
                    <Tab name="Environment" id="environment" />
                    <Tab name="Support" id="support" />
                </TabBar>

                { this.getPageContent() }
            </Page>
        );
    }

    private onSelectedTabChanged = (newTabId: string) => {
        this.setState({
            selectedTabId: newTabId
        })
    }

    private getPageContent() {
        const { selectedTabId } = this.state;
        if (selectedTabId === "overview") {
            return <OverviewTab />;
        }
        else if (selectedTabId === "project") {
            return <ProjectTab />;
        }
        else if (selectedTabId === "codequality") {
            return <CodeQualityTab />;
        }
        else if (selectedTabId === "environment") {
            return <EnvironmentTab />;
        }
        else if (selectedTabId === "support") {
            return <SupportTab />;
        }
    }


  
    private async initializeFullScreenState() {
        const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        const fullScreenMode = await layoutService.getFullScreenMode();
        if (fullScreenMode !== this.state.fullScreenMode) {
            this.setState({ fullScreenMode });
        }
    }


}

showRootComponent(<HubContent />);