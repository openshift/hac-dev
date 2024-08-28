import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import {
  getActiveWorkspace,
  k8sListResourceItems,
  setActiveWorkspaceLocalStorage,
} from '@openshift/dynamic-plugin-sdk-utils';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { KubeSawWorkspace } from '../../types';
import { getHomeWorkspace, useActiveWorkspace } from '../workspace-context-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  k8sListResourceItems: jest.fn(() => {
    [];
  }),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
  setActiveWorkspaceLocalStorage: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const mockWorkspaces: KubeSawWorkspace[] = [
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'workspace-one',
      namespace: 'toolchain-host-operator',
    },
    status: {
      type: 'home',
      namespaces: [
        {
          name: 'workspace-one-tenant',
          type: 'default',
        },
        {
          name: 'myworkspace-extra',
        },
      ],
      owner: 'john',
      role: 'admin',
    },
  },
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'workspace-two',
      namespace: 'toolchain-host-operator',
    },
    status: {
      namespaces: [
        {
          name: 'workspace-two-tenant',
          type: 'default',
        },
      ],
      owner: 'doe',
      role: 'admin',
    },
  },
];

const getActiveWorkspaceMock = getActiveWorkspace as jest.Mock;
const k8sListResourceItemsMock = k8sListResourceItems as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;

global.window = Object.create(window);

describe('getHomeWorkspace', () => {
  it('should not throw error for invalid values', () => {
    expect(getHomeWorkspace(null)).toBeUndefined();
    expect(getHomeWorkspace([])).toBeUndefined();
    expect(getHomeWorkspace(undefined)).toBeUndefined();
  });

  it('should return home workspace', () => {
    expect(getHomeWorkspace(mockWorkspaces).metadata.name).toBe('workspace-one');
    expect(getHomeWorkspace(mockWorkspaces).status.type).toBe('home');
  });
});

