import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useApplicationReleases } from '../useApplicationReleases';
import { useApplicationSnapshots } from '../useApplicationSnapshots';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../useApplicationSnapshots', () => ({
  useApplicationSnapshots: jest.fn(),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useSnapshotsMock = useApplicationSnapshots as jest.Mock;

describe('useApplicationReleases', () => {
  it('should only return releases that are in the application', () => {
    watchResourceMock.mockReturnValue([
      [
        { metadata: { name: 'r1' }, spec: { snapshot: 'my-snapshot' } },
        { metadata: { name: 'r2' }, spec: { snapshot: 'my-snapshot' } },
        { metadata: { name: 'r3' }, spec: { snapshot: 'test-snapshot' } },
        { metadata: { name: 'r4' }, spec: { snapshot: 'test-snapshot' } },
      ],
      true,
    ]);
    useSnapshotsMock.mockReturnValue([
      [{ metadata: { name: 'my-snapshot' } }, { metadata: { name: 'my-snapshot-2' } }],
      true,
    ]);

    const { result } = renderHook(() => useApplicationReleases('test-app'));
    const [results, loaded] = result.current;
    expect(useSnapshotsMock).toHaveBeenCalledWith('test-app');
    expect(loaded).toEqual(true);
    expect(results.length).toEqual(2);
    expect(results.map((r) => r.metadata.name)).toEqual(['r1', 'r2']);
  });
});
