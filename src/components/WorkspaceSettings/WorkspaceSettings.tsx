import React from 'react';
import {
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
  Text,
} from '@patternfly/react-core';
import EnvironmentListView from '../../components/Environment/EnvironmentListView';
import { GettingStartedCard } from '../../components/GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../../components/HelpTopicLink/HelpTopicLink';
import PageLayout from '../../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../../hooks/useQuickstartCloseOnUnmount';
import { useSearchParam } from '../../hooks/useSearchParam';
import imageUrl from '../../imgs/getting-started-illustration.svg';

import './WorkspaceSettings.scss';

const GETTING_STARTED_CARD_KEY = 'environments-list-getting-started-card';

export const GettingStartedWithEnvironments = (
  <>
    Environments | Manage the continuous delivery process for your applications with environments.
    An environment is an abstraction of infrastructure used to define a continuous delivery order
    and manage application components between orders. Define if application component updates will
    be manually or automatically promoted to environments, and if changes wil be manually or
    automatically deployed.
  </>
);
export const GettingStartedWithUsers = (
  <>
    Users | Connect with your teammates and invite new users to join your workspace. We defined
    default roles with permissions and tasks to make collaboration easier, but you can customize all
    roles to meet the needs of your team.
  </>
);

export type WorkspaceSettingsProps = {
  gettingStartedSections?: React.ReactNode[];
  environmentsView?: React.ReactNode;
  tabs?: React.ReactNode[];
};

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  gettingStartedSections = [GettingStartedWithEnvironments, GettingStartedWithUsers],
  environmentsView = <EnvironmentListView />,
  tabs,
}) => {
  useQuickstartCloseOnUnmount();
  const [activeTabParam, setActiveTab] = useSearchParam('activeTab', '');
  const activeTab = activeTabParam || 'environments';

  const environments = (
    <>
      <Text component="p" className="pf-u-mt-lg">
        Manage the continuous delivery process for your applications with environments.{' '}
        <HelpTopicLink topicId="settings">Learn more</HelpTopicLink>
      </Text>
      {environmentsView}
    </>
  );
  return (
    <>
      <GettingStartedCard
        imgClassName="pf-u-px-md-on-xl pf-u-min-width workspace-settings__card-img"
        localStorageKey={GETTING_STARTED_CARD_KEY}
        title="Manage your workspace settings"
        imgSrc={imageUrl}
        imgAlt="Illustration showing users managing workspace settings"
        data-test="workspace-settings-getting-started"
      >
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          {gettingStartedSections.map((section, index) => (
            <FlexItem key={index}>{section}</FlexItem>
          ))}
        </Flex>
      </GettingStartedCard>
      <PageLayout title="Settings">
        <PageSection
          className="workspace-settings__content"
          variant={PageSectionVariants.light}
          isFilled
        >
          <Tabs
            data-test="workspace-settings__tabs"
            onSelect={(e, k: string) => {
              setActiveTab(k);
            }}
            activeKey={activeTab}
          >
            <Tab eventKey="environments" title={<TabTitleText>Environments</TabTitleText>}>
              {environments}
            </Tab>
            {...tabs}
          </Tabs>
        </PageSection>
      </PageLayout>
    </>
  );
};

export default WorkspaceSettings;
