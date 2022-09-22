import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { ApplicationGroupVersionKind } from '../../models';
import { HttpError } from '../../shared/utils/error/http-error';
import { ApplicationKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import { ComponentDetails } from '../ComponentsListView/ComponentDetails';
import { ApplicationEnvironmentCards } from '../Environment/ApplicationEnvironmentCards';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import PageLayout from '../PageLayout/PageLayout';

const GETTING_STARTED_CARD_KEY = 'application-details-getting-started';

type ApplicationViewProps = {
  applicationName: string;
};

const ApplicationDetailsView: React.FunctionComponent<ApplicationViewProps> = ({
  applicationName,
}) => {
  const namespace = useNamespace();
  const showModal = useModalLauncher();
  const navigate = useNavigate();

  const resource = React.useMemo(() => {
    return {
      groupVersionKind: ApplicationGroupVersionKind,
      name: applicationName,
      namespace,
    };
  }, [applicationName, namespace]);

  const [application, applicationsLoaded, applicationError] =
    useK8sWatchResource<ApplicationKind>(resource);

  const actions = React.useMemo(
    () => [
      {
        id: 'add-component-header-action',
        label: 'Add component',
        cta: { href: `/app-studio/import?application=${applicationName}` },
      },
      {
        id: 'delete-application-header-action',
        label: 'Delete application',
        cta: () =>
          showModal<{ submitClicked: boolean }>(applicationDeleteModal(application)).closed.then(
            ({ submitClicked }) => {
              if (submitClicked) navigate('/app-studio');
            },
          ),
      },
    ],
    [application, applicationName, navigate, showModal],
  );

  const navigateToEnvironment = (environmentName: string) => {
    navigate(`/app-studio/applications/${applicationName}/environments/${environmentName}`);
  };

  const loading = (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );

  if (!applicationsLoaded && !applicationError) {
    return loading;
  }

  if (applicationError) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon color={redColor.value} icon={ExclamationCircleIcon} />
          <Title headingLevel="h4" size="lg">
            Application loading error
          </Title>
          <EmptyStateBody>{(applicationError as HttpError).message}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  return (
    <React.Fragment>
      <GettingStartedCard
        imgClassName="pf-u-px-2xl-on-xl"
        localStorageKey={GETTING_STARTED_CARD_KEY}
        title="Manage your applications"
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
        actions={actions}
      >
        <PageSection>
          <ApplicationEnvironmentCards onSelect={navigateToEnvironment} />
        </PageSection>
        <ComponentDetails application={application} />
      </PageLayout>
    </React.Fragment>
  );
};

export default ApplicationDetailsView;
