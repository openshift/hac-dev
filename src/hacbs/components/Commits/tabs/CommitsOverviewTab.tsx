import * as React from 'react';
import { Commit } from '../../../types';

type ApplicationOverviewTabProps = {
  commit: Commit;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ commit }) => {
  return <>Overview of {commit.sha.slice(0, 7)}</>;
};

export default ApplicationOverviewTab;
