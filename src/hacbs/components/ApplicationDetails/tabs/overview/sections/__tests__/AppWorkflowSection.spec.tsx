import * as React from 'react';
import '@testing-library/jest-dom';
import { useSearchParams } from 'react-router-dom';
import { act, configure, fireEvent, render, screen } from '@testing-library/react';
import { useSearchParam } from '../../../../../../../hooks/useSearchParam';
import { useNamespace } from '../../../../../../../utils/namespace-context-utils';
import { mockLocation } from '../../../../../../../utils/test-utils';
import {
  useApplicationSnapshotsEB,
  useBuildPipelines,
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleasePlans,
  useReleases,
  useTestPipelines,
} from '../../../../../../hooks';
import {
  mockApplicationSnapshotEBs,
  mockBuildPipelinesData,
  mockComponentsData,
  mockEnvironmentsData,
  mockIntegrationTestScenariosData,
  mockReleasePlansData,
  mockReleasesData,
  mockTestPipelinesData,
} from '../__data__';
import AppWorkflowSection from '../AppWorkflowSection';

mockLocation();

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../../../../utils/namespace-context-utils', () => ({
  useNamespace: jest.fn(() => 'test-ns'),
}));

jest.mock('../../../../../../../shared/hooks/useQueryParams', () => ({
  useQueryParams: () => new Map(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useSearchParams: jest.fn(),
  };
});
jest.mock('../../../../../../../hooks/useSearchParam', () => ({
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

jest.mock('../../../../../../hooks/', () => ({
  useComponents: jest.fn(() => [[], true]),
  useIntegrationTestScenarios: jest.fn(() => [[], true]),
  useBuildPipelines: jest.fn(() => [[], true]),
  useEnvironments: jest.fn(() => [[], true]),
  useReleases: jest.fn(() => [[], true]),
  useReleasePlans: jest.fn(() => [[], true]),
  useTestPipelines: jest.fn(() => [[], true]),
  useApplicationSnapshotsEB: jest.fn(() => [[], true]),
}));

const useSearchParamsMock = useSearchParams as jest.Mock;

const useActiveNamespaceMock = useNamespace as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useIntegrationTestScenariosMock = useIntegrationTestScenarios as jest.Mock;
const useBuildPipelinesMock = useBuildPipelines as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;
const useReleasesMock = useReleases as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;
const useTestPipelinesMock = useTestPipelines as jest.Mock;
const useApplicationSnapshotsEBMock = useApplicationSnapshotsEB as jest.Mock;

configure({ testIdAttribute: 'data-id' });

describe('useAppWorkflowData hook', () => {
  let searchParams: URLSearchParams;

  beforeEach(() => {
    params.expanded = undefined;
    useActiveNamespaceMock.mockReturnValue('test-ns');
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
    useIntegrationTestScenariosMock.mockReturnValue([mockIntegrationTestScenariosData, true]);
    useBuildPipelinesMock.mockReturnValue([mockBuildPipelinesData, true]);
    useEnvironmentsMock.mockReturnValue([mockEnvironmentsData, true]);
    useReleasePlansMock.mockReturnValue([mockReleasePlansData, true]);
    useReleasesMock.mockReturnValue([mockReleasesData, true]);
    useTestPipelinesMock.mockReturnValue([mockTestPipelinesData, true]);
    useApplicationSnapshotsEBMock.mockReturnValue([mockApplicationSnapshotEBs, true]);

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

  it('should render the graph unexpanded by default', () => {
    render(<AppWorkflowSection applicationName="test-dev-samples" />);
    const graph = screen.getByTestId('application-overview-graph');
    expect(graph).toBeVisible();
    const nodes = graph.querySelectorAll('[data-kind="node"]');
    expect(nodes).toHaveLength(6);
  });
  it('should render the graph expanded when set', () => {
    params.expanded = 'true';
    render(<AppWorkflowSection applicationName="test-dev-samples" />);
    const graph = screen.getByTestId('application-overview-graph');
    expect(graph).toBeVisible();
    const nodes = graph.querySelectorAll('[data-kind="node"]');
    expect(nodes).toHaveLength(28);
    const workFlowNodes = graph.querySelectorAll('[data-type="workflow-node"]');
    expect(workFlowNodes).toHaveLength(16);
  });
  it('should navigate to the correct tab on a node click', async () => {
    act(() => {
      render(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const componentsNode = screen.getByTestId('components');

    expect(componentsNode).toBeVisible();
    const clickable = componentsNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();

    fireEvent.click(clickable);
    expect(window.location.search).toBe('?activeTab=components');
  });
  it('should navigate to the correct tab on a group node click', async () => {
    act(() => {
      render(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const componentsNode = screen.getByTestId('components');

    expect(componentsNode).toBeVisible();
    const clickable = componentsNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();

    fireEvent.click(clickable);
    expect(window.location.search).toBe('?activeTab=components');
  });
  it('should navigate to the correct tab on a node click', async () => {
    params.expanded = 'true';
    act(() => {
      render(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const components = screen.queryAllByTestId('components');

    expect(components[1]).toBeVisible();
    const clickable = components[1].querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();

    fireEvent.click(clickable);
    expect(window.location.search).toBe(
      `?activeTab=components&name=${mockComponentsData[0].metadata.name}`,
    );
  });
});
