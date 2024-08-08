import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskRunKind } from '../../../../types';
import { runStatus } from '../../../../utils/pipeline-utils';
import TaskRunDetails from '../TaskRunDetails';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props: any) => <a href={props.to}>{props.children}</a>,
  };
});

describe('TaskRunDetails', () => {
  it('should handle skipped tasks', () => {
    const { container } = render(<TaskRunDetails status={runStatus.Skipped} />);
    expect(container).toHaveTextContent('This task was skipped.');
  });

  it('should display task description', () => {
    const result = render(
      <TaskRunDetails
        status={runStatus.Running}
        taskRun={
          {
            apiVersion: 'tekton.dev/v1',
            status: { taskSpec: { description: 'test' } },
          } as TaskRunKind
        }
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
          {
            apiVersion: 'tekton.dev/v1',
            status: {
              startTime: '2023-03-15T20:12:55Z',
              completionTime: '2023-03-15T20:13:13Z',
              results: [{ name: 'test-name', value: 'test-value' }],
            },
          } as TaskRunKind
        }
      />,
    );
    expect(result.queryByText('Started')).toBeInTheDocument();
    expect(result.queryByText('Duration')).toBeInTheDocument();
    expect(result.queryByText('18 seconds')).toBeInTheDocument();
    expect(result.queryByText('Results')).toBeInTheDocument();
    expect(result.queryByText('test-name')).toBeInTheDocument();
    expect(result.queryByText('test-value')).toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Fixable vulnerabilities scan');
  });

  it('should render task run vulnerabilities scan results', () => {
    const { container } = render(
      <TaskRunDetails
        status={runStatus.Succeeded}
        taskRun={
          {
            apiVersion: 'tekton.dev/v1',
            metadata: {
              labels: {
                'tekton.dev/pipelineTask': 'clair-scan',
              },
            },
            status: {
              results: [
                {
                  name: 'SCAN_OUTPUT',
                  value: '{"vulnerabilities":{"critical":0,"high":0,"medium":1,"low":0}}',
                },
              ],
            },
          } as unknown as TaskRunKind
        }
      />,
    );
    expect(container).toHaveTextContent('Fixable vulnerabilities scan');
  });
});
