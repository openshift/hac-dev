import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, render, screen } from '@testing-library/react';
import { useApplicationHealthStatus } from '../../../../../../../hooks';
import { useSearchParam } from '../../../../../../../hooks/useSearchParam';
import { GitOpsDeploymentHealthStatus } from '../../../../../../../types/gitops-deployment';
import { useNamespace } from '../../../../../../../utils/namespace-context-utils';
import { mockLocation } from '../../../../../../../utils/test-utils';
import {
  useBuildPipelines,
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleasePlans,
} from '../../../../../../hooks';
import {
  mockComponentsData,
  mockEnvironmentsData,
  mockBuildPipelinesData,
  mockReleasePlansData,
  mockIntegrationTestScenariosData,
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

jest.mock('../../../../../../../hooks/', () => ({
  useApplicationHealthStatus: jest.fn(() => [[], true]),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});
jest.mock('../../../../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

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
  useReleasePlans: jest.fn(() => [[], true]),
}));

const useActiveNamespaceMock = useNamespace as jest.Mock;
const useApplicationHealthStatusMock = useApplicationHealthStatus as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useIntegrationTestScenariosMock = useIntegrationTestScenarios as jest.Mock;
const useBuildPipelinesMock = useBuildPipelines as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;

configure({ testIdAttribute: 'data-id' });

describe('useAppWorkflowData hook', () => {
  beforeEach(() => {
    useActiveNamespaceMock.mockReturnValue('test-ns');
    useApplicationHealthStatusMock.mockReturnValue([
      GitOpsDeploymentHealthStatus.Degraded,
      null,
      true,
    ]);
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
    useIntegrationTestScenariosMock.mockReturnValue([mockIntegrationTestScenariosData, true]);
    useBuildPipelinesMock.mockReturnValue([mockBuildPipelinesData, true]);
    useEnvironmentsMock.mockReturnValue([mockEnvironmentsData, true]);
    useReleasePlansMock.mockReturnValue([mockReleasePlansData, true]);

    useSearchParamMock.mockImplementation(mockUseSearchParam);
  });

  afterEach(jest.resetAllMocks);

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
    expect(nodes).toHaveLength(22);
    const workFlowNodes = graph.querySelectorAll('[data-type="workflow-node"]');
    expect(workFlowNodes).toHaveLength(16);
  });
  // can't actually draw the nodes :(
  xit('should navigate to the correct tab on a node click', async () => {
    act(() => {
      render(<AppWorkflowSection applicationName="test-dev-samples" />);
    });
    const components = screen.getByTestId('components');
    expect(components).toBeVisible();

    const componentsNode = await screen.findByTestId('[data-id="components-node"]');
    expect(componentsNode).toBeVisible();

    fireEvent.click(componentsNode);
    expect(params.activeTab).toBe('components');
  });
});
