import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
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
import { ComponentGroupVersionKind } from '../../../models';
import { ComponentKind } from '../../../types';
import ComponentListView from '../../Components/ComponentListView';

type ComponentTabProps = {
  applicationName: string;
  namespace: string;
};

const ComponentsTab: React.FC<ComponentTabProps> = ({ applicationName, namespace }) => {
  const [components, componentsLoaded] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });

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
