import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, configure } from '@testing-library/react';
import { TaskRunKind } from '../../../../types';
import TaskRunLogsTab from '../TaskRunLogsTab';

configure({ testIdAttribute: 'data-test' });

const testTask: TaskRunKind = {
  apiGroup: 'group',
  apiVersion: 'v1Alpha',
  kind: 'TaskRun',
  metadata: {
    annotations: {},
    creationTimestamp: 'CTS',
    labels: {},
    name: 'example',
    namespace: 'example-namespace',
    resourceVersion: 'v1Alpha',
    uid: 'uid',
  },
  spec: {},
  status: {},
};

describe('TaskRunLogs', () => {
  it('should render TaskRunLogs component', () => {
    const result = render(
      <TaskRunLogsTab
        taskRun={{
          ...testTask,
          spec: { taskRef: { name: 'example-task' } },
          status: {
            podName: null,
            completionTime: '2022-07-07T13:32:20Z',
            conditions: [
              {
                lastTransitionTime: '2022-07-07T13:32:20Z',
                message: 'test',
                reason: 'ExceededResourceQuota',
                status: 'True',
                type: 'Succeeded',
              },
            ],
          },
        }}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(result.getByTestId('taskrun-logs-nopod')).toBeInTheDocument();
  });
});
