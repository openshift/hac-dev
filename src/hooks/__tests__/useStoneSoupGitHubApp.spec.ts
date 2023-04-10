import { renderHook } from '@testing-library/react-hooks';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import {
  ApplicationPipelineGitHubAppData,
  useApplicationPipelineGitHubApp,
} from '../useApplicationPipelineGitHubApp';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));

const useChromeMock = useChrome as jest.Mock;

describe('useApplicationPipelineGithubApp', () => {
  it('should return stage github app for dev environment', () => {
    useChromeMock.mockReturnValue({
      getEnvironment: jest.fn().mockReturnValue('dev'),
    });
    const { result } = renderHook(() => useApplicationPipelineGitHubApp());
    expect(result.current).toBe(ApplicationPipelineGitHubAppData.stage);
  });

  it('should return stage github app for stage environment', () => {
    useChromeMock.mockReturnValue({
      getEnvironment: jest.fn().mockReturnValue('stage'),
    });
    const { result } = renderHook(() => useApplicationPipelineGitHubApp());
    expect(result.current).toBe(ApplicationPipelineGitHubAppData.stage);
  });

  it('should return prod github app for prod environment', () => {
    useChromeMock.mockReturnValue({
      getEnvironment: jest.fn().mockReturnValue('prod'),
    });
    const { result } = renderHook(() => useApplicationPipelineGitHubApp());
    expect(result.current).toBe(ApplicationPipelineGitHubAppData.prod);
  });

  it('should return dev github app for any other environment', () => {
    useChromeMock.mockReturnValue({
      getEnvironment: jest.fn().mockReturnValue('qa'),
    });
    const { result } = renderHook(() => useApplicationPipelineGitHubApp());
    expect(result.current).toBe(ApplicationPipelineGitHubAppData.dev);
  });
});
