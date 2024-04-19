import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { renderHook } from '@testing-library/react-hooks';
import { useComponents } from '../../../../../../../hooks/useComponents';
import { useEnvironments } from '../../../../../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../../../../../hooks/useIntegrationTestScenarios';
import { useLatestBuildPipelines } from '../../../../../../../hooks/useLatestBuildPipelines';
import { useLatestIntegrationTestPipelines } from '../../../../../../../hooks/useLatestIntegrationTestPipelines';
import { useReleasePlans } from '../../../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../../../hooks/useReleases';
import { useSnapshotsEnvironmentBindings } from '../../../../../../../hooks/useSnapshotsEnvironmentBindings';
import { useWorkspaceInfo } from '../../../../../../../utils/workspace-context-utils';
import { WorkflowNodeType } from '../../types';
import {
  sampleBuildPipelines,
  sampleComponents,
  sampleEnvironments,
  sampleIntegrationTestScenarios,
} from '../__data__/workflow-data';
import { useAppWorkflowData } from '../useAppWorkflowData';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns' })),
}));

jest.mock('../../../../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useIntegrationTestScenarios', () => ({
  useIntegrationTestScenarios: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useLatestBuildPipelines', () => ({
  useLatestBuildPipelines: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useReleases', () => ({
  useReleases: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useLatestIntegrationTestPipelines', () => ({
  useLatestIntegrationTestPipelines: jest.fn(),
}));
jest.mock('../../../../../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useWorkspaceInfoMock = useWorkspaceInfo as jest.Mock;

const useComponentsMock = useComponents as jest.Mock;
const useIntegrationTestScenariosMock = useIntegrationTestScenarios as jest.Mock;
const useLatestBuildPipelinesMock = useLatestBuildPipelines as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;
const useReleasesMock = useReleases as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;
const useLatestIntegrationTestPipelinesMock = useLatestIntegrationTestPipelines as jest.Mock;
const useSnapshotsEnvironmentBindingsMock = useSnapshotsEnvironmentBindings as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

describe('useAppWorkflowData hook', () => {
  beforeEach(() => {
    useWorkspaceInfoMock.mockReturnValue({ namespace: 'test-ns' });
    useComponentsMock.mockReturnValue([[], true]);
    useIntegrationTestScenariosMock.mockReturnValue([[], true]);
    useLatestBuildPipelinesMock.mockReturnValue([[], true]);
    useEnvironmentsMock.mockReturnValue([[], true]);
    useReleasePlansMock.mockReturnValue([[], true]);
    useReleasesMock.mockReturnValue([[], true]);
    useLatestIntegrationTestPipelinesMock.mockReturnValue([[], true]);
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([[], true]);
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

  afterEach(jest.resetAllMocks);

  it('should early return empty values if any one of the resources is not loaded', () => {
    useComponentsMock.mockReturnValue([[], false]);
    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model, loaded] = result.current;

    expect(model.nodes).toHaveLength(0);
    expect(loaded).toBe(false);
  });

  it('should return the basic workflow nodes', () => {
    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model, loaded] = result.current;

    expect(model.nodes).toHaveLength(5);
    expect(model.edges).toHaveLength(4);
    expect(loaded).toBe(true);
  });

  it('should return disabled nodes if the resources are not created', () => {
    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model, loaded] = result.current;

    expect(model.nodes).toHaveLength(5);
    expect(model.nodes.filter((n) => n.data.isDisabled)).toHaveLength(5);
    expect(loaded).toBe(true);
  });

  it('Abstract nodes should contain static name', () => {
    useComponentsMock.mockReturnValue([sampleComponents, true]);
    useLatestBuildPipelinesMock.mockReturnValue([sampleBuildPipelines, true]);

    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model] = result.current;

    expect(model.nodes[0].label).toBe('Components');
    expect(model.nodes[1].label).toBe('Builds');
  });

  it('nodes should be disabled / enabled based on the availability of resources', () => {
    useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);

    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model] = result.current;
    const disabledNodes = model.nodes.filter((n) => n.data.isDisabled);
    const enabledNodes = model.nodes.filter((node) => !node.data.isDisabled);

    expect(disabledNodes).toHaveLength(5);
    expect(enabledNodes).toHaveLength(0);
  });

  it('label should change based on the availability of resources', () => {
    useComponentsMock.mockReturnValue([sampleComponents, true]);

    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model] = result.current;
    const sourceNode = model.nodes.find((n) => n.data.workflowType === WorkflowNodeType.COMPONENT);

    expect(sourceNode.label).toBe('Components');
  });

  it('should return the expanded workflow model', () => {
    const { result } = renderHook(() => useAppWorkflowData('test', true));
    const [model] = result.current;

    expect(model.nodes).toHaveLength(10);
    expect(model.edges).toHaveLength(4);
    expect(
      model.nodes.filter((n) => n.data.workflowType === WorkflowNodeType.COMPONENT),
    ).toHaveLength(2);
  });

  it('should return groups in the expanded workflow model', () => {
    const { result } = renderHook(() => useAppWorkflowData('test', true));
    const [model] = result.current;

    expect(model.nodes.filter((n) => n.group)).toHaveLength(5);
  });

  it('should display empty integration test group node', () => {
    const { result } = renderHook(() => useAppWorkflowData('test', true));
    const [model] = result.current;
    const testGroup = model.nodes.find((n) => n.id === 'tests');
    expect(testGroup).not.toBeNull();
    expect(testGroup.label).toBe('No tests set');
  });

  it('should display non-empty integration test group node', () => {
    useIntegrationTestScenariosMock.mockReturnValue([sampleIntegrationTestScenarios, true]);
    const { result } = renderHook(() => useAppWorkflowData('test', true));
    const [model] = result.current;
    const testGroup = model.nodes.find((n) => n.id === 'tests');
    expect(testGroup).not.toBeNull();
    expect(testGroup.label).toBe('Tests');
  });

  it('should return workflow nodes without releases and managed environments when mvp flag is true', () => {
    useFeatureFlagMock.mockReturnValue([true]);

    const { result } = renderHook(() => useAppWorkflowData('test', false));
    const [model, loaded] = result.current;

    expect(model.nodes).toHaveLength(3);
    expect(model.edges).toHaveLength(2);
    expect(loaded).toBe(true);
  });
});
