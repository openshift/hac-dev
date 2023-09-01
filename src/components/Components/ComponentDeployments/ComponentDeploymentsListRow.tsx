import * as React from 'react';
import { Link } from 'react-router-dom';
import { useComponentDeployment } from '../../../hooks/useComponentDeployment';
import { getScanResults } from '../../../hooks/useScanResults';
import { useTaskRuns } from '../../../hooks/useTaskRuns';
import { RowFunctionArgs, TableData } from '../../../shared';
import CommitLabel from '../../../shared/components/commit-label/CommitLabel';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { EnvironmentKind } from '../../../types';
import { getComponentRouteWebURL } from '../../../utils/route-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ScanStatus } from '../../PipelineRunListView/ScanStatus';
import PodLogsButton from '../../PodLogs/PodLogsButton';
import { componentDeploymentsColumnClasses } from './ComponentDeploymentsListHeader';

import './ComponentDeploymentsListRow.scss';

type ScanResultsColumnProps = {
  namespace: string;
  pipelineRunName: string;
};

const ScanResultsColumn: React.FC<ScanResultsColumnProps> = ({ namespace, pipelineRunName }) => {
  const [taskRuns, taskRunsLoaded] = useTaskRuns(namespace, pipelineRunName);
  const [scanResults] = taskRunsLoaded ? getScanResults(taskRuns) : [undefined];

  return <ScanStatus scanResults={scanResults} />;
};

const ComponentDeploymentsListRow: React.FC<RowFunctionArgs<EnvironmentKind>> = ({
  obj: environment,
  customData,
}) => {
  const { workspace, namespace } = useWorkspaceInfo();
  const { component, snapshotEBs, commit, pipelineRunName, routes } = customData;
  const application = component.spec.application;

  const snapshotEB = React.useMemo(
    () =>
      snapshotEBs
        ? snapshotEBs.find(
            (seb) =>
              seb.spec.components?.find((c) => c.name === component.spec.componentName) &&
              seb.metadata.labels?.['appstudio.environment'] === environment.metadata.name,
          )
        : [],
    [component.spec.componentName, environment.metadata.name, snapshotEBs],
  );

  const isDevEnv = environment.metadata?.name === 'development';

  const [deployment, deploymentLoaded, deploymentLoadError] = useComponentDeployment(
    namespace,
    component.metadata.name,
    snapshotEB,
  );

  const podSelector = React.useMemo(
    () => isDevEnv && !deploymentLoadError && deploymentLoaded && deployment?.spec?.selector,
    [isDevEnv, deploymentLoadError, deploymentLoaded, deployment?.spec?.selector],
  );
  const routeURL = isDevEnv ? getComponentRouteWebURL(routes, component.metadata.name) : null;

  return (
    <>
      <TableData
        data-testid="environment-cell"
        className={componentDeploymentsColumnClasses.environment}
      >
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${component.spec.application}/deployments?name=${environment.metadata?.name}`}
        >
          {environment?.spec.displayName || environment?.metadata?.name}
        </Link>
        <div>
          {routeURL ? (
            <ExternalLink href={routeURL}>{routeURL}</ExternalLink>
          ) : (
            <div className="component-deploy-list--dim">No URL for this component.</div>
          )}
        </div>
      </TableData>
      <TableData className={componentDeploymentsColumnClasses.componentDeployed}>
        {commit ? (
          <>
            <Link
              to={`/application-pipeline/workspaces/${workspace}/applications/${commit.application}/commit/${commit.sha}`}
            >
              {commit.isPullRequest ? `#${commit.pullRequestNumber}` : ''} {commit.shaTitle}
            </Link>
            {commit.shaURL && (
              <>
                {' '}
                <CommitLabel
                  gitProvider={commit.gitProvider}
                  sha={commit.sha}
                  shaURL={commit.shaURL}
                />
              </>
            )}
          </>
        ) : (
          '-'
        )}
      </TableData>
      <TableData className={componentDeploymentsColumnClasses.snapshot}>
        {snapshotEB ? (
          <Link
            to={`/application-pipeline/workspaces/${workspace}/applications/${application}/snapshots/${snapshotEB.spec.snapshot}`}
          >
            {snapshotEB.spec.snapshot}
          </Link>
        ) : (
          '-'
        )}
      </TableData>
      <TableData className={componentDeploymentsColumnClasses.vulnerabilities}>
        {isDevEnv ? (
          <ScanResultsColumn namespace={namespace} pipelineRunName={pipelineRunName} />
        ) : (
          '-'
        )}
      </TableData>
      <TableData className={componentDeploymentsColumnClasses.logs}>
        <PodLogsButton component={component} podSelector={podSelector} showDisabled />
      </TableData>
    </>
  );
};

export default ComponentDeploymentsListRow;
