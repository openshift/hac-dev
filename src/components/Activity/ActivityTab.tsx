import * as React from 'react';
import { Tab, Tabs, TabTitleText, Title } from '@patternfly/react-core';
import CommitsTab from '../ApplicationDetails/tabs/CommitsTab';
import PipelineRunsTab from '../ApplicationDetails/tabs/PipelineRunsTab';

import './ActivityTab.scss';

export const ActivityTab: React.FC<{ applicationName?: string }> = ({ applicationName }) => {
  const [activeTab, setActiveTab] = React.useState('latest-commits');
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
        activeKey={activeTab}
        onSelect={(_, k: string) => {
          setActiveTab(k);
        }}
        unmountOnExit
      >
        <Tab
          title={<TabTitleText>Latest commits</TabTitleText>}
          key="latest-commits"
          eventKey="latest-commits"
          className="activity-tab"
        >
          <CommitsTab applicationName={applicationName} />
        </Tab>
        <Tab
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
