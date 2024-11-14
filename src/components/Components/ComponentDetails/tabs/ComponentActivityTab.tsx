import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { useLocalStorage } from '../../../../hooks/useLocalStorage';
import DetailsSection from '../../../../shared/components/details-page/DetailsSection';
import { ComponentKind, PipelineRunKind } from '../../../../types';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import PipelineRunsTab from '../../../ApplicationDetails/tabs/PipelineRunsTab';
import CommitsListView from '../../../Commits/CommitsListView';

export const ACTIVITY_SECONDARY_TAB_KEY = 'activity-secondary-tab';

type ComponentActivityTabProps = {
  component: ComponentKind;
};

export const ComponentActivityTab: React.FC<React.PropsWithChildren<ComponentActivityTabProps>> = ({
  component,
}) => {
  const params = useParams();
  const { workspace } = useWorkspaceInfo();
  const applicationName = component.spec.application;
  const { activeTab: parentTab, compActivity: activeTab } = params;
  const [lastSelectedTab, setLocalStorageItem] = useLocalStorage<string>(
    `${component ? `${component.metadata.name}_` : ''}${ACTIVITY_SECONDARY_TAB_KEY}`,
  );
  const currentTab = activeTab || lastSelectedTab || 'latest-commits';
  const navigate = useNavigate();
  const setActiveTab = React.useCallback(
    (newTab: string) => {
      if (currentTab !== newTab) {
        navigate(
          `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components/${component.metadata.name}/${parentTab}/${newTab}`,
        );
      }
    },
    [applicationName, component.metadata.name, currentTab, navigate, parentTab, workspace],
  );

  React.useEffect(() => {
    if (activeTab !== lastSelectedTab) {
      setLocalStorageItem(currentTab);
    }
  }, [activeTab, lastSelectedTab, currentTab, setLocalStorageItem]);

  React.useEffect(() => {
    if (!activeTab && lastSelectedTab) {
      navigate(
        `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components/${component.metadata.name}/${parentTab}/${lastSelectedTab}`,
        { replace: true },
      );
    }
  }, [
    activeTab,
    applicationName,
    component.metadata.name,
    lastSelectedTab,
    navigate,
    parentTab,
    workspace,
  ]);

  // We will not include any test pipelines that were run against the snapshot that contained the image.
  // If there is such a test pipeline directly run on the image itself, and not on the snapshot, then we want to include it
  const nonTestSnapShotFilter = (plr: PipelineRunKind) =>
    plr.metadata.labels?.[PipelineRunLabel.PIPELINE_TYPE] !== 'test' ||
    !plr.spec.params?.find((p) => p.name === 'SNAPSHOT');

  return (
    <div>
      <DetailsSection
        title="Activity"
        description="Monitor CI/CD activity for this component. Each item in the list represents a process that was started by a user, generated a snapshot, and released."
      >
        <Tabs
          style={{
            width: 'fit-content',
            marginBottom: 'var(--pf-v5-global--spacer--md)',
          }}
          activeKey={currentTab}
          onSelect={(_, k: string) => {
            setActiveTab(k);
          }}
          data-testid="activities-tabs-id"
          unmountOnExit
        >
          <Tab
            data-testid={`comp__activity__tabItem commits`}
            title={<TabTitleText>Commits</TabTitleText>}
            key="commits"
            eventKey="latest-commits"
            className="activity-tab"
          >
            <CommitsListView
              applicationName={applicationName}
              componentName={component.spec.componentName}
            />
          </Tab>
          <Tab
            data-testid={`comp__activity__tabItem pipelineruns`}
            title={<TabTitleText>Pipeline runs</TabTitleText>}
            key="pipelineruns"
            eventKey="pipelineruns"
            className="activity-tab"
          >
            <PipelineRunsTab
              applicationName={applicationName}
              componentName={component.spec.componentName}
              customFilter={nonTestSnapShotFilter}
            />
          </Tab>
        </Tabs>
      </DetailsSection>
    </div>
  );
};

export default React.memo(ComponentActivityTab);
