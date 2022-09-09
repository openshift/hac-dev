import * as React from 'react';
import { Commit } from '../../../types';
import { getCommitDisplayName } from '../../../utils/commits-utils';

type ApplicationOverviewTabProps = {
  commit: Commit;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ commit }) => {
  return <>Overview of {getCommitDisplayName(commit)}</>;
};

export default ApplicationOverviewTab;
