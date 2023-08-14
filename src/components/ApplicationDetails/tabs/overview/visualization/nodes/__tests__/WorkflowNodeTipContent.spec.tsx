import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { ModelKind, Node, NodeModel, Visualization } from '@patternfly/react-topology';
import { screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { routerRenderer } from '../../../../../../../utils/test-utils';
import { useWorkspaceInfo } from '../../../../../../../utils/workspace-context-utils';
import { layoutFactory, PipelineLayout } from '../../../../../../topology/factories';
import { mockComponentsData } from '../../../../../__data__';
import { getMockWorkflows } from '../../../../../__data__/WorkflowTestUtils';
import { componentFactory } from '../../factories';
import { useAppWorkflowData } from '../../hooks/useAppWorkflowData';
import { WorkflowNodeModelData } from '../../types';
import { getLinkDataForElement, TYPE_DESCRIPTIONS } from '../../utils/node-utils';
import WorkflowNodeTipContent from '../WorkflowNodeTipContent';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useWorkspaceInfoMock = useWorkspaceInfo as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

const { workflowMocks, applyWorkflowMocks } = getMockWorkflows();

describe('WorkflowNode', () => {
  beforeEach(() => {
    useWorkspaceInfoMock.mockReturnValue({ namespace: 'test-ns', workspace: 'test-ws' });
    applyWorkflowMocks(workflowMocks);
    useFeatureFlagMock.mockReturnValue([false]);

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
    let tipContent = routerRenderer(<WorkflowNodeTipContent element={mockElement} />);

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    let linkData = getLinkDataForElement(mockElement, 'test-ws');
    expect(linkData.tab).toBe('components');
    expect(linkData.filter).toBeUndefined();
    expect(screen.getAllByTestId('child-row')).toHaveLength(mockComponentsData.length);
    tipContent.unmount();

    mockElement = visualization.getNodeById('builds');
    tipContent = routerRenderer(<WorkflowNodeTipContent element={mockElement} />);

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pipeline-runs-link')).toBeVisible();
    expect(screen.getAllByTestId('child-row')).toHaveLength(mockComponentsData.length);
    tipContent.unmount();

    mockElement = visualization.getNodeById('tests');
    tipContent = routerRenderer(<WorkflowNodeTipContent element={mockElement} />);

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();

    expect(screen.getByTestId('element-link')).toBeVisible();
    linkData = getLinkDataForElement(mockElement, 'test-ws');
    expect(linkData.tab).toBe('integrationtests');
    expect(linkData.filter).toBeUndefined();

    expect(screen.getByTestId('pipeline-runs-link')).toBeVisible();
    expect(screen.getAllByTestId('child-row')).toHaveLength(4);

    tipContent.unmount();
  });

  it('should render node tooltips', () => {
    const visualization = getController(true);
    const mockGroup = visualization.getNodeById('components');
    const mockElement = mockGroup.getChildren()[0] as Node<NodeModel, WorkflowNodeModelData>;
    const mockBuildGroup = visualization.getNodeById('builds');
    const mockBuildElement = mockBuildGroup.getChildren()[1] as Node<
      NodeModel,
      WorkflowNodeModelData
    >;

    routerRenderer(<WorkflowNodeTipContent element={mockElement} />);

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    const link = screen.getByTestId('element-link');
    expect(link).toBeVisible();
    const linkData = getLinkDataForElement(mockElement, 'test-ws');
    expect(linkData.tab).toBe(`components/${mockElement.getLabel()}`);
    expect(linkData.filter).toBeUndefined();
    const buildLinkData = getLinkDataForElement(mockBuildElement, 'test-ws');
    expect(buildLinkData.tab).toBe('activity/pipelineruns');
    expect(buildLinkData.filter.name).toBe('name');
    expect(buildLinkData.filter.value).toBe(mockBuildElement.getData().resources[0].metadata.name);
    expect(screen.queryAllByTestId('child-row')).toHaveLength(0);
    expect(screen.queryByText('View logs')).not.toBeInTheDocument();
  });

  it('should present view logs on test node tooltip', () => {
    const visualization = getController(true);
    const mockGroup = visualization.getNodeById('tests');
    const mockElement = mockGroup.getChildren()[3] as Node<NodeModel, WorkflowNodeModelData>;
    routerRenderer(<WorkflowNodeTipContent element={mockGroup} />);

    expect(
      screen.getByText(TYPE_DESCRIPTIONS[mockElement.getData().workflowType]),
    ).toBeInTheDocument();
    screen.getByText('View logs');
  });
});
