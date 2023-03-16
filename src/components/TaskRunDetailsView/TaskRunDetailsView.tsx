import * as React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { TektonResourceLabel } from '../../consts/pipeline';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useTaskRun } from '../../hooks/usePipelineRunsForApplication';
import { HttpError } from '../../shared/utils/error/http-error';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { taskRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';
import TaskRunDetailsTab from './tabs/TaskRunDetailsTab';
import TaskRunLogsTab from './tabs/TaskRunLogsTab';
// import TaskRunLogsTab from './tabs/TaskRunLogsTab';

type TaskRunDetailsViewProps = {
  taskRunName: string;
};

export const TaskRunDetailsView: React.FC<TaskRunDetailsViewProps> = ({ taskRunName }) => {
  const { namespace, workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();

  const [taskRun, loaded, error] = useTaskRun(namespace, taskRunName);

  const trStatus = React.useMemo(
    () => loaded && taskRun && taskRunStatus(taskRun),
    [loaded, taskRun],
  );

  if (error) {
    const httpError = HttpError.fromCode((error as any).code);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title={`Unable to load pipeline run ${taskRunName}`}
        body={httpError.message}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const applicationName = taskRun.metadata?.labels[PipelineRunLabel.APPLICATION];
  const plrName = taskRun.metadata?.labels[TektonResourceLabel.pipelinerun];

  return (
    <>
      <React.Fragment>
        <DetailsPage
          headTitle={taskRunName}
          breadcrumbs={[
            ...applicationBreadcrumbs,
            {
              path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/activity/pipelineruns`,
              name: 'Pipeline runs',
            },
            {
              path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${plrName}`,
              name: plrName,
            },
            {
              path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${plrName}/taskruns`,
              name: `Task runs`,
            },
            {
              path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/taskruns/${taskRunName}`,
              name: taskRunName,
            },
          ]}
          title={
            <>
              <span className="pf-u-mr-sm">{taskRunName}</span>
              <StatusIconWithTextLabel status={trStatus} />
            </>
          }
          actions={[
            {
              key: 'logs',
              label: 'View logs',
              onClick: () => {},
            },
          ]}
          baseURL={`/stonesoup/workspaces/${workspace}/applications/${applicationName}/taskruns/${taskRunName}`}
          tabs={[
            {
              key: 'detail',
              label: 'Details',
              component: <TaskRunDetailsTab taskRun={taskRun} error={error} />,
            },
            {
              key: 'logs',
              label: 'Logs',
              component: <TaskRunLogsTab taskRun={taskRun} />,
            },
          ]}
        />
      </React.Fragment>
    </>
  );
};

export default TaskRunDetailsView;
