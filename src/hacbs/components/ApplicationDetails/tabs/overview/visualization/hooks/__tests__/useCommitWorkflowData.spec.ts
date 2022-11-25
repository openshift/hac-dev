import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { useNamespace } from '../../../../../../../../utils/namespace-context-utils';
import {
  useSnapshotsEnvironmentBindings,
  useBuildPipelines,
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleasePlans,
  useReleases,
  useTestPipelines,
} from '../../../../../../../hooks';
import { createCommitObjectFromPLR } from '../../../../../../../utils/commits-utils';
import { pipelineWithCommits } from '../../../../../../Commits/__data__/pipeline-with-commits';
import { WorkflowNodeType } from '../../types';
import {
  sampleBuildPipelines,
  sampleComponents,
  sampleEnvironments,
  sampleReleasePlans,
  sampleReleases,
  sampleIntegrationTestScenarios,
  sampleSnapshotsEnvironmentBindings,
  sampleTestPipelines,
} from '../__data__/workflow-data';
import { useCommitWorkflowData } from '../useCommitWorkflowData';

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
  useReleases: jest.fn(() => [[], true]),
  useReleasePlans: jest.fn(() => [[], true]),
  useTestPipelines: jest.fn(() => [[], true]),
  useSnapshotsEnvironmentBindings: jest.fn(() => [[], true]),
}));

const useActiveNamespaceMock = useNamespace as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useIntegrationTestScenariosMock = useIntegrationTestScenarios as jest.Mock;
const useBuildPipelinesMock = useBuildPipelines as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;
const useReleasesMock = useReleases as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;
const useTestPipelinesMock = useTestPipelines as jest.Mock;
const useApplicationSnapshotsEBMock = useSnapshotsEnvironmentBindings as jest.Mock;

describe('useCommitWorkflowData hook', () => {
  beforeEach(() => {
    useActiveNamespaceMock.mockReturnValue('test-ns');
    useComponentsMock.mockReturnValue([[sampleComponents[0]], true]);
    useBuildPipelinesMock.mockReturnValue([[sampleBuildPipelines[0]], true]);
    useIntegrationTestScenariosMock.mockReturnValue([sampleIntegrationTestScenarios, true]);
    useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);
    useReleasePlansMock.mockReturnValue([sampleReleasePlans, true]);
    useReleasesMock.mockReturnValue([sampleReleases, true]);
    useTestPipelinesMock.mockReturnValue([[sampleTestPipelines[0]], true]);
    useApplicationSnapshotsEBMock.mockReturnValue([sampleSnapshotsEnvironmentBindings, true]);

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

  const commit = createCommitObjectFromPLR(pipelineWithCommits[0]);

  it('should early return empty values if any one of the resources is not loaded', () => {
    useComponentsMock.mockReturnValue([[], false]);

    const { result } = renderHook(() => useCommitWorkflowData(commit));
    const [nodes, loaded] = result.current;
    expect(nodes).toHaveLength(0);
    expect(loaded).toBe(false);
  });

  it('should early return the pipelinerun does not contain commit labels/annotations', () => {
    useComponentsMock.mockReturnValue([[sampleComponents[0]], true]);
    useBuildPipelinesMock.mockReturnValue([[sampleBuildPipelines[1]], true]);

    const { result } = renderHook(() => useCommitWorkflowData(commit));
    const [nodes, loaded] = result.current;
    expect(nodes).toHaveLength(0);
    expect(loaded).toBe(true);
  });

  it('should return the commit workflow nodes', () => {
    const { result } = renderHook(() => useCommitWorkflowData(commit));
    const [nodes, loaded] = result.current;

    expect(nodes).toHaveLength(9);
    expect(loaded).toBe(true);
  });

  it('should return disabled nodes if the resources are not created', () => {
    useReleasePlansMock.mockReturnValue([[], true]);
    useReleasesMock.mockReturnValue([[], true]);

    const { result } = renderHook(() => useCommitWorkflowData(commit));
    const [nodes, loaded] = result.current;

    expect(nodes).toHaveLength(9);

    expect(nodes.filter((n) => n.data.isDisabled)).toHaveLength(2);
    expect(loaded).toBe(true);
  });

  it('Abstract nodes should contain static name', () => {
    const { result } = renderHook(() => useCommitWorkflowData(commit));
    const [nodes] = result.current;

    expect(nodes[0].data.label).toBe('commit');
    expect(nodes[1].data.label).toBe('build-1-nodejs');
  });

  it('Non Abstract nodes should contain the child resources', () => {
    useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);

    const { result } = renderHook(() => useCommitWorkflowData(commit));

    const [nodes] = result.current;

    const environmentNodes = nodes.filter(
      (n) => n.data.workflowType === WorkflowNodeType.STATIC_ENVIRONMENT,
    );

    expect(environmentNodes).toHaveLength(3);
  });

  it('nodes should be disabled / enabled based on the availability of resources', () => {
    useReleasePlansMock.mockReturnValue([[], true]);
    useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);

    const { result } = renderHook(() => useCommitWorkflowData(commit));
    const [nodes] = result.current;
    const disabledNodes = nodes.filter((n) => n.data.isDisabled);
    const enabledNodes = nodes.filter((node) => !node.data.isDisabled);

    expect(enabledNodes).toHaveLength(8);
    expect(disabledNodes).toHaveLength(1);
  });

  it('label should change based on the availability of resources', () => {
    useEnvironmentsMock.mockReturnValue([[], true]);
    useReleasePlansMock.mockReturnValue([[], true]);
    const { result } = renderHook(() => useCommitWorkflowData(commit));

    const [nodes] = result.current;
    const sourceNode = nodes.find((n) => n.data.workflowType === WorkflowNodeType.PIPELINE);
    const environmentNode = nodes.find(
      (n) => n.data.workflowType === WorkflowNodeType.STATIC_ENVIRONMENT,
    );
    const managedEnvironmentNode = nodes.find(
      (n) => n.data.workflowType === WorkflowNodeType.MANAGED_ENVIRONMENT,
    );

    expect(sourceNode.data.label).toBe('build-1-nodejs');
    expect(environmentNode.data.label).toBe('No static environments set');
    expect(managedEnvironmentNode.data.label).toBe('No managed environments set');
  });

  it('should return all the commit workflow model', () => {
    useEnvironmentsMock.mockReturnValue([sampleEnvironments, true]);
    useReleasePlansMock.mockReturnValue([sampleReleasePlans, true]);

    const { result } = renderHook(() => useCommitWorkflowData(commit));

    const [nodes] = result.current;
    expect(nodes).toHaveLength(9);
  });
});
