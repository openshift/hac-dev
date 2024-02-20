import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { usePipelineRun } from '../../hooks/usePipelineRuns';
import { namespaceRenderer } from '../../utils/test-utils';
import GithubRedirectPage from '../GithubRedirectPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => () => {},
    useParams: jest.fn(),
    useLocation: jest.fn(),
    Navigate: ({ to }) => <p role="navigate">{to}</p>,
  };
});

jest.mock('../../hooks/useWorkspaceForNamespace', () => ({
  useWorkspaceForNamespace: () => ({ metadata: { name: 'mock-workspace' } }),
}));

jest.mock('../../hooks/usePipelineRuns', () => ({ usePipelineRun: jest.fn() }));

const mockUseParams = useParams as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;
const mockUsePipelineRun = usePipelineRun as jest.Mock;

const getMockPathname = (isLogs: boolean) =>
  `/application-pipeline/ns/mock-workspace-tenant/pipelinerun/mock-pipelinerun/${
    isLogs ? 'logs' : ''
  }`;

const getMockPipelineRun = (application?: string | undefined) => {
  return {
    metadata: {
      name: 'mock-pipelinerun',
      labels: {
        'custome-label': 'value',
        ...(application ? { [PipelineRunLabel.APPLICATION]: application } : {}),
      },
    },
  };
};

describe('GithubRedirect', () => {
  it('should render loading indicator while pipeline run is loading', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(false) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: undefined,
    });
    mockUsePipelineRun.mockReturnValue([getMockPipelineRun(), false]);
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    screen.getByRole('progressbar');
  });

  it('should render navigate when pipelinerun is loaded', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(false) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: undefined,
    });
    mockUsePipelineRun.mockReturnValue([getMockPipelineRun('mock-application'), true, undefined]);
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    const navigate = screen.getByRole('navigate');
    expect(navigate.innerHTML).toEqual(
      '/application-pipeline/workspaces/mock-workspace/applications/mock-application/pipelineruns/mock-pipeline',
    );
  });

  it('should render navigate with logs url', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(true) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: undefined,
    });
    mockUsePipelineRun.mockReturnValue([getMockPipelineRun('mock-application'), true, undefined]);
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    const navigate = screen.getByRole('navigate');
    expect(navigate.innerHTML).toEqual(
      '/application-pipeline/workspaces/mock-workspace/applications/mock-application/pipelineruns/mock-pipeline/logs',
    );
  });

  it('should render navigate with task run logs url', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(true) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: 'mock-task',
    });
    mockUsePipelineRun.mockReturnValue([getMockPipelineRun('mock-application'), true, undefined]);
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    const navigate = screen.getByRole('navigate');
    expect(navigate.innerHTML).toEqual(
      '/application-pipeline/workspaces/mock-workspace/applications/mock-application/taskruns/mock-task/logs',
    );
  });

  it('should render error state when pipeline run not found', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(true) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: 'mock-task',
    });
    mockUsePipelineRun.mockReturnValue([undefined, false, { code: 404 }]);
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    screen.getByText('404: Page not found');
  });
});
