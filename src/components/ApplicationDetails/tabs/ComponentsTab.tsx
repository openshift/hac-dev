import * as React from 'react';
import ComponentListView from '../../Components/ComponentListView';

type ComponentTabProps = {
  applicationName: string;
};

const ComponentsTab: React.FC<React.PropsWithChildren<ComponentTabProps>> = ({
  applicationName,
}) => <ComponentListView applicationName={applicationName} />;

export default ComponentsTab;
