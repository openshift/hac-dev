import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ApplicationGroupVersionKind } from '../../models';
import { Table } from '../../shared';
import { LoadingBox } from '../../shared/components/status-box/StatusBox';
import { ApplicationKind } from '../../types';
import PageLayout from '../layout/PageLayout';
import { ApplicationListHeader } from './ApplicationListHeader';
import ApplicationListRow from './ApplicationListRow';

const getRowProps = (obj: ApplicationKind) => ({
  id: obj.metadata.name,
});

const ApplicationList: React.FC = () => {
  const namespace = useActiveNamespace();

  const [allApplications, allApplicationsLoaded] = useK8sWatchResource<ApplicationKind[]>({
    groupVersionKind: ApplicationGroupVersionKind,
    namespace,
    isList: true,
  });
  const loaded = namespace && allApplicationsLoaded;

  if (!loaded) {
    return <LoadingBox />;
  }

  allApplications?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  const content =
    !allApplications || allApplications.length === 0 ? (
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={SearchIcon} />
        <EmptyStateBody data-test="empty-state-body">
          <p>No applications found</p>
          <br />
          <Link to="/app-studio/create">Create an application</Link> to get started.
        </EmptyStateBody>
      </EmptyState>
    ) : (
      <>
        <Toolbar usePageInsets>
          <ToolbarContent>
            <ToolbarItem>
              <Button
                variant="primary"
                component={(props) => <Link {...props} to="/app-studio/create" />}
              >
                Create application
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table
          data={allApplications}
          aria-label="Application List"
          Header={ApplicationListHeader}
          Row={ApplicationListRow}
          loaded={loaded}
          getRowProps={getRowProps}
        />
      </>
    );

  return (
    <PageLayout
      title="Applications"
      description="Applications are a set of components that run together on environments."
    >
      <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
        {content}
      </PageSection>
    </PageLayout>
  );
};

export default ApplicationList;
