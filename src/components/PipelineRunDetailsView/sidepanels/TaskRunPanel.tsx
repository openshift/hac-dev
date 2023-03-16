import * as React from 'react';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  Tab,
  Tabs,
} from '@patternfly/react-core';
import { ElementModel, GraphElement } from '@patternfly/react-topology';
import TaskRunLogs from '../../TaskRuns/TaskRunLogs';
import { StatusIconWithTextLabel } from '../../topology/StatusIcon';
import { PipelineRunNodeData } from '../visualization/types';
import TaskRunDetails from './TaskRunDetails';

import './TaskRunPanel.scss';

type Props = {
  onClose: () => void;
  taskNode: GraphElement<ElementModel, PipelineRunNodeData>;
};

const TaskRunPanel: React.FC<Props> = ({ taskNode, onClose }) => {
  const task = taskNode.getData().task;
  const taskRun = taskNode.getData().taskRun;
  const { status } = taskNode.getData();
  return (
    <>
      <div className="task-run-panel__head">
        <DrawerHead>
          <span>
            {task.name} <StatusIconWithTextLabel status={status} />
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
                taskName={task.name}
                namespace={taskNode.getData().namespace}
                podName={taskRun?.status?.podName}
                status={status}
              />
            </DrawerPanelBody>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default TaskRunPanel;
