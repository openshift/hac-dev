import React from 'react';
import { Link } from 'react-router-dom';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  Tab,
  Tabs,
} from '@patternfly/react-core';
import { ElementModel, GraphElement } from '@patternfly/react-topology';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import TaskRunLogs from '../../TaskRuns/TaskRunLogs';
import { StatusIconWithTextLabel } from '../../topology/StatusIcon';
import { PipelineRunNodeData } from '../visualization/types';
import TaskRunDetails from './TaskRunDetails';
import './TaskRunPanel.scss';

type Props = {
  onClose: () => void;
  taskNode: GraphElement<ElementModel, PipelineRunNodeData>;
  pipelineRunUID: string;
};

const TaskRunPanel: React.FC<React.PropsWithChildren<Props>> = ({
  taskNode,
  onClose,
  pipelineRunUID,
}) => {
  const task = taskNode.getData().task;
  const taskRun = taskNode.getData().taskRun;
  const { status } = taskNode.getData();
  const { workspace } = useWorkspaceInfo();
  const applicationName = taskRun?.metadata?.labels[PipelineRunLabel.APPLICATION];

  return (
    <>
      <div className="task-run-panel__head">
        <DrawerHead data-id="task-run-panel-head-id">
          <span>
            {applicationName ? (
              <Link
                to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/taskruns/${taskRun.metadata.name}`}
              >
                {task.name}
              </Link>
            ) : (
              task.name
            )}{' '}
            <StatusIconWithTextLabel status={status} />
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={onClose} />
          </DrawerActions>
        </DrawerHead>
      </div>

      <div className="task-run-panel__tabs">
        <Tabs defaultActiveKey="details" unmountOnExit className="">
          <Tab title="Details" eventKey="details">
            <DrawerPanelBody>
              <TaskRunDetails taskRun={taskRun} status={status} />
            </DrawerPanelBody>
          </Tab>
          <Tab title="Logs" eventKey="logs">
            <DrawerPanelBody style={{ height: '100%' }}>
              <TaskRunLogs
                taskRun={taskRun}
                namespace={taskNode.getData().namespace}
                status={status}
                pipelineRunUID={pipelineRunUID}
              />
            </DrawerPanelBody>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default TaskRunPanel;
