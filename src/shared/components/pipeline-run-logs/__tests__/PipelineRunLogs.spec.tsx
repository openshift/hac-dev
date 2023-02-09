import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, render, within } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../../__data__/pipelinerun-data';
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

  beforeEach(() => {
    watchResourceMock.mockReturnValue([{ metadata: { name: 'test-pod' } }, true]);
  });

  it('should render task list and log window', () => {
    render(<PipelineRunLogs obj={pipelineRun} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('logs-task-container');
  });

  it('should render select and render the first task log', () => {
    render(<PipelineRunLogs obj={pipelineRun} activeTask="first" />);

    screen.getByTestId('logs-tasklist');
    within(screen.getByTestId('logs-taskName')).getByText('first');
  });

  it('should render waiting for logs message', () => {
    const runningPipelineRun = testPipelineRuns[DataState.RUNNING];
    runningPipelineRun.status.taskRuns['test-caseqfvdj-first'].status.podName = '';

    render(<PipelineRunLogs obj={runningPipelineRun} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('task-logs-error');

    screen.getByText('Waiting for first task to start');
  });

  it('should no logs found message when pipelinerun status is misisng', () => {
    const plrWithNoStatus = testPipelineRuns[DataState.RUNNING];
    plrWithNoStatus.status = undefined;

    render(<PipelineRunLogs obj={plrWithNoStatus} />);

    screen.getByTestId('logs-tasklist');
    screen.getByTestId('task-logs-error');

    screen.getByText('No logs found');
  });

  it('should render logs no longer available message when pods are not available', () => {
    watchResourceMock.mockReturnValue([
      null,
      true,
      new HttpError('pod not found', 404, null, { statusText: 'some status message' }),
    ]);
    render(<PipelineRunLogs obj={pipelineRun} />);

    screen.getByTestId('logs-error-message');
    screen.getByText('Logs are no longer accessible for do-something task');
  });
});
