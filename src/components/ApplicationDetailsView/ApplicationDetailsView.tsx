import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  Divider,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { ApplicationGroupVersionKind } from '../../models';
import { ApplicationKind } from '../../types';
import { ApplicationEnvironmentCards } from '../Environment/ApplicationEnvironmentCards';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';
import { useNamespace } from '../NamespacedPage/NamespacedPage';
import { OutlinedHelpPopperIcon } from '../OutlinedHelpTooltipIcon';
import PageLayout from '../PageLayout/PageLayout';
import { ComponentCard } from './ComponentCard';
import { ComponentDetails } from './ComponentDetails';

const GETTING_STARTED_CARD_KEY = 'application-details-getting-started';

type ApplicationViewProps = {
  applicationName: string;
};

const ApplicationDetailsView: React.FunctionComponent<ApplicationViewProps> = ({
  applicationName,
}) => {
  const { namespace } = useNamespace();
  const showModal = useModalLauncher();
  const navigate = useNavigate();

  const [cardsExpanded, setCardExpanded] = React.useState<boolean>(true);

  const resource = React.useMemo(() => {
    return {
      groupVersionKind: ApplicationGroupVersionKind,
      name: applicationName,
      namespace,
    };
  }, [applicationName, namespace]);

  const [application, applicationsLoaded] = useK8sWatchResource<ApplicationKind>(resource);

  const actions = React.useMemo(
    () => [
      {
        id: 'add-component-header-action',
        label: 'Add Component',
        cta: { href: `/app-studio/import?application=${applicationName}` },
      },
      {
        id: 'delete-application-header-action',
        label: 'Delete Application',
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

  const loading = (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );

  if (!applicationsLoaded) {
    return loading;
  }

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
        actions={actions}
      >
        <PageSection>
          <Flex>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <b>Application components:</b>
                {'  '}
                <OutlinedHelpPopperIcon
                  heading="Application components"
                  content="Manage and add components from the components detail view. Note: Components from code repositories are rebuilt to capture the latest code changes. These updates will deploy to your development environment based on your deployment strategy."
                />
              </FlexItem>
              <FlexItem>
                <ComponentCard applicationName={applicationName} isExpanded={cardsExpanded} />
              </FlexItem>
            </Flex>
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
                <FlexItem align={{ default: 'alignRight' }}>
                  <Button
                    onClick={() => setCardExpanded((e) => !e)}
                    variant="link"
                    isInline
                    style={{ textDecoration: 'none' }}
                  >
                    {cardsExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </FlexItem>
              </Flex>
              <Flex>
                <ApplicationEnvironmentCards isExpanded={cardsExpanded} />
              </Flex>
            </Flex>
          </Flex>
        </PageSection>
        <ComponentDetails application={application} />
      </PageLayout>
    </React.Fragment>
  );
};

export default ApplicationDetailsView;
