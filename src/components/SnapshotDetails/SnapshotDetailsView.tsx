import React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner, Text, TextVariants } from '@patternfly/react-core';
import { usePipelineRun } from '../../hooks/usePipelineRuns';
import { SnapshotGroupVersionKind, SnapshotModel } from '../../models';
import CommitLabel from '../../shared/components/commit-label/CommitLabel';
import { LoadingBox } from '../../shared/components/status-box/StatusBox';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { HttpError } from '../../shared/utils/error/http-error';
import { Snapshot } from '../../types/coreBuildService';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { createCommitObjectFromPLR } from '../../utils/commits-utils';
import { runStatus } from '../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import { useCommitStatus } from '../Commits/commit-status';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';
import SnapshotOverviewTab from './tabs/SnapshotOverview';

const BUILD_PIPELINE_LABEL = `appstudio.openshift.io/build-pipelinerun`;

type SnapshotDetailsViewProps = {
  applicationName: string;
  snapshotName: string;
};

const SnapshotDetailsView: React.FC<SnapshotDetailsViewProps> = ({
  snapshotName,
  applicationName,
}) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const [canUpdateIntegrationTest] = useAccessReviewForModel(SnapshotModel, 'update');

  const [snapshot, loaded, loadErr] = useK8sWatchResource<Snapshot>({
    groupVersionKind: SnapshotGroupVersionKind,
    name: snapshotName,
    namespace,
    isList: false,
  });

  const buildPipelineName = React.useMemo(
    () => loaded && !loadErr && snapshot?.metadata?.labels[BUILD_PIPELINE_LABEL],
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

  const [commitStatus] = useCommitStatus(applicationName, commit.sha);

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
            path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/snapshots/${snapshotName}`,
            name: snapshot.metadata.name,
          },
        ]}
        title={
          <>
            <Text component={TextVariants.h2}>{snapshotName}</Text>
            {commit?.sha && (
              <>
                <Text component={TextVariants.p}>
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
                <Text component={TextVariants.p}>
                  <StatusIconWithTextLabel status={commitStatus as runStatus} />
                </Text>
              </>
            )}
          </>
        }
        actions={[
          {
            key: 'edit',
            label: 'Edit',
            component: (
              <Link
                to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests/${snapshotName}/edit`}
              >
                Edit
              </Link>
            ),
            isDisabled: !canUpdateIntegrationTest,
            disabledTooltip: "You don't have access to edit this integration test",
          },
        ]}
        baseURL={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests/${snapshotName}`}
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
            component: <SnapshotOverviewTab snapshot={snapshot} commit={commit} />,
          },
          {
            key: 'logs',
            label: 'Logs',
            component: <SnapshotOverviewTab snapshot={snapshot} commit={commit} />,
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
