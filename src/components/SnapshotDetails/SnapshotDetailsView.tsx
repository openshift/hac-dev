import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner, Text, TextVariants } from '@patternfly/react-core';
import { SnapshotLabels } from '../../consts/pipelinerun';
import { usePipelineRun } from '../../hooks/usePipelineRuns';
import { SnapshotGroupVersionKind } from '../../models';
import CommitLabel from '../../shared/components/commit-label/CommitLabel';
import DetailsPage from '../../shared/components/details-page/DetailsPage';
import ErrorEmptyState from '../../shared/components/empty-state/ErrorEmptyState';
import { LoadingBox } from '../../shared/components/status-box/StatusBox';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { HttpError } from '../../shared/utils/error/http-error';
import { Snapshot } from '../../types/coreBuildService';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { createCommitObjectFromPLR } from '../../utils/commits-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import SnapshotOverviewTab from './tabs/SnapshotOverview';
import SnapshotPipelineRunTab from './tabs/SnapshotPipelineRunsTab';

type SnapshotDetailsViewProps = {
  applicationName: string;
  snapshotName: string;
};

const SnapshotDetailsView: React.FC<React.PropsWithChildren<SnapshotDetailsViewProps>> = ({
  snapshotName,
  applicationName,
}) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const applicationBreadcrumbs = useApplicationBreadcrumbs();

  const [snapshot, loaded, loadErr] = useK8sWatchResource<Snapshot>({
    groupVersionKind: SnapshotGroupVersionKind,
    name: snapshotName,
    namespace,
    isList: false,
  });

  const buildPipelineName = React.useMemo(
    () => loaded && !loadErr && snapshot?.metadata?.labels[SnapshotLabels.BUILD_PIPELINE_LABEL],
    [snapshot, loaded, loadErr],
  );

  const [buildPipelineRun, plrLoaded, plrLoadError] = usePipelineRun(
    snapshot?.metadata?.namespace,
    buildPipelineName,
  );

  const commit = React.useMemo(
    () => plrLoaded && !plrLoadError && createCommitObjectFromPLR(buildPipelineRun),
    [plrLoaded, plrLoadError, buildPipelineRun],
  );

  if (loadErr || (loaded && !snapshot)) {
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode(loadErr ? (loadErr as any).code : 404)}
        title="Snapshot not found"
        body="No such snapshot"
      />
    );
  }

  if (!plrLoadError && !plrLoaded) {
    return <LoadingBox />;
  }

  if (snapshot?.metadata) {
    return (
      <DetailsPage
        headTitle={snapshot.metadata.name}
        breadcrumbs={[
          ...applicationBreadcrumbs,
          {
            path: `#`,
            name: 'Snapshots',
          },
          {
            path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/snapshots/${snapshotName}`,
            name: snapshot.metadata.name,
          },
        ]}
        title={
          <>
            <Text component={TextVariants.h2} data-test="snapshot-name">
              {snapshotName}
            </Text>
            {commit?.sha && (
              <>
                <Text component={TextVariants.p} data-test="snapshot-header-details">
                  Triggered by {commit.shaTitle}{' '}
                  <CommitLabel
                    gitProvider={commit.gitProvider}
                    sha={commit.sha}
                    shaURL={commit.shaURL}
                  />{' '}
                  at{' '}
                  <Timestamp
                    timestamp={snapshot.metadata.creationTimestamp}
                    className="pf-u-display-inline"
                  />
                </Text>
              </>
            )}
          </>
        }
        baseURL={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/snapshots/${snapshotName}`}
        tabs={[
          {
            key: 'overview',
            label: 'Overview',
            isFilled: true,
            component: (
              <SnapshotOverviewTab
                snapshot={snapshot}
                commit={commit}
                buildPipelineName={buildPipelineName}
              />
            ),
          },
          {
            key: 'pipelineruns',
            label: 'Pipeline runs',
            component: (
              <SnapshotPipelineRunTab
                snapshotName={snapshotName}
                applicationName={applicationName}
                namespace={namespace}
              />
            ),
          },
        ]}
      />
    );
  }

  return (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  );
};

export default SnapshotDetailsView;
