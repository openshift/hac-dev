import React from 'react';
import EnterpriseContractView from '../../../components/EnterpriseContractView/EnterpriseContractView';
import { EnvironmentType } from '../../../components/Environment/environment-utils';
import {
  default as BaseWorkspaceSettings,
  GettingStartedWithEnvironments,
  GettingStartedWithUsers,
} from '../../../components/WorkspaceSettings/WorkspaceSettings';
import EnvironmentListView from '../Environment/EnvironmentListView';

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
        <EnvironmentListView validTypes={[EnvironmentType.static, EnvironmentType.managed]} />
      }
      tabs={[
        {
          key: 'enterprise-contract',
          title: 'Enterprise Contract',
          content: <EnterpriseContractView />,
        },
      ]}
    />
  );
};

export default WorkspaceSettings;
