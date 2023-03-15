import * as React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { PipelineTask } from '../../../../types';
import { runStatus } from '../../../../utils/pipeline-utils';
import TaskRunDetails from '../TaskRunDetails';

describe('TaskRunDetails', () => {
  it('should handle skipped tasks', () => {
    const result = render(
      <TaskRunDetails status={runStatus.Skipped} taskRun={{} as PipelineTask} />,
    );
    expect(result.queryByText('This task was skipped.')).toBeInTheDocument();
  });

  it('should display task info', () => {
    const result = render(
      <TaskRunDetails
        status={runStatus.Running}
        taskRun={{ status: { taskSpec: { description: 'test' } } } as PipelineTask}
      />,
    );
    expect(result.queryByText('Description')).toBeInTheDocument();
    expect(result.queryByText('test')).toBeInTheDocument();
  });

  it('should display task results', () => {
    const result = render(
      <TaskRunDetails
        status={runStatus.Succeeded}
        taskRun={
          { status: { taskResults: [{ name: 'test-name', value: 'test-value' }] } } as PipelineTask
        }
      />,
    );
    expect(result.queryByText('Results')).toBeInTheDocument();
    expect(result.queryByText('test-name')).toBeInTheDocument();
    expect(result.queryByText('test-value')).toBeInTheDocument();
  });
});
