import * as React from 'react';
import '@testing-library/jest-dom';
import { useSearchParams } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { act, configure, fireEvent, screen } from '@testing-library/react';
import { useSearchParam } from '../../../../../../hooks/useSearchParam';
import { useSnapshotsEnvironmentBindings } from '../../../../../../hooks/useSnapshotsEnvironmentBindings';
import { CustomError } from '../../../../../../shared/utils/error/custom-error';
import { mockLocation, routerRenderer } from '../../../../../../utils/test-utils';
import { useWorkspaceInfo } from '../../../../../../utils/workspace-context-utils';
import { mockSnapshotsEnvironmentBindings, mockComponentsData } from '../../../../__data__';
import { getMockWorkflows } from '../../../../__data__/WorkflowTestUtils';
import AppWorkflowSection from '../AppWorkflowSection';

mockLocation();

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../../../../shared/hooks/useQueryParams', () => ({
  useQueryParams: () => new Map(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useSearchParams: jest.fn(),
  };
});
jest.mock('../../../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

(SVGGraphicsElement as any).getBBox = jest.fn(() => ({ width: 100, height: 100 }));

const useSearchParamMock = useSearchParam as jest.Mock;

const params: any = {};

const mockUseSearchParam = (name: string) => {
  const setter = (value) => {
    params[name] = value;
  };
  const unset = () => {
    params[name] = '';
  };
  return [params[name], setter, unset];
};

jest.mock('../../../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('../../../../../../hooks/useIntegrationTestScenarios', () => ({
  useIntegrationTestScenarios: jest.fn(),
}));
jest.mock('../../../../../../hooks/useLatestBuildPipelines', () => ({
  useLatestBuildPipelines: jest.fn(),
}));
jest.mock('../../../../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));
jest.mock('../../../../../../hooks/useReleases', () => ({
  useReleases: jest.fn(),
}));
jest.mock('../../../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));
jest.mock('../../../../../../hooks/useLatestIntegrationTestPipelines', () => ({
  useLatestIntegrationTestPipelines: jest.fn(),
}));
jest.mock('../../../../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));
jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useSearchParamsMock = useSearchParams as jest.Mock;

const useWorkspaceInfoMock = useWorkspaceInfo as jest.Mock;
const useSnapshotsEnvironmentBindingsMock = useSnapshotsEnvironmentBindings as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

const { workflowMocks, applyWorkflowMocks } = getMockWorkflows();

configure({ testIdAttribute: 'data-id' });

describe('useAppWorkflowData hook', () => {
  let searchParams: URLSearchParams;

  beforeEach(() => {
    params.expanded = undefined;
    useWorkspaceInfoMock.mockReturnValue({ workspace: 'test-ws' });
    useFeatureFlagMock.mockReturnValue([false]);
    applyWorkflowMocks(workflowMocks);

    useSearchParamMock.mockImplementation(mockUseSearchParam);

    searchParams = new URLSearchParams();
    useSearchParamsMock.mockImplementation(() => [
      searchParams,
      (newParams: URLSearchParams) => {
        searchParams = newParams;
        window.location.search = `?${newParams.toString()}`;
      },
    ]);

    (window.SVGElement as any).prototype.getBBox = () => ({
      x: 100,
      y: 100,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    (window.SVGElement as any).prototype.getBBox = undefined;
  });

  it('should render the graph error state', () => {
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([
      mockSnapshotsEnvironmentBindings,
      true,
      [new CustomError('Model does not exist')],
    ]);

    routerRenderer(<AppWorkflowSection applicationName="test-dev-samples" />);
    screen.queryByText('graph-error-state');
  });

  it('should render the graph unexpanded by default', () => {
    routerRenderer(<AppWorkflowSection applicationName="test-dev-samples" />);
    const graph = screen.getByTestId('application-overview-graph');
    expect(graph).toBeVisible();
    const nodes = graph.querySelectorAll('[data-kind="node"]');
    expect(nodes).toHaveLength(5);
  });
  it('should render the graph expanded when set', () => {
    params.expanded = 'true';
    routerRenderer(<AppWorkflowSection applicationName="test-dev-samples" />);
    const graph = screen.getByTestId('application-overview-graph');
    expect(graph).toBeVisible();
    const nodes = graph.querySelectorAll('[data-kind="node"]');
    expect(nodes).toHaveLength(23);
    const workFlowNodes = graph.querySelectorAll('[data-type="workflow-node"]');
    expect(workFlowNodes).toHaveLength(12);
  });
  it('should navigate to the correct tab on a node click', async () => {
    act(() => {
      routerRenderer(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const componentsNode = screen.getByTestId('components');

    expect(componentsNode).toBeVisible();
    const clickable = componentsNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();

    fireEvent.click(clickable);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/test-dev-samples/components',
    );
  });
  it('should navigate to the correct tab on a group node click', async () => {
    act(() => {
      routerRenderer(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const componentsNode = screen.getByTestId('components');

    expect(componentsNode).toBeVisible();
    const clickable = componentsNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();

    fireEvent.click(clickable);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/test-dev-samples/components',
    );
  });
  it('should navigate to the correct tab on a node click', async () => {
    params.expanded = 'true';
    act(() => {
      routerRenderer(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const components = screen.queryAllByTestId('components');

    expect(components[1]).toBeVisible();
    const clickable = components[1].querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();

    fireEvent.click(clickable);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/application-pipeline/workspaces/test-ws/applications/test-dev-samples/components/${mockComponentsData[0].metadata.name}`,
    );
  });
});
