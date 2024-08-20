import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { WorkspaceProvider } from '../../utils/workspace-context-utils';
import { useWorkspaceForNamespace } from '../useWorkspaceForNamespace';

describe('useWorkspaceForNamespace', () => {
  it('should find correct workspace', () => {
    const wrapper = ({ children }) => (
      <WorkspaceProvider
        value={{
          namespace: 'test-ns',
          lastUsedWorkspace: 'test-ws',
          workspace: '',
          workspaceResource: undefined,
          konfluxWorkspaces: [],
          kubesawWorkspaces: [
            { metadata: { name: 'ws1' }, status: { namespaces: [{ name: 'my-ns' }] } },
            { metadata: { name: 'ws2' }, status: { namespaces: [{ name: 'my-ns-2' }] } },
            { metadata: { name: 'ws3' }, status: { namespaces: [{ name: 'test-ns' }] } },
          ] as any,
          workspacesLoaded: false,
          updateWorkspace: jest.fn(),
        }}
      >
        {children}
      </WorkspaceProvider>
    );
    const { result } = renderHook(() => useWorkspaceForNamespace('my-ns'), { wrapper });
    expect(result.current.metadata.name).toBe('ws1');
  });

  it('should return undefined if workspace is not found', () => {
    const { result } = renderHook(() => useWorkspaceForNamespace('my-ns-1'));
    expect(result.current).toBe(undefined);
  });

  it('should return undefined if namespace is not provided', () => {
    const { result } = renderHook(() => useWorkspaceForNamespace(''));
    expect(result.current).toBe(undefined);
  });
});
