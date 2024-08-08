import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react';
import { mockGitOpsDeployment } from '../__data__/mock-data';
import { useAllGitOpsDeploymentCRs, useGitOpsDeploymentCR } from '../useGitOpsDeploymentCR';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const originalModule = (jest as any).requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...originalModule,
    useK8sWatchResource: jest.fn(),
  };
});
describe('useGitOpsDeploymentCR', () => {
  const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;

  it('should return gitOpsDeployment for given application', () => {
    mockUseK8sWatchResource.mockReturnValue([mockGitOpsDeployment, true]);

    const { result } = renderHook(() => useGitOpsDeploymentCR('application-to-test', 'test'));
    const [gitOpsDeployment, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(gitOpsDeployment).toEqual(mockGitOpsDeployment[1]);
  });

  it('should return undefined if gitOpsDeployment is not found', () => {
    mockUseK8sWatchResource.mockReturnValue([mockGitOpsDeployment, true]);

    const { result } = renderHook(() => useGitOpsDeploymentCR('application-not-found', 'test'));
    const [gitOpsDeployment, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(gitOpsDeployment).toEqual(undefined);
  });

  it('should return undefined if gitOpsDeployment is not loaded', () => {
    mockUseK8sWatchResource.mockReturnValue([[], false]);

    const { result } = renderHook(() => useGitOpsDeploymentCR('application-to-test', 'test'));
    const [gitOpsDeployment, loaded] = result.current;
    expect(loaded).toEqual(false);
    expect(gitOpsDeployment).toEqual(undefined);
  });
});

describe('useAllGitOpsDeploymentCRs', () => {
  const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;

  it('should return gitOpsDeployment for given namespace', () => {
    mockUseK8sWatchResource.mockReturnValue([mockGitOpsDeployment, true]);

    const { result } = renderHook(() => useAllGitOpsDeploymentCRs('test'));
    const [gitOpsDeployment, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(gitOpsDeployment.length).toEqual(2);
  });

  it('should return empty array if gitOpsDeployment is not loaded', () => {
    mockUseK8sWatchResource.mockReturnValue([[], false]);

    const { result } = renderHook(() => useAllGitOpsDeploymentCRs('test'));
    const [gitOpsDeployment, loaded] = result.current;
    expect(loaded).toEqual(false);
    expect(gitOpsDeployment.length).toEqual(0);
  });
});
