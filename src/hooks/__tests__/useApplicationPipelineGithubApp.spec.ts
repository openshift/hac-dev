import { renderHook } from '@testing-library/react';
import { useApplicationPipelineGitHubApp } from '../useApplicationPipelineGitHubApp';
import { useUIInstance } from '../useUIInstance';

jest.mock('../useUIInstance', () => ({ useUIInstance: jest.fn() }));

const mockUIInstance = useUIInstance as jest.Mock;

describe('useApplicationPipelineGithubApp', () => {
  it('should return correct github app', () => {
    mockUIInstance.mockReturnValue('stage');
    const { result, rerender } = renderHook(() => useApplicationPipelineGitHubApp());
    expect(result.current).toEqual({
      url: 'https://github.com/apps/konflux-staging',
      name: 'konflux-staging',
    });
    mockUIInstance.mockReturnValue('prod');
    rerender();
    expect(result.current).toEqual({
      url: 'https://github.com/apps/red-hat-konflux',
      name: 'red-hat-konflux',
    });
    mockUIInstance.mockReturnValue('dev');
    rerender();
    expect(result.current).toEqual({
      url: 'https://github.com/apps/konflux-staging',
      name: 'konflux-staging',
    });
    mockUIInstance.mockReturnValue('qa');
    rerender();
    expect(result.current).toEqual({
      url: 'https://github.com/apps/konflux-staging',
      name: 'konflux-staging',
    });
  });
});
