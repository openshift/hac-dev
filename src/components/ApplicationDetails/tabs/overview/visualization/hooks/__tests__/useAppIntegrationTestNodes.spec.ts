import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { useComponents } from '../../../../../../../hooks/useComponents';
import { mockIntegrationTestScenariosData } from '../../../../../__data__';
import { testPipelineRuns } from '../__data__/test-pipeline-data';
import { useAppApplicationTestNodes } from '../useAppApplicationTestNodes';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    useK8sWatchResource: jest.fn(),
  };
});
jest.mock('../../../../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

jest.mock('../../../../../../../hooks/useTektonResults');

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;

describe('useAppApplicationTestNodes', () => {
  beforeEach(() => {
    useK8sWatchResourceMock.mockReset();
    useK8sWatchResourceMock
      .mockReturnValueOnce([[mockIntegrationTestScenariosData[0]], true])
      .mockReturnValueOnce([testPipelineRuns, true]);
    useComponentsMock.mockReturnValue([[], true]);
  });

  it('should return integration test nodes', () => {
    const { result } = renderHook(() =>
      useAppApplicationTestNodes('test-ns', 'test-dev-samples', [], false),
    );
    const [nodes, appTests, resources, loaded] = result.current;

    expect(nodes).toHaveLength(1);
    expect(appTests).toHaveLength(0);
    expect(resources).toHaveLength(1);
    expect(loaded).toBe(true);
  });

  it('should return failed status', () => {
    const failedPipelinerun = testPipelineRuns[0];
    useK8sWatchResourceMock.mockReset();

    useK8sWatchResourceMock
      .mockReturnValueOnce([[mockIntegrationTestScenariosData[0]], true])
      .mockReturnValueOnce([[failedPipelinerun], true]);

    const { result } = renderHook(() =>
      useAppApplicationTestNodes('test-ns', 'test-dev-samples', [], false),
    );

    const [nodes] = result.current;

    expect(nodes[0].data.status).toBe('Failed');
  });

  it('should return status from latest pipelinerun', () => {
    const { result } = renderHook(() =>
      useAppApplicationTestNodes('test-ns', 'test-dev-samples', [], false),
    );
    const [nodes] = result.current;

    expect(nodes[0].data.status).toBe('Succeeded');
  });
});
