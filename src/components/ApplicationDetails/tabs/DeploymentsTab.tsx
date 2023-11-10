import * as React from 'react';
import { Text, Title } from '@patternfly/react-core';
import EnvironmentListView from '../../Environment/EnvironmentListView';

type DeploymentsTabProps = {
  applicationName?: string;
};

const DeploymentsTab: React.FC<React.PropsWithChildren<DeploymentsTabProps>> = ({
  applicationName,
}) => (
  <>
    <Title size="lg" headingLevel="h3" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-sm">
      Deployments
    </Title>
    <Text className="pf-v5-u-mb-lg">
      Manage snapshots and their deployment to environments. An environment is a set of compute
      resources that you can use to develop, test and stage your application. A snapshot is a set of
      all recent builds, automatically created on every new build.
    </Text>
    <EnvironmentListView applicationName={applicationName} />
  </>
);

export default DeploymentsTab;
