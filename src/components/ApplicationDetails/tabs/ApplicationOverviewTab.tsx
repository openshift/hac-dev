import * as React from 'react';
import AppRecentCommits from '../../Commits/AppRecentCommits';
import AppWorkflowSection from './overview/sections/AppWorkflowSection';

type ApplicationOverviewTabProps = {
  applicationName: string;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ applicationName }) => {
  return (
    <>
      <AppWorkflowSection applicationName={applicationName} />
      <AppRecentCommits applicationName={applicationName} />
    </>
  );
};

export default ApplicationOverviewTab;
