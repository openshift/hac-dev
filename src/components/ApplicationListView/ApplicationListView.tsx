import * as React from 'react';
import { Link } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  Spinner,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { HACBS_FLAG } from '../../hacbs/hacbsFeatureFlag';
import { useApplications } from '../../hacbs/hooks/useApplications';
import emptyStateImgUrl from '../../imgs/application-list-empty.png';
import imageUrl from '../../imgs/getting-started-illustration.svg';
import { Table } from '../../shared';
import { ApplicationKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import { GettingStartedCard } from '../GettingStartedCard/GettingStartedCard';
import PageLayout from '../PageLayout/PageLayout';
import { ApplicationListHeader } from './ApplicationListHeader';
import ApplicationListRow from './ApplicationListRow';

const GETTING_STARTED_CARD_KEY = 'application-list-getting-started-card';

const EmptyStateImg = () => <img className="pf-u-w-33" src={emptyStateImgUrl} alt="" />;

const ApplicationListView: React.FC = () => {
  const [hacbs] = useFeatureFlag(HACBS_FLAG);
  const namespace = useNamespace();
  const [applications, loaded] = useApplications(namespace);
  applications?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      {!hacbs && applications.length === 0 && (
        <GettingStartedCard
          imgClassName="pf-u-px-2xl-on-xl"
          localStorageKey={GETTING_STARTED_CARD_KEY}
          title="Create and manage your applications"
          imgSrc={imageUrl}
          imgAlt="Illustration showing users managing applications"
        >
          Your application will automatically be deployed to the development environment. Promote it
          across your stages and add components.
        </GettingStartedCard>
      )}
      <PageLayout
        title="Applications"
        description="Applications are a set of components that run together on environments."
      >
        <PageSection
          padding={{ default: 'noPadding' }}
          variant={PageSectionVariants.light}
          isFilled
        >
          {!applications || applications.length === 0 ? (
            <EmptyState variant={EmptyStateVariant.large}>
              <EmptyStateIcon icon={EmptyStateImg} />
              <Title headingLevel="h4" size="lg">
                No applications
              </Title>
              <EmptyStateBody>To get started, create an application.</EmptyStateBody>
              <Button
                variant="primary"
                component={(props) => <Link {...props} to="/app-studio/import" />}
              >
                Create application
              </Button>
            </EmptyState>
          ) : (
            <>
              <Toolbar usePageInsets>
                <ToolbarContent>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      component={(props) => <Link {...props} to="/app-studio/import" />}
                    >
                      Create application
                    </Button>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              <Table
                data={applications}
                aria-label="Application List"
                Header={ApplicationListHeader}
                Row={ApplicationListRow}
                loaded
                getRowProps={(obj: ApplicationKind) => ({
                  id: obj.metadata.name,
                })}
              />
            </>
          )}
        </PageSection>
      </PageLayout>
    </>
  );
};

export default ApplicationListView;
