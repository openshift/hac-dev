import * as React from 'react';
import { Commit } from '../../../types';

type ApplicationOverviewTabProps = {
  commit: Commit;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ commit }) => {
  return <>PLR of{commit.sha}</>;
};

export default ApplicationOverviewTab;
