import * as React from 'react';
import EnvironmentListView from '../../../hacbs/components/Environment/EnvironmentListView';

type EnvironmentsTabProps = {
  applicationName?: string;
};

const EnvironmentsTab: React.FC<EnvironmentsTabProps> = ({ applicationName }) => (
  <EnvironmentListView applicationName={applicationName} />
);

export default EnvironmentsTab;
