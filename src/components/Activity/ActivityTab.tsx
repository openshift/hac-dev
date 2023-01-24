import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, TabTitleText, Title } from '@patternfly/react-core';
import CommitsTab from '../ApplicationDetails/tabs/CommitsTab';
import PipelineRunsTab from '../ApplicationDetails/tabs/PipelineRunsTab';

import './ActivityTab.scss';

export const ActivityTab: React.FC<{ applicationName?: string }> = ({ applicationName }) => {
  const params = useParams();
  const { activeTab: parentTab, activity: activeTab } = params;

  const navigate = useNavigate();
  const setActiveTab = React.useCallback(
    (newTab: string) => {
      if (activeTab !== newTab) {
        navigate(`/stonesoup/applications/${applicationName}/${parentTab}/${newTab}`);
      }
    },
    [applicationName, activeTab, navigate, parentTab],
  );

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
        activeKey={activeTab || 'latest-commits'}
        onSelect={(_, k: string) => {
          setActiveTab(k);
        }}
        unmountOnExit
      >
        <Tab
          data-testid={`activity__tabItem latest-commits`}
          title={<TabTitleText>Latest commits</TabTitleText>}
          key="latest-commits"
          eventKey="latest-commits"
          className="activity-tab"
        >
          <CommitsTab applicationName={applicationName} />
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
