import * as React from 'react';
import CommitsListView from '../../Commits/CommitsListView';
import WhatsNextSection from '../../WhatsNext/WhatsNextSection';
import AppWorkflowSection from './overview/sections/AppWorkflowSection';
import { useWhatsNextItems } from './useWhatsNextItems';

type ApplicationOverviewTabProps = {
  applicationName: string;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ applicationName }) => {
  const whatsNextItems = useWhatsNextItems(applicationName);
  return (
    <>
      <AppWorkflowSection applicationName={applicationName} />
      <CommitsListView applicationName={applicationName} recentOnly />
      <WhatsNextSection whatsNextItems={whatsNextItems} />
    </>
  );
};

export default ApplicationOverviewTab;
