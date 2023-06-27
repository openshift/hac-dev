import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, render, within, fireEvent, act } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../../__data__/pipelinerun-data';
import { TektonResourceLabel } from '../../../../types';
import { HttpError } from '../../../utils/error/http-error';
import PipelineRunLogs from '../PipelineRunLogs';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('PipelineRunLogs', () => {
  const pipelineRun = testPipelineRuns[DataState.SUCCEEDED];
  const testTaskRuns = Object.keys(pipelineRun.status.taskRuns).map((trName) => ({
    apiVersion: 'v1alpha1',
    kind: 'TaskRun',
    metadata: {
      labels: {
        [TektonResourceLabel.pipelineTask]: pipelineRun.status.taskRuns[trName].pipelineTaskName,
      },
      name: trName,
    },
    spec: {},
    status: pipelineRun.status.taskRuns[trName].status,
  }));

  beforeEach(() => {
    watchResourceMock.mockReturnValue([{ metadata: { name: 'test-pod' } }, true]);
    (window.HTMLSpanElement as any).prototype.scrollIntoView = () => {};
  });
  afterEach(() => {
    (window.HTMLSpanElement as any).prototype.scrollIntoView = undefined;
  });

  it('should render task list and log window', () => {
    render(<PipelineRunLogs obj={pipelineRun} taskRuns={testTaskRuns} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('logs-task-container');
  });

  it('should render select and render the first task log', () => {
    render(<PipelineRunLogs obj={pipelineRun} taskRuns={testTaskRuns} activeTask="first" />);

    screen.getByTestId('logs-tasklist');
    within(screen.getByTestId('logs-taskName')).getByText('first');
  });

  it('should render waiting for logs message', () => {
    const runningPipelineRun = testPipelineRuns[DataState.RUNNING];

    render(
      <PipelineRunLogs
        obj={runningPipelineRun}
        taskRuns={[{ ...testTaskRuns[0], status: { ...testTaskRuns[0].status, podName: '' } }]}
      />,
    );

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('task-logs-error');

    screen.getByText('Waiting for first task to start');
  });

  it('should show no logs found message when pipelinerun status is missing', () => {
    const plrWithNoStatus = testPipelineRuns[DataState.RUNNING];
    plrWithNoStatus.status = undefined;

    render(<PipelineRunLogs obj={plrWithNoStatus} taskRuns={[]} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('task-logs-error');

    screen.getByText('No logs found');
  });

  it('should show no taskruns found when taskruns are pruned ', () => {
    const succeededPLR = testPipelineRuns[DataState.SUCCEEDED];

    render(<PipelineRunLogs obj={succeededPLR} taskRuns={[]} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('task-logs-error');

    screen.getByText('No task runs found');
  });

  it('should show error message if the pipelinerun is failed', () => {
    const failedPLR = testPipelineRuns[DataState.FAILED];

    render(<PipelineRunLogs obj={failedPLR} taskRuns={[]} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('task-logs-error');

    screen.getByText('Error retrieving pipeline for pipelinerun');
  });

  it('should render logs no longer available message when pods are not available', () => {
    watchResourceMock.mockReturnValue([
      null,
      true,
      new HttpError('pod not found', 404, null, { statusText: 'some status message' }),
    ]);
    render(<PipelineRunLogs obj={pipelineRun} taskRuns={testTaskRuns} />);

    screen.getByTestId('logs-error-message');
    screen.getByText('Logs are no longer accessible for finally-do-something task');
  });

  it('should render the task names in the same order when a task is clicked', () => {
    render(<PipelineRunLogs obj={pipelineRun} taskRuns={testTaskRuns} />);

    const expectTasktoBeOrdered = () => {
      const logsContainer = within(screen.getByTestId('logs-tasklist'));

      const first = logsContainer.getByText('first');
      const second = logsContainer.getByText('second');
      const generateSuffix = logsContainer.getByText('generate-suffix');
      const doSomething = logsContainer.getByText('do-something');

      expect(first.compareDocumentPosition(second)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(second.compareDocumentPosition(generateSuffix)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(generateSuffix.compareDocumentPosition(doSomething)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    };

    expectTasktoBeOrdered();

    fireEvent.click(screen.getByText('second'));

    act(() => {
      expectTasktoBeOrdered();
    });

    fireEvent.click(screen.getByText('do-something'));

    act(() => {
      expectTasktoBeOrdered();
    });
  });
});
