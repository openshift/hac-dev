import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  Bullseye,
  Spinner,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { OutlinedFileImageIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-file-image-icon';
import { useComponents } from '../../../hooks/useComponents';
import ComponentListView from '../../Components/ComponentListView';

type ComponentTabProps = {
  applicationName: string;
  namespace: string;
};

const ComponentsTab: React.FC<ComponentTabProps> = ({ applicationName, namespace }) => {
  const [components, componentsLoaded] = useComponents(namespace, applicationName);

  const filteredComponents = React.useMemo(
    () =>
      componentsLoaded ? components?.filter((c) => c.spec.application === applicationName) : [],
    [components, applicationName, componentsLoaded],
  );

  const componentList = (
    <ComponentListView applicationName={applicationName} components={filteredComponents} />
  );
  const loading = (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );

  const emptyState = (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={OutlinedFileImageIcon} />
      <Title headingLevel="h4" size="lg">
        No components
      </Title>
      <EmptyStateBody>To get started, add a component to your application.</EmptyStateBody>
      <Button
        variant="primary"
        component={(props) => (
          <Link {...props} to={`/stonesoup/import?application=${applicationName}`} />
        )}
      >
        Add component
      </Button>
    </EmptyState>
  );

  return !componentsLoaded ? loading : filteredComponents.length > 0 ? componentList : emptyState;
};

export default ComponentsTab;
