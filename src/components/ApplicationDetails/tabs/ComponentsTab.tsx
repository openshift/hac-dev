import * as React from 'react';
import ComponentListView from '../../Components/ComponentListView';

type ComponentTabProps = {
  applicationName: string;
};

const ComponentsTab: React.FC<ComponentTabProps> = ({ applicationName }) => (
  <ComponentListView applicationName={applicationName} />
);

export default ComponentsTab;
