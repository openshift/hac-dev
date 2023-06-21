import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useApplicationSnapshots } from '../useApplicationSnapshots';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('useApplicationSnapshots', () => {
  it('should only return snapshots for the given application', () => {
    watchResourceMock.mockReturnValue([
      [
        { metadata: { name: 's1' }, spec: { application: 'my-app' } },
        { metadata: { name: 's2' }, spec: { application: 'my-app' } },
        { metadata: { name: 's3' }, spec: { application: 'my-application' } },
        { metadata: { name: 's4' }, spec: { application: 'my-test-app' } },
      ],
      true,
    ]);

    const { result } = renderHook(() => useApplicationSnapshots('my-app'));
    const [snapshots, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(snapshots.length).toEqual(2);
    expect(snapshots.map((s) => s.metadata.name)).toEqual(['s1', 's2']);
  });
});
