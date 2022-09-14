import React from 'react';
import { Tab, TabTitleText } from '@patternfly/react-core';
import {
  default as BaseWorkspaceSettings,
  GettingStartedWithEnvironments,
  GettingStartedWithUsers,
} from '../../../components/WorkspaceSettings/WorkspaceSettings';
import EnterpriseContractView from '../EnterpriseContractView/EnterpriseContractView';
import HacbsEnvironmentListView from '../Environment/EnvironmentListView';
import { EnvironmentType } from '../Environment/utils';

const WorkspaceSettings: React.FC = () => {
  return (
    <BaseWorkspaceSettings
      gettingStartedSections={[
        GettingStartedWithEnvironments,
        GettingStartedWithUsers,
        <>
          Enterprise Contract | An Enterprise Contract (EC) is a set of release policies applied to
          your release target, also known as a managed environment. All your builds are checked
          against these release policies so that you know if you need to make changes to your
          application before releasing it to the customers.
        </>,
      ]}
      environmentsView={
        <HacbsEnvironmentListView validTypes={[EnvironmentType.static, EnvironmentType.managed]} />
      }
      tabs={[
        <Tab
          key="enterprise-contract"
          eventKey="enterprise-contract"
          title={<TabTitleText>Enterprise Contract</TabTitleText>}
        >
          <EnterpriseContractView />
        </Tab>,
      ]}
    />
  );
};

export default WorkspaceSettings;
