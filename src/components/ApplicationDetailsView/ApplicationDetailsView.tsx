import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Divider,
  EmptyStateVariant,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { AngleDoubleRightIcon } from '@patternfly/react-icons/dist/js/icons';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import { useSearchParam } from '../../hooks/useSearchParam';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { ApplicationGroupVersionKind } from '../../models';
import { HttpError } from '../../shared/utils/error/http-error';
import { ApplicationKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import { ApplicationEnvironmentDetailsView } from '../ApplicationEnvironment/ApplicationEnvironmentDetailsView';
import { ComponentDetails } from '../ComponentsListView/ComponentDetails';
import { ApplicationEnvironmentCards } from '../Environment/ApplicationEnvironmentCards';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import { OutlinedHelpPopperIcon } from '../OutlinedHelpTooltipIcon';
import PageLayout from '../PageLayout/PageLayout';
import { ApplicationSwitcher } from './ApplicationSwitcher';
import { ComponentCard } from './ComponentCard';

import './ApplicationDetailsView.scss';

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
  const [selectedEnvironment, setSelectedEnvironment, clearEnvironment] = useSearchParam(
    'environment',
    '',
  );
  const [cardsExpanded, setCardExpanded] = React.useState<boolean>(true);

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
        cta: { href: `/stonesoup/import?application=${applicationName}` },
      },
      {
        id: 'delete-application-header-action',
        label: 'Delete application',
        cta: () =>
          showModal<{ submitClicked: boolean }>(applicationDeleteModal(application)).closed.then(
            ({ submitClicked }) => {
              if (submitClicked) navigate('/stonesoup');
            },
          ),
      },
    ],
    [application, applicationName, navigate, showModal],
  );

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
          { path: '/stonesoup/applications', name: 'Applications' },
          {
            path: `/stonesoup/applications/${application?.metadata?.name}`,
            name: application?.spec?.displayName,
          },
        ]}
        breadcrumbItems={<ApplicationSwitcher selectedApplication={application?.metadata?.name} />}
        title={application?.spec?.displayName}
        description={
          <>
            Use this application view to access logs and promote your components.{' '}
            <HelpTopicLink topicId="app-view" isInline>
              Learn more
            </HelpTopicLink>
          </>
        }
        actions={actions}
      >
        <PageSection className="application-details pf-u-pt-sm pf-u-pb-0 pf-u-mb-sm">
          <Button
            className="application-details__collapse"
            data-test="app-details-card-collapse"
            onClick={() => setCardExpanded((e) => !e)}
            variant="link"
            isInline
            style={{ textDecoration: 'none' }}
          >
            {cardsExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Flex
            className="application-details__card-tabs pf-u-pb-xs"
            spaceItems={{ default: 'spaceItemsLg' }}
            alignItems={{ default: 'alignItemsCenter' }}
            flexWrap={{ default: 'nowrap' }}
          >
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              <FlexItem>
                <b>Application components:</b>
                {'  '}
                <OutlinedHelpPopperIcon
                  heading="Application components"
                  content="Manage and add components from the components detail view. Note: Components from code repositories are rebuilt to capture the latest code changes. These updates will deploy to your development environment based on your deployment strategy."
                />
              </FlexItem>
              <FlexItem>
                <ComponentCard
                  applicationName={applicationName}
                  isSelected={!selectedEnvironment}
                  isExpanded={cardsExpanded}
                  onSelect={() => clearEnvironment()}
                />
              </FlexItem>
            </Flex>
            <div className="application-details__env-indicator">
              <div className="application-details__env-indicator-icon">
                <AngleDoubleRightIcon />
              </div>
            </div>
            <Divider isVertical />
            <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
              <Flex>
                <FlexItem>
                  <b>Environments:</b>
                  {'  '}
                  <OutlinedHelpPopperIcon
                    heading="Application environments"
                    content="View components and their settings as deployed to environments. Component updates can be promoted between environments. Additional environments can be added via the workspace."
                  />
                </FlexItem>
              </Flex>
              <ApplicationEnvironmentCards
                applicationName={applicationName}
                onSelect={(environmentName) => setSelectedEnvironment(environmentName)}
                cardsExpanded={cardsExpanded}
                selectedEnvironment={selectedEnvironment}
              />
            </Flex>
          </Flex>
        </PageSection>
        {selectedEnvironment ? (
          <ApplicationEnvironmentDetailsView
            applicationName={applicationName}
            environmentName={selectedEnvironment}
          />
        ) : (
          <ComponentDetails application={application} />
        )}
      </PageLayout>
    </React.Fragment>
  );
};

export default ApplicationDetailsView;
