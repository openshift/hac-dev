import * as React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { ApplicationGroupVersionKind } from '../../models';
import { Page, Table } from '../../shared';
import { LoadingBox } from '../../shared/components/status-box/StatusBox';
import { ApplicationKind } from '../../types';
import { ApplicationListHeader } from './ApplicationListHeader';
import ApplicationListRow from './ApplicationListRow';

const getRowProps = (obj) => ({
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

  if (Object.keys(allApplications).length === 0) {
    return (
      <EmptyState variant={EmptyStateVariant.full}>
        <p>No applications found</p>
      </EmptyState>
    );
  }
  allApplications.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <Page
      customButton={
        <Link className="pf-c-button pf-m-primary" to={`/`}>
          Create Application
        </Link>
      }
    >
      <Table
        data={allApplications}
        aria-label="application list"
        Header={ApplicationListHeader}
        Row={ApplicationListRow}
        loaded={loaded}
        getRowProps={getRowProps}
      />
    </Page>
  );
};

export default ApplicationList;
