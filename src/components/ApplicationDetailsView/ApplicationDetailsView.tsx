import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { ApplicationGroupVersionKind, ComponentGroupVersionKind } from '../../models';
import { ApplicationKind, ComponentKind } from '../../types';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import PageLayout from '../PageLayout/PageLayout';
import ComponentListView from './ComponentListView';

type ApplicationViewProps = {
  applicationName: string;
};

const ApplicationDetailsView: React.FunctionComponent<ApplicationViewProps> = ({
  applicationName,
}) => {
  const { namespace } = React.useContext(NamespaceContext);

  const [application, applicationsLoaded] = useK8sWatchResource<ApplicationKind>({
    groupVersionKind: ApplicationGroupVersionKind,
    name: applicationName,
    namespace,
  });

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

  const loading = (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );

  if (!applicationsLoaded) {
    return loading;
  }

  const emptyState = (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        No components
      </Title>
      <EmptyStateBody>To get started, add a component to your application.</EmptyStateBody>
      <Button
        variant="primary"
        component={(props) => (
          <Link {...props} to={`/app-studio/import?application=${application?.metadata?.name}`} />
        )}
      >
        Add component
      </Button>
    </EmptyState>
  );

  const componentList = (
    <ComponentListView applicationName={applicationName} components={filteredComponents} />
  );

  return (
    <React.Fragment>
      <PageLayout
        breadcrumbs={[
          { path: '/app-studio/applications', name: 'Applications' },
          {
            path: `/app-studio/applications/:${application?.metadata?.name}`,
            name: application?.spec?.displayName,
          },
        ]}
        title={application?.spec?.displayName}
      >
        <PageSection isFilled>
          {!componentsLoaded ? loading : filteredComponents.length > 0 ? componentList : emptyState}
        </PageSection>
      </PageLayout>
    </React.Fragment>
  );
};

export default ApplicationDetailsView;
