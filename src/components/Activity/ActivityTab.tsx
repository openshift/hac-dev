import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, TabTitleText, Title } from '@patternfly/react-core';
import { useLocalStorage } from '../../hooks';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import PipelineRunsTab from '../ApplicationDetails/tabs/PipelineRunsTab';
import CommitsListView from '../Commits/CommitsListView';

import './ActivityTab.scss';

export const ACTIVITY_SECONDARY_TAB_KEY = 'activity-secondary-tab';

export const ActivityTab: React.FC<{ applicationName?: string }> = ({ applicationName }) => {
  const params = useParams();
  const { workspace } = useWorkspaceInfo();
  const { activeTab: parentTab, activity: activeTab } = params;
  const [lastSelectedTab, setLocalStorageItem] = useLocalStorage<string>(
    ACTIVITY_SECONDARY_TAB_KEY,
  );
  const currentTab = activeTab || lastSelectedTab || 'latest-commits';

  const navigate = useNavigate();
  const setActiveTab = React.useCallback(
    (newTab: string) => {
      if (currentTab !== newTab) {
        navigate(
          `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/${parentTab}/${newTab}`,
        );
      }
    },
    [applicationName, currentTab, navigate, parentTab, workspace],
  );

  React.useEffect(() => {
    if (activeTab !== lastSelectedTab) {
      setLocalStorageItem(currentTab);
    }
  }, [activeTab, lastSelectedTab, currentTab, setLocalStorageItem]);

  React.useEffect(() => {
    if (!activeTab && lastSelectedTab) {
      navigate(
        `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/${parentTab}/${lastSelectedTab}`,
        { replace: true },
      );
    }
  }, [activeTab, applicationName, lastSelectedTab, navigate, parentTab, workspace]);

  return (
    <>
      <Title size="xl" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
        Activity By
      </Title>
      <Tabs
        style={{
          width: 'fit-content',
          marginBottom: 'var(--pf-global--spacer--md)',
        }}
        activeKey={currentTab}
        onSelect={(_, k: string) => {
          setActiveTab(k);
        }}
        data-testid="activities-tabs-id"
        unmountOnExit
      >
        <Tab
          data-testid={`activity__tabItem latest-commits`}
          title={<TabTitleText>Latest commits</TabTitleText>}
          key="latest-commits"
          eventKey="latest-commits"
          className="activity-tab"
        >
          <CommitsListView applicationName={applicationName} />
        </Tab>
        <Tab
          data-testid={`activity__tabItem pipelineruns`}
          title={<TabTitleText>Pipeline runs</TabTitleText>}
          key="pipelineruns"
          eventKey="pipelineruns"
          className="activity-tab"
        >
          <PipelineRunsTab applicationName={applicationName} />
        </Tab>
      </Tabs>
    </>
  );
};
