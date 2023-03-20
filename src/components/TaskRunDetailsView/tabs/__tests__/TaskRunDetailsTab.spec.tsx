import * as React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { testTaskRuns } from '../../../TaskRunListView/__data__/mock-TaskRun-data';
import TaskRunDetailsTab from '../TaskRunDetailsTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../topology/factories/VisualizationFactory', () => () => <div />);

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('TaskRunDetailsTab', () => {
  it('should render the taskrun details tab', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<TaskRunDetailsTab taskRun={testTaskRuns[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('Task run details');
  });

  it('should render the taskrun and task name', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<TaskRunDetailsTab taskRun={testTaskRuns[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('example');
    screen.getByText('example-task');
  });

  it('should render the plr link', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<TaskRunDetailsTab taskRun={testTaskRuns[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByRole('link', { name: /example-pipelinerun/ })).toBeInTheDocument();
  });

  it('should render application link', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<TaskRunDetailsTab taskRun={testTaskRuns[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByRole('link', { name: /example-app/ })).toBeInTheDocument();
  });

  it('should render log link', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<TaskRunDetailsTab taskRun={testTaskRuns[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByRole('link', { name: /logs/ })).toBeInTheDocument();
  });
});
