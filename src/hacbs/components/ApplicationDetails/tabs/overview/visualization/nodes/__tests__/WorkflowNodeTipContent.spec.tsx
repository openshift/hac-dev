import * as React from 'react';
import '@testing-library/jest-dom';
import { ModelKind, Node, NodeModel, Visualization } from '@patternfly/react-topology';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useApplicationHealthStatus } from '../../../../../../../../hooks';
import { GitOpsDeploymentHealthStatus } from '../../../../../../../../types/gitops-deployment';
import { useNamespace } from '../../../../../../../../utils/namespace-context-utils';
import {
  useBuildPipelines,
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleasePlans,
} from '../../../../../../../hooks';
import { layoutFactory, PipelineLayout } from '../../../../../../topology/factories';
import {
  mockBuildPipelinesData,
  mockComponentsData,
  mockEnvironmentsData,
  mockIntegrationTestScenariosData,
  mockReleasePlansData,
} from '../../../sections/__data__';
import { componentFactory } from '../../factories';
import { useAppWorkflowData } from '../../hooks/useAppWorkflowData';
import { WorkflowNodeModelData } from '../../types';
import { TYPE_DESCRIPTIONS } from '../../utils/node-utils';
import WorkflowNodeTipContent from '../WorkflowNodeTipContent';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../../../../../utils/namespace-context-utils', () => ({
  useNamespace: jest.fn(() => 'test-ns'),
}));

jest.mock('../../../../../../../../hooks/', () => ({
  useApplicationHealthStatus: jest.fn(() => [[], true]),
}));

jest.mock('../../../../../../../hooks/', () => ({
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

let activeTab: string;
let filter: { name: string; value: string };
const setActiveTab = jest.fn(
  (tabData: { tab: string; filter?: { name: string; value: string } }) => {
    activeTab = tabData.tab;
    filter = tabData.filter;
  },
);

describe('WorkflowNode', () => {
  beforeEach(() => {
    activeTab = 'overview';
    filter = undefined;

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

    const createElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => ({
            measureText: () => ({}),
          }),
        };
      }
      return createElement(tagName);
    };
  });

  const getController = (expanded: boolean) => {
    const { result } = renderHook(() => useAppWorkflowData('test', expanded));
    const [model] = result.current;

    const mockGraph = {
      x: 15,
      y: 15,
      id: 'application-overview-graph',
      type: ModelKind.graph,
      layout: PipelineLayout.WORKFLOW_VISUALIZATION,
    };
    const mockModel = { graph: mockGraph, ...model };
    const visualization = new Visualization();
    visualization.setRenderConstraint(false);
    visualization.registerLayoutFactory(layoutFactory);
    visualization.registerComponentFactory(componentFactory);
    visualization.fromModel(mockModel);
    return visualization;
  };

  it('should render group node tooltips', () => {
    const visualization = getController(false);

    let mockElement = visualization.getNodeById('components');
    let tipContent = render(
      <WorkflowNodeTipContent setActiveTab={setActiveTab} element={mockElement} />,
    );

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    let link = screen.getByTestId('element-link');
    fireEvent.click(link);
    expect(activeTab).toBe('components');
    expect(filter).toBeUndefined();
    expect(screen.getAllByTestId('child-row')).toHaveLength(3);
    tipContent.unmount();

    mockElement = visualization.getNodeById('builds');
    tipContent = render(
      <WorkflowNodeTipContent setActiveTab={setActiveTab} element={mockElement} />,
    );

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    link = screen.getByTestId('pipeline-runs-link');
    fireEvent.click(link);
    expect(activeTab).toBe('pipelineruns');
    expect(filter).toBeUndefined();
    expect(screen.getAllByTestId('child-row')).toHaveLength(1);
    tipContent.unmount();

    mockElement = visualization.getNodeById('tests');
    tipContent = render(
      <WorkflowNodeTipContent setActiveTab={setActiveTab} element={mockElement} />,
    );

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();

    link = screen.getByTestId('element-link');
    fireEvent.click(link);
    expect(activeTab).toBe('integrationtests');
    expect(filter).toBeUndefined();

    link = screen.getByTestId('pipeline-runs-link');
    fireEvent.click(link);
    expect(activeTab).toBe('pipelineruns');
    expect(filter).toBeUndefined();
    expect(screen.getAllByTestId('child-row')).toHaveLength(4);

    tipContent.unmount();
  });
  it('should render node tooltips', () => {
    const visualization = getController(true);
    const mockGroup = visualization.getNodeById('components');
    const mockElement = mockGroup.getChildren()[0] as Node<NodeModel, WorkflowNodeModelData>;

    render(<WorkflowNodeTipContent setActiveTab={setActiveTab} element={mockElement} />);

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    const link = screen.getByTestId('element-link');
    fireEvent.click(link);
    expect(activeTab).toBe('components');
    expect(filter.name).toBe('name');
    expect(filter.value).toBe(mockElement.getLabel());
    expect(screen.queryAllByTestId('child-row')).toHaveLength(0);
  });
});
