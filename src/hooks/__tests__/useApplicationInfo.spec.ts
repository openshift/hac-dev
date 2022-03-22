import { k8sGetResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useApplicationsInfo } from '../useApplicationsInfo';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const originalModule = (jest as any).requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...originalModule,
    k8sGetResource: jest.fn(),
  };
});

jest.mock('../useActiveNamespace', () => ({
  useActiveNamespace: jest.fn(() => 'test-ns'),
}));

describe('useApplicationInfo', () => {
  const mockK8sGetResource = k8sGetResource as jest.Mock;

  it('should return loaded as true and appExits as false if no application exits', async () => {
    mockK8sGetResource.mockReturnValue({ items: [] });
    const { result, waitForNextUpdate } = renderHook(() => useApplicationsInfo());
    await waitForNextUpdate();
    const { loaded, appExists } = result.current;
    expect(loaded).toEqual(true);
    expect(appExists).toEqual(false);
  });

  it('should return loaded as true and appExits as true if application exits', async () => {
    mockK8sGetResource.mockReturnValue({
      items: [{ kind: 'Application', metadata: { name: 'my-app' } }],
    });
    const { result, waitForNextUpdate } = renderHook(() => useApplicationsInfo());
    await waitForNextUpdate();
    const { loaded, appExists } = result.current;
    expect(loaded).toEqual(true);
    expect(appExists).toEqual(true);
  });
});
