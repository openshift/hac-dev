import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
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
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { ApplicationGroupVersionKind, ComponentGroupVersionKind } from '../../models';
import { ApplicationKind, ComponentKind } from '../../types';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import PageLayout from '../PageLayout/PageLayout';
import ComponentListView from './ComponentListView';

const GETTING_STARTED_CARD_KEY = 'application-details-getting-started';

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
      <GettingStartedCard
        imgClassName="pf-u-w-25 pf-u-px-4xl"
        localStorageKey={GETTING_STARTED_CARD_KEY}
        title="Manage you applications"
        imgSrc={imageUrl}
        imgAlt="Illustration showing users managing applications"
      >
        Add new components to the development environment. You can automatically or manually deploy
        components to an environment and promote components between environments.
      </GettingStartedCard>
      <PageLayout
        breadcrumbs={[
          { path: '/app-studio/applications', name: 'Applications' },
          {
            path: `/app-studio/applications/:${application?.metadata?.name}`,
            name: application?.spec?.displayName,
          },
        ]}
        title={application?.spec?.displayName}
        description={
          <>
            Use this application view to access logs and promote your components.{' '}
            <HelpTopicLink topicId="app-view">Learn more</HelpTopicLink>
          </>
        }
      >
        <PageSection isFilled>
          {!componentsLoaded ? loading : filteredComponents.length > 0 ? componentList : emptyState}
        </PageSection>
      </PageLayout>
    </React.Fragment>
  );
};

export default ApplicationDetailsView;
