import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { useNamespace } from '../../../../../../../../utils/namespace-context-utils';
import {
  useBuildPipelines,
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleaseLinks,
} from '../../../../../../../hooks';
import { WorkflowNodeType } from '../../types';
import {
  sampleBuildPipelines,
  sampleComponents,
  sampleEnvironments,
} from '../__data__/workflow-data';
import { useAppWorkflowData } from '../useAppWorkflowData';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../../../../../utils/namespace-context-utils', () => ({
  useNamespace: jest.fn(() => 'test-ns'),
}));

jest.mock('../../../../../../../hooks/', () => ({
  useComponents: jest.fn(() => [[], true]),
  useIntegrationTestScenarios: jest.fn(() => [[], true]),
  useBuildPipelines: jest.fn(() => [[], true]),
  useEnvironments: jest.fn(() => [[], true]),
  useReleaseLinks: jest.fn(() => [[], true]),
}));

const useActiveNamespaceMock = useNamespace as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useIntegrationTestScenariosMock = useIntegrationTestScenarios as jest.Mock;
const useBuildPipelinesMock = useBuildPipelines as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;
const useReleaseLinksMock = useReleaseLinks as jest.Mock;

beforeEach(() => {
  useActiveNamespaceMock.mockReturnValue('test-ns');
  useComponentsMock.mockReturnValue([[], true]);
  useIntegrationTestScenariosMock.mockReturnValue([[], true]);
  useBuildPipelinesMock.mockReturnValue([[], true]);
  useEnvironmentsMock.mockReturnValue([[], true]);
  useReleaseLinksMock.mockReturnValue([[], true]);

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

afterEach(jest.resetAllMocks);

test('should early return empty values if any one of the resources is not loaded', () => {
  useComponentsMock.mockReturnValue([[], false]);
  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes, loaded] = result.current;

  expect(nodes).toHaveLength(0);
  expect(loaded).toBe(false);
});

test('should return the basic workflow nodes', () => {
  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes, loaded] = result.current;

  expect(nodes).toHaveLength(6);
  expect(loaded).toBe(true);
});

test('should return disabled nodes if the resources are not created', () => {
  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes, loaded] = result.current;

  expect(nodes).toHaveLength(6);
  expect(nodes.filter((n) => n.data.isDisabled)).toHaveLength(6);
  expect(loaded).toBe(true);
});

test('Abstract nodes should contain staic name', () => {
  useComponentsMock.mockReturnValue([sampleComponents, true]);
  useBuildPipelinesMock.mockReturnValue([sampleBuildPipelines, true]);

  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes] = result.current;

  expect(nodes[0].data.label).toBe('Components');
  expect(nodes[1].data.label).toBe('Builds');
});

test('Non Abstract nodes should contain dynamic name', () => {
  useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);

  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes] = result.current;
  const {
    metadata: { name: envName },
  } = sampleEnvironments[0];
  const environmentNode = nodes.find((n) => n.data.workflowType === WorkflowNodeType.ENVIRONMENT);

  expect(environmentNode.data.label).toBe(envName);
});

test('nodes should be disabled / enabled based on the availability of resources', () => {
  useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);

  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes] = result.current;
  const disabledNodes = nodes.filter((n) => n.data.isDisabled);
  const enabledNodes = nodes.filter((node) => !node.data.isDisabled);

  expect(disabledNodes).toHaveLength(5);
  expect(enabledNodes).toHaveLength(3);
});

test('label should change based on the availability of resources', () => {
  useComponentsMock.mockReturnValue([sampleComponents, true]);

  const { result } = renderHook(() => useAppWorkflowData('test'));
  const [nodes] = result.current;
  const sourceNode = nodes.find((n) => n.data.workflowType === WorkflowNodeType.SOURCE);
  const environmentNode = nodes.find((n) => n.data.workflowType === WorkflowNodeType.ENVIRONMENT);

  expect(sourceNode.data.label).toBe('Components');
  expect(environmentNode.data.label).toBe('No environment set');
});
