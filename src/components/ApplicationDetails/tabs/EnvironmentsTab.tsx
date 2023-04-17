import * as React from 'react';
import { Text, Title } from '@patternfly/react-core';
import EnvironmentListView from '../../Environment/EnvironmentListView';

type EnvironmentsTabProps = {
  applicationName?: string;
};

const EnvironmentsTab: React.FC<EnvironmentsTabProps> = ({ applicationName }) => (
  <>
    <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
      Environments
    </Title>
    <Text className="pf-u-mb-lg">
      An environment is a set of compute resources that you can use to develop, test, and stage your
      applications. You can share static environments across all applications in the workspace.
    </Text>
    <EnvironmentListView applicationName={applicationName} />
  </>
);

export default EnvironmentsTab;
