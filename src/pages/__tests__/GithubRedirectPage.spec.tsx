import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { fetchPipelineRun } from '../../utils/pipeline-utils';
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

jest.mock('../../utils/pipeline-utils', () => ({ fetchPipelineRun: jest.fn() }));

const mockUseParams = useParams as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;
const mockUsePipelineRun = fetchPipelineRun as jest.Mock;

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
  it('should render loading indicator while pipeline run is loading', async () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(false) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: undefined,
    });
    mockUsePipelineRun.mockReturnValue(getMockPipelineRun());
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });

    await waitFor(() => screen.getByRole('progressbar'));
  });

  it('should render navigate when pipelinerun is loaded', async () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(false) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: undefined,
    });
    mockUsePipelineRun.mockReturnValue(getMockPipelineRun('mock-application'));
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    const navigate = await waitFor(() => screen.getByRole('navigate'));
    expect(navigate.innerHTML).toEqual(
      '/application-pipeline/workspaces/mock-workspace/applications/mock-application/pipelineruns/mock-pipeline',
    );
  });

  it('should render navigate with logs url', async () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(true) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: undefined,
    });
    mockUsePipelineRun.mockReturnValue(getMockPipelineRun('mock-application'));
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    const navigate = await waitFor(() => screen.getByRole('navigate'));
    expect(navigate.innerHTML).toEqual(
      '/application-pipeline/workspaces/mock-workspace/applications/mock-application/pipelineruns/mock-pipeline/logs',
    );
  });

  it('should render navigate with task run logs url', async () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(true) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: 'mock-task',
    });
    mockUsePipelineRun.mockReturnValue(getMockPipelineRun('mock-application'));
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    const navigate = await waitFor(() => screen.getByRole('navigate'));
    expect(navigate.innerHTML).toEqual(
      '/application-pipeline/workspaces/mock-workspace/applications/mock-application/pipelineruns/mock-pipeline/logs?task=mock-task',
    );
  });

  it('should render error state when pipeline run not found', async () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname(true) });
    mockUseParams.mockReturnValue({
      ns: 'mock-workspace',
      pipelineRun: 'mock-pipeline',
      task: 'mock-task',
    });
    mockUsePipelineRun.mockRejectedValue({ code: 404 });
    namespaceRenderer(<GithubRedirectPage />, 'mock', { workspacesLoaded: true });
    await waitFor(() => screen.getByText('404: Page not found'));
  });
});
