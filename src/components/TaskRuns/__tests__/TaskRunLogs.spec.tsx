import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { runStatus } from '../../../utils/pipeline-utils';
import TaskRunLogs from '../TaskRunLogs';

describe('TaskRunLogs', () => {
  it('should render no logs found', () => {
    const result = render(
      <TaskRunLogs podName={null} namespace="test" taskName="task" status={runStatus.Running} />,
    );
    expect(result.queryByText('No logs found.')).toBeInTheDocument();
  });

  it('should render waiting to start', () => {
    const result = render(
      <TaskRunLogs podName={null} namespace="test" taskName="task" status={runStatus.Idle} />,
    );
    expect(result.queryByText('Waiting on task to start.')).toBeInTheDocument();
  });

  it('should render no logs due to Skipped status', () => {
    const result = render(
      <TaskRunLogs podName={null} namespace="test" taskName="task" status={runStatus.Skipped} />,
    );
    expect(result.queryByText('No logs. This task was skipped.')).toBeInTheDocument();
  });
});
