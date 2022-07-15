import * as React from 'react';
import AppWorkflowSection from './overview/sections/AppWorkflowSection';

type ApplicationOverviewTabProps = {
  applicationName: string;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ applicationName }) => {
  return <AppWorkflowSection applicationName={applicationName} />;
};

export default ApplicationOverviewTab;
