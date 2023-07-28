import { renderHook } from '@testing-library/react-hooks';
import { useWorkspaceForNamespace } from '../useWorkspaceForNamespace';
import { useWorkspaceResource } from '../useWorkspaceResource';

jest.mock('../useWorkspaceForNamespace', () => ({
  useWorkspaceForNamespace: jest.fn(),
}));

const useWorkspaceMock = useWorkspaceForNamespace as jest.Mock;

describe('useWorkspaceResource', () => {
  it('should return correct resource name and workspace', () => {
    useWorkspaceMock.mockReturnValue({ metadata: { name: 'ws1' } });
    const { result } = renderHook(() => useWorkspaceResource('my-ns/my-resource'));
    expect(useWorkspaceMock).toHaveBeenCalledWith('my-ns');
    expect(result.current).toEqual(['my-resource', 'ws1']);
  });

  it('should return undefined if invalid string is provided', () => {
    useWorkspaceMock.mockReturnValue(undefined);
    const { result } = renderHook(() => useWorkspaceResource(''));
    expect(result.current).toEqual([undefined, undefined]);
  });
});
