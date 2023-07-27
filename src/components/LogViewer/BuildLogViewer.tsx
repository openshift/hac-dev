import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ModalVariant,
} from '@patternfly/react-core';
import dayjs from 'dayjs';
import { useLatestBuildPipelineRunForComponent } from '../../hooks/usePipelineRuns';
import { useTaskRuns } from '../../hooks/useTaskRuns';
import PipelineRunLogs from '../../shared/components/pipeline-run-logs/PipelineRunLogs';
import { EmptyBox, LoadingBox } from '../../shared/components/status-box/StatusBox';
import { ComponentKind } from '../../types';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import { useModalLauncher } from '../modal/ModalProvider';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';

import './BuildLogViewer.scss';

type BuildLogViewerProps = ComponentProps & {
  component: ComponentKind;
};

export const BuildLogViewer: React.FC<BuildLogViewerProps> = ({ component }) => {
  const { workspace } = useWorkspaceInfo();
  const [pipelineRun, loaded] = useLatestBuildPipelineRunForComponent(
    component.metadata.namespace,
    component.metadata.name,
  );
  const [taskRuns, tloaded] = useTaskRuns(
    pipelineRun?.metadata?.namespace,
    pipelineRun?.metadata?.name,
  );
  const plrStatus = React.useMemo(
    () => loaded && pipelineRun && pipelineRunStatus(pipelineRun),
    [loaded, pipelineRun],
  );

  if (loaded && !pipelineRun) {
    return <EmptyBox label="pipeline runs" />;
  }

  return (
    <>
      <div className="pf-c-modal-box__title build-log-viewer__title">
        <span className="pf-c-modal-box__title-text">{`Build pipeline run log for ${component.metadata.name}`}</span>
        <StatusIconWithTextLabel status={plrStatus} />
      </div>
      <div>
        <DescriptionList
          data-test="pipeline-run-details"
          columnModifier={{
            default: '3Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Component</DescriptionListTerm>
            <DescriptionListDescription>{component.metadata.name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Build pipeline run</DescriptionListTerm>
            <DescriptionListDescription>
              {pipelineRun && loaded && (
                <Link
                  to={`/application-pipeline/workspaces/${workspace}/applications/${component.spec.application}/pipelineruns/${pipelineRun.metadata?.name}`}
                  title={pipelineRun.metadata?.name}
                >
                  {pipelineRun.metadata?.name}
                </Link>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Build start date</DescriptionListTerm>
            <DescriptionListDescription>
              {pipelineRun &&
                loaded &&
                dayjs(new Date(pipelineRun.metadata.creationTimestamp)).format(
                  'MMMM DD, YYYY, h:mm A',
                )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </div>
      <div className="build-log-viewer__body">
        {pipelineRun && taskRuns && tloaded ? (
          <PipelineRunLogs obj={pipelineRun} taskRuns={taskRuns} workspace={workspace} />
        ) : (
          <LoadingBox />
        )}
      </div>
    </>
  );
};

export const buildLogViewerLauncher = createModalLauncher(BuildLogViewer, {
  className: 'build-log-viewer',
  'data-testid': 'view-build-logs-modal',
  variant: ModalVariant.large,
});

export const useBuildLogViewerModal = (component: ComponentKind) => {
  const showModal = useModalLauncher();
  return React.useCallback(
    () => showModal(buildLogViewerLauncher({ component })),
    [component, showModal],
  );
};
