import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { PageSection, PageSectionVariants, Text, Title } from '@patternfly/react-core';
import EnvironmentListView from '../components/Environment/EnvironmentListView';
import { GettingStartedCard } from '../components/GettingStartedCard/GettingStartedCard';
import { HelpTopicLink } from '../components/HelpTopicLink/HelpTopicLink';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import HacbsEnvironmentListView from '../hacbs/components/Environment/EnvironmentListView';
import { EnvironmentType } from '../hacbs/components/Environment/utils';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import imageUrl from '../imgs/getting-started-illustration.svg';

import './WorkspaceSettingsPage.scss';

const GETTING_STARTED_CARD_KEY = 'environments-list-getting-started-card';

const WorkspaceSettingsPage: React.FC = () => {
  useQuickstartCloseOnUnmount();
  const [hacbs] = useFeatureFlag(HACBS_FLAG);
  return (
    <NamespacedPage>
      <Helmet>
        <title>Workspace settings page</title>
      </Helmet>
      <GettingStartedCard
        imgClassName="pf-u-px-md-on-xl pf-u-min-width workspace-settings-page__card-img"
        localStorageKey={GETTING_STARTED_CARD_KEY}
        title="Manage your workspace settings"
        imgSrc={imageUrl}
        imgAlt="Illustration showing users managing workspace settings"
      >
        Environments | Manage the continuous delivery process for your applications with
        environments. An environment is an abstraction of infrastructure used to define a continuous
        delivery order and manage application components between orders. Define if application
        component updates will be manually or automatically promoted to environments, and if changes
        wil be manually or automatically deployed.
        <br />
        <br />
        Users | Connect with your teammates and invite new users to join your workspace. We defined
        default roles with permissions and tasks to make collaboration easier, but you can customize
        all roles to meet the needs of your team.
      </GettingStartedCard>
      <PageLayout title="Settings">
        <PageSection variant={PageSectionVariants.light} isFilled>
          <Title headingLevel="h3">Environments</Title>
          <Text component="p">
            Manage the continuous delivery process for your applications with environments.{' '}
            <HelpTopicLink topicId="settings">Learn more</HelpTopicLink>
          </Text>
          {hacbs ? (
            <HacbsEnvironmentListView
              validTypes={[EnvironmentType.static, EnvironmentType.managed]}
            />
          ) : (
            <EnvironmentListView />
          )}
        </PageSection>
      </PageLayout>
    </NamespacedPage>
  );
};

export default WorkspaceSettingsPage;
