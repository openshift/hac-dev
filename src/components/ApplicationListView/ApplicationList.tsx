import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ApplicationGroupVersionKind } from '../../models';
import { Page, Table } from '../../shared';
import { LoadingBox } from '../../shared/components/status-box/StatusBox';
import { ApplicationKind } from '../../types';
import { ApplicationListHeader } from './ApplicationListHeader';
import ApplicationListRow from './ApplicationListRow';

import '../../App.scss';

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

  return (
    <Page
      heading="Applications"
      customButton={
        <Link className="pf-c-button pf-m-primary" to={'/app-studio/create'}>
          Create Application
        </Link>
      }
    >
      {!allApplications || allApplications.length === 0 ? (
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={SearchIcon} />
          <EmptyStateBody data-test="empty-state-body">
            <p>No applications found</p>
            <br />
            <Link to={`/app-studio`}>Create an application</Link> to get started.
          </EmptyStateBody>
        </EmptyState>
      ) : (
        <Table
          data={allApplications}
          aria-label="Application List"
          Header={ApplicationListHeader}
          Row={ApplicationListRow}
          loaded={loaded}
          getRowProps={getRowProps}
        />
      )}
    </Page>
  );
};

export default ApplicationList;