describe('useActiveWorkspace', () => {
  const navigateMock = jest.fn(),
    fetchMock = jest.fn();
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/application-pipeline/workspaces/test-ws/applications',
      },
      writable: true,
    });
    window.fetch = fetchMock;
    useNavigateMock.mockImplementation(() => navigateMock);
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    k8sListResourceItemsMock.mockReturnValue(mockWorkspaces);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should return default values', () => {
    getActiveWorkspaceMock.mockReturnValue('');

    const { result } = renderHook(() => useActiveWorkspace());

    expect(result.current).toEqual({
      namespace: '',
      lastUsedWorkspace: 'test-ws',
      workspace: '',
      workspaceResource: undefined,
      konfluxWorkspaces: [],
      kubesawWorkspaces: [],
      workspacesLoaded: false,
      updateVisibility: expect.any(Function),
      updateWorkspace: expect.any(Function),
    });
  });

  it('should set workspaces from the api results ', async () => {
    fetchMock.mockResolvedValue({ json: async () => mockWorkspaces[0] });
    getActiveWorkspaceMock.mockReturnValue('');
    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());
    await waitForNextUpdate();
    expect(result.current.workspace).toBe('workspace-one');
    expect(result.current.kubesawWorkspaces).toHaveLength(2);
  });

  it('should set your home workspace for the first time user', async () => {
    const workspaces = [
      { ...mockWorkspaces[1], status: { ...mockWorkspaces[1].status, type: 'home' } },
    ];

    k8sListResourceItemsMock.mockReturnValue(workspaces);
    getActiveWorkspaceMock.mockReturnValue('');
    fetchMock.mockResolvedValue({ json: async () => mockWorkspaces[1] });

    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());
    await waitForNextUpdate();

    expect(result.current.workspace).toBe('workspace-two');
    expect(result.current.workspaceResource).toEqual({
      ...mockWorkspaces[1],
      status: { ...mockWorkspaces[1].status },
    });
    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/k8s/apis/toolchain.dev.openshift.com/v1alpha1/workspaces/workspace-two',
    );
  });

  it('should use first available workspace when home workspace is not found for first time user', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => mockWorkspaces })
      .mockResolvedValue({ json: async () => mockWorkspaces[0] });
    const workspaces = [
      { ...mockWorkspaces[0], status: { ...mockWorkspaces[0].status, type: 'default' } },
      mockWorkspaces[1],
    ];

    k8sListResourceItemsMock.mockReturnValue(workspaces);
    getActiveWorkspaceMock.mockReturnValue('');

    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());
    await waitForNextUpdate();

    expect(result.current.workspace).toBe('workspace-one');
    expect(result.current.workspaceResource).toEqual({
      ...mockWorkspaces[0],
      status: { ...mockWorkspaces[0].status, type: 'home' },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/k8s/apis/toolchain.dev.openshift.com/v1alpha1/workspaces/workspace-one',
    );
  });

  it('should return default values if the workspace API errors out ', async () => {
    getActiveWorkspaceMock.mockReturnValue('');
    k8sListResourceItemsMock.mockRejectedValue(new Error('failed'));

    const { result, unmount } = renderHook(() => useActiveWorkspace());

    unmount();
    expect(result.current.workspace).toBe('');
    expect(result.current.kubesawWorkspaces).toHaveLength(0);
  });

  it('should should select the workspace from url', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => mockWorkspaces })
      .mockResolvedValue({ json: async () => mockWorkspaces[1] });
    window.location.pathname = '/application-pipeline/workspaces/workspace-two/applications';
    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());

    await waitForNextUpdate();

    expect(result.current.workspace).toBe('workspace-two');
  });

  it('should should fallback to localstorage if the workspace from url is not available in the list', async () => {
    k8sListResourceItemsMock.mockReturnValue([
      ...mockWorkspaces,
      { metadata: { name: 'test-ws' } },
    ]);
    window.location.pathname = '/application-pipeline/workspaces/workspace-invalid/applications';
    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());
    fetchMock.mockResolvedValueOnce({ json: async () => [] });

    await waitForNextUpdate();

    await waitFor(() => {
      expect(result.current.workspace).toBe('test-ws');
    });
  });

  it('should should honor the workspace from localstorage', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => mockWorkspaces })
      .mockResolvedValue({ json: async () => mockWorkspaces[0] });
    setActiveWorkspaceLocalStorage('workspace-one');
    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());
    await waitForNextUpdate();

    expect(result.current.workspace).toBe('workspace-one');
  });

  it('should should not navigate to the selected workspace route if the user is in non workspace pages', async () => {
    window.location.pathname = '/application-pipeline/overview';
    getActiveWorkspaceMock.mockReturnValue('');
    fetchMock.mockResolvedValue({ json: async () => mockWorkspaces[1] });
    renderHook(() => useActiveWorkspace());

    await waitFor(() => {
      expect(navigateMock).not.toBeCalled();
    });
  });

  it('should navigate to the selected workspace route', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => mockWorkspaces })
      .mockResolvedValue({ json: async () => mockWorkspaces[0] });
    getActiveWorkspaceMock.mockReturnValue('');
    renderHook(() => useActiveWorkspace());

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        `/application-pipeline/workspaces/workspace-one/applications`,
      );
    });
  });

  it('should update workspace if url segment changes', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => mockWorkspaces })
      .mockResolvedValue({ json: async () => mockWorkspaces[0] });
    k8sListResourceItemsMock.mockReturnValue(mockWorkspaces);
    window.location.pathname = '/application-pipeline/workspaces/workspace-one/applications';
    const { result, waitForNextUpdate, rerender } = renderHook(() => useActiveWorkspace());
    await waitForNextUpdate();

    expect(result.current.workspace).toBe('workspace-one');
    fetchMock.mockClear();
    fetchMock.mockResolvedValue({ json: async () => mockWorkspaces[1] });
    window.location.pathname = '/application-pipeline/workspaces/workspace-two/applications';
    rerender();
    await waitFor(() => {
      expect(result.current.workspace).toBe('workspace-two');
    });
  });

  it('should fetch workspace again if workspace update is requested', async () => {
    const workspaces = [
      { ...mockWorkspaces[0], status: { ...mockWorkspaces[0].status, type: 'home' } },
    ];

    k8sListResourceItemsMock.mockReturnValue(workspaces);
    getActiveWorkspaceMock.mockReturnValue('');
    fetchMock
      .mockResolvedValueOnce({ json: async () => mockWorkspaces })
      .mockResolvedValue({ json: async () => mockWorkspaces[0] });

    const { result, waitForNextUpdate } = renderHook(() => useActiveWorkspace());
    await waitForNextUpdate();

    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/k8s/apis/toolchain.dev.openshift.com/v1alpha1/workspaces/workspace-one',
    );
    expect(result.current.workspace).toBe('workspace-one');
    fetchMock.mockResolvedValue({
      json: async () => ({ ...mockWorkspaces[0], status: { type: 'default' } }),
    });

    await act(async () => {
      result.current.updateWorkspace();
    });
    expect(fetchMock).toHaveBeenCalledTimes(8);
    expect(result.current.workspaceResource).toEqual({
      ...mockWorkspaces[0],
      status: { type: 'default' },
    });
  });
});
