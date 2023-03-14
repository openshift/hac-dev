import * as React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { usePipelineRun } from '../../hooks/usePipelineRunsForApplication';
import { HttpError } from '../../shared/utils/error/http-error';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { pipelineRunCancel, pipelineRunStop } from '../../utils/pipeline-actions';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import SidePanelHost from '../SidePanel/SidePanelHost';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';
import PipelineRunDetailsTab from './tabs/PipelineRunDetailsTab';
import PipelineRunLogsTab from './tabs/PipelineRunLogsTab';
import PipelineRunTaskRunsTab from './tabs/PipelineRunTaskRunsTab';

type PipelineRunDetailsViewProps = {
  pipelineRunName: string;
};

export const PipelineRunDetailsView: React.FC<PipelineRunDetailsViewProps> = ({
  pipelineRunName,
}) => {
  const { namespace, workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();

  const [pipelineRun, loaded, error] = usePipelineRun(namespace, pipelineRunName);

  const plrStatus = React.useMemo(
    () => loaded && pipelineRun && pipelineRunStatus(pipelineRun),
    [loaded, pipelineRun],
  );

  if (error) {
    const httpError = HttpError.fromCode((error as any).code);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title={`Unable to load pipeline run ${pipelineRunName}`}
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

  const applicationName = pipelineRun.metadata?.labels[PipelineRunLabel.APPLICATION];
  return (
    <SidePanelHost>
      <DetailsPage
        headTitle={pipelineRunName}
        breadcrumbs={[
          ...applicationBreadcrumbs,
          {
            path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/activity/pipelineruns`,
            name: 'Pipeline runs',
          },
          {
            path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${pipelineRunName}`,
            name: pipelineRunName,
          },
        ]}
        title={
          <>
            <span className="pf-u-mr-sm">{pipelineRunName}</span>
            <StatusIconWithTextLabel status={plrStatus} />
          </>
        }
        actions={[
          // Todo: will re enable this after finding the proper solution to rerun post mvp.
          // {
          //   key: 'rerun',
          //   label: 'Rerun',
          //   onClick: () =>
          //     pipelineRunRerun(pipelineRun).then((data) => {
          //       navigate(`/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${data.metadata.name}`);
          //     }),
          // },
          {
            key: 'stop',
            label: 'Stop',
            tooltip: 'Let the running tasks complete, then execute finally tasks',
            isDisabled: !(plrStatus && plrStatus === 'Running'),
            onClick: () => pipelineRunStop(pipelineRun),
          },
          {
            key: 'cancel',
            label: 'Cancel',
            tooltip: 'Interrupt any executing non finally tasks, then execute finally tasks',
            isDisabled: !(plrStatus && plrStatus === 'Running'),
            onClick: () => pipelineRunCancel(pipelineRun),
          },
        ]}
        baseURL={`/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${pipelineRunName}`}
        tabs={[
          {
            key: 'detail',
            label: 'Details',
            component: <PipelineRunDetailsTab pipelineRun={pipelineRun} error={error} />,
          },
          // {
          //   key: 'yaml',
          //   label: 'YAML',
          //   component: <PipelineRunYamlTab pipelineRun={pipelineRun} />,
          // },
          {
            key: 'taskruns',
            label: 'Task runs',
            component: <PipelineRunTaskRunsTab pipelineRun={pipelineRun} />,
          },
          {
            key: 'logs',
            label: 'Logs',
            component: <PipelineRunLogsTab pipelineRun={pipelineRun} />,
          },
          // {
          //   key: 'events',
          //   label: 'Events',
          //   component: <PipelineRunEventsTab pipelineRun={pipelineRun} />,
          // },
        ]}
      />
    </SidePanelHost>
  );
};

export default PipelineRunDetailsView;
