import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
} from '@patternfly/react-core';
import { ElementModel, GraphElement } from '@patternfly/react-topology';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { useTaskRuns } from '../../../../hooks/useTaskRuns';
import PipelineIcon from '../../../../imgs/pipelineIcon.svg';
import { Timestamp } from '../../../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../../../types';
import { calculateDuration, pipelineRunStatus } from '../../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import ClairScanDescriptionListGroup from '../../../PipelineRunDetailsView/tabs/ClairScanDescriptionListGroup';
import RunResultsList from '../../../PipelineRunDetailsView/tabs/RunResultsList';
import { StatusIconWithTextLabel } from '../../../topology/StatusIcon';
import { CommitWorkflowNodeModelData } from '../visualization/commit-visualization-types';

export interface PipelineSidePanelBodyProps {
  onClose: () => void;
  workflowNode: GraphElement<ElementModel, CommitWorkflowNodeModelData>;
}

const BuildSidePanel: React.FC<PipelineSidePanelBodyProps> = ({ workflowNode, onClose }) => {
  const { workspace, namespace } = useWorkspaceInfo();
  const workflowData = workflowNode.getData();
  const pipelineRun = workflowData.resource as PipelineRunKind;
  const [taskRuns] = useTaskRuns(namespace, pipelineRun.metadata.name);

  if (!pipelineRun) {
    return null;
  }

  const duration = calculateDuration(
    typeof pipelineRun.status?.startTime === 'string' ? pipelineRun.status?.startTime : '',
    typeof pipelineRun.status?.completionTime === 'string'
      ? pipelineRun.status?.completionTime
      : '',
  );

  const pipelineStatus = pipelineRunStatus(pipelineRun);

  return (
    <>
      <div className="commit-side-panel__head">
        <DrawerHead data-testid="build-side-panel-head">
          <span className="commit-side-panel__head-title">
            <Link
              to={`/application-pipeline/workspaces/${workspace}/applications/${workflowData.application}/pipelineruns/${pipelineRun.metadata.name}`}
            >
              {pipelineRun.metadata.name}
            </Link>
            <StatusIconWithTextLabel status={workflowNode.getData().status} />
          </span>
          <span className="pf-u-mt-xs commit-side-panel__subtext">
            <img src={PipelineIcon} alt="pipeline run" /> Pipeline run
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={onClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody data-testid="build-side-panel-body">
          <DescriptionList
            data-test="pipeline-run-details"
            columnModifier={{
              default: '2Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Created at</DescriptionListTerm>
              <DescriptionListDescription>
                <Timestamp timestamp={pipelineRun.metadata?.creationTimestamp ?? '-'} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Duration</DescriptionListTerm>
              <DescriptionListDescription>{duration ?? '-'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Type</DescriptionListTerm>
              <DescriptionListDescription>Build</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Pipeline</DescriptionListTerm>
              <DescriptionListDescription>
                {pipelineRun.metadata?.labels[PipelineRunLabel.PIPELINE_NAME] ?? '-'}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
          <DescriptionList
            className="pf-u-mt-lg"
            data-test="pipeline-run-details"
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Component</DescriptionListTerm>
              <DescriptionListDescription>
                {pipelineRun.metadata?.labels?.[PipelineRunLabel.COMPONENT] ? (
                  pipelineRun.metadata?.labels?.[PipelineRunLabel.APPLICATION] ? (
                    <Link
                      to={`/application-pipeline/workspaces/${workspace}/applications/${
                        pipelineRun.metadata.labels[PipelineRunLabel.APPLICATION]
                      }/components?name=${pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]}`}
                    >
                      {pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]}
                    </Link>
                  ) : (
                    pipelineRun.metadata.labels[PipelineRunLabel.COMPONENT]
                  )
                ) : (
                  '-'
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <ClairScanDescriptionListGroup taskRuns={taskRuns} hideIfNotFound />
            <DescriptionListGroup>
              <DescriptionListDescription>
                <Link
                  to={`/application-pipeline/workspaces/${workspace}/applications/${workflowData.application}/pipelineruns/${pipelineRun.metadata.name}/logs`}
                >
                  View logs
                </Link>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
          {pipelineRun.status?.pipelineResults ? (
            <div className="pf-u-mt-lg">
              <RunResultsList
                results={pipelineRun.status.pipelineResults}
                status={pipelineStatus}
                compressed
              />
            </div>
          ) : null}
        </DrawerPanelBody>
      </div>
    </>
  );
};

export default BuildSidePanel;
