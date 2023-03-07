import React from 'react';
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
  taskRunNode: GraphElement<ElementModel, PipelineRunNodeData>;
};

const TaskRunPanel: React.FC<Props> = ({ taskRunNode, onClose }) => {
  const taskRun = taskRunNode.getData().task;
  const { status } = taskRunNode.getData();
  return (
    <>
      <DrawerHead>
        <span>
          {taskRun.name} <StatusIconWithTextLabel status={status} />
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} />
        </DrawerActions>
      </DrawerHead>

      <div className="task-run-panel__tabs">
        <Tabs defaultActiveKey="details" unmountOnExit className="">
          <Tab title="Details" eventKey="details">
            <DrawerPanelBody>
              <TaskRunDetails taskRun={taskRun} status={status} />
            </DrawerPanelBody>
          </Tab>
          <Tab title="Logs" eventKey="logs">
            {/* Height hack until we can manage the layout of the main content area in consoledot */}
            <DrawerPanelBody style={{ maxHeight: 'calc(100vh - 215px)', height: '100%' }}>
              <TaskRunLogs
                taskName={taskRun.name}
                namespace={taskRunNode.getData().namespace}
                podName={taskRun.status?.podName}
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
