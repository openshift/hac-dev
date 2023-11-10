import * as React from 'react';
import WhatsNextSection from '../../WhatsNext/WhatsNextSection';
import AppWorkflowSection from './overview/sections/AppWorkflowSection';
import { useWhatsNextItems } from './useWhatsNextItems';

type ApplicationOverviewTabProps = {
  applicationName: string;
};

const ApplicationOverviewTab: React.FC<React.PropsWithChildren<ApplicationOverviewTabProps>> = ({
  applicationName,
}) => {
  const whatsNextItems = useWhatsNextItems(applicationName);
  return (
    <>
      <AppWorkflowSection applicationName={applicationName} />
      <WhatsNextSection whatsNextItems={whatsNextItems} />
    </>
  );
};

export default ApplicationOverviewTab;
