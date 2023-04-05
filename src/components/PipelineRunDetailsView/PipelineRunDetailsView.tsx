import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useComponent } from '../../hooks/useComponents';
import { usePipelineRun } from '../../hooks/usePipelineRunsForApplication';
import { useTaskRuns } from '../../hooks/useTaskRuns';
import { ComponentModel, PipelineRunModel } from '../../models';
import { HttpError } from '../../shared/utils/error/http-error';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { isPACEnabled, startNewBuild } from '../../utils/component-utils';
import { pipelineRunCancel, pipelineRunStop } from '../../utils/pipeline-actions';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import { SecurityEnterpriseContractTab } from '../EnterpriseContractView/SecurityEnterpriseContractTab';
import { isResourceEnterpriseContract } from '../EnterpriseContractView/utils';
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
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();

  const [pipelineRun, loaded, error] = usePipelineRun(namespace, pipelineRunName);
  const [taskRuns, taskRunsLoaded, taskRunError] = useTaskRuns(namespace, pipelineRunName);
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');
  const [canPatchPipeline] = useAccessReviewForModel(PipelineRunModel, 'patch');

  const [component] = useComponent(
    namespace,
    pipelineRun?.metadata?.labels?.[PipelineRunLabel.COMPONENT],
  );

  const plrStatus = React.useMemo(
    () => loaded && pipelineRun && pipelineRunStatus(pipelineRun),
    [loaded, pipelineRun],
  );

  const loadError = error || taskRunError;
  if (loadError) {
    const httpError = HttpError.fromCode((loadError as any).code);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title={`Unable to load pipeline run ${pipelineRunName}`}
        body={httpError.message}
      />
    );
  }

  if (!(loaded && taskRunsLoaded)) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const isEnterpriseContract = isResourceEnterpriseContract(pipelineRun);

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
          {
            key: 'start-new-build',
            label: 'Start new build',
            hidden: !component || isPACEnabled(component),
            isDisabled: !canPatchComponent,
            disabledTooltip: "You don't have access to start a new build",
            onClick: () => {
              startNewBuild(component).then(() =>
                navigate(
                  `/stonesoup/workspaces/${workspace}/applications/${component.spec.application}/activity/pipelineruns?name=${component.metadata.name}`,
                ),
              );
            },
          },
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
            isDisabled: !(plrStatus && plrStatus === 'Running') || !canPatchPipeline,
            disabledTooltip: !canPatchPipeline
              ? "You don't have access to stop a build"
              : undefined,
            onClick: () => pipelineRunStop(pipelineRun),
          },
          {
            key: 'cancel',
            label: 'Cancel',
            tooltip: 'Interrupt any executing non finally tasks, then execute finally tasks',
            isDisabled: !(plrStatus && plrStatus === 'Running') || !canPatchPipeline,
            disabledTooltip: !canPatchPipeline
              ? "You don't have access to cancel a build"
              : undefined,
            onClick: () => pipelineRunCancel(pipelineRun),
          },
        ]}
        baseURL={`/stonesoup/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${pipelineRunName}`}
        tabs={[
          {
            key: 'detail',
            label: 'Details',
            component: (
              <PipelineRunDetailsTab pipelineRun={pipelineRun} taskRuns={taskRuns} error={error} />
            ),
          },
          // {
          //   key: 'yaml',
          //   label: 'YAML',
          //   component: <PipelineRunYamlTab pipelineRun={pipelineRun} />,
          // },
          {
            key: 'taskruns',
            label: 'Task runs',
            component: <PipelineRunTaskRunsTab taskRuns={taskRuns} loaded={taskRunsLoaded} />,
          },
          {
            key: 'logs',
            label: 'Logs',
            component: <PipelineRunLogsTab pipelineRun={pipelineRun} taskRuns={taskRuns} />,
          },
          ...(isEnterpriseContract
            ? [
                {
                  key: 'security',
                  label: 'Security',
                  component: (
                    <SecurityEnterpriseContractTab pipelineRun={pipelineRun.metadata.name} />
                  ),
                },
              ]
            : []),
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
