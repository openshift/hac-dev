import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import { waitFor, renderHook } from '@testing-library/react';
import { SignupStatus } from '../../utils/signup-utils';
import { useSignupStatus } from '../useSignupStatus';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  commonFetch: jest.fn(),
  getActiveWorkspace: jest.fn(),
}));

const fetchMock = commonFetch as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

describe('useSignupStatus', () => {
  beforeAll(jest.useFakeTimers);
  afterAll(jest.useRealTimers);

  it('should not poll for status if signup is successful', () => {
    useFeatureFlagMock.mockReturnValue([true, () => {}]);
    fetchMock.mockResolvedValue({});
    const { result } = renderHook(() => useSignupStatus());
    expect(result.current).toBe(SignupStatus.SignedUp);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should not poll for status if signup is not started', () => {
    useFeatureFlagMock.mockReturnValue([false, () => {}]);
    fetchMock.mockResolvedValue({});
    const { result } = renderHook(() => useSignupStatus());
    expect(result.current).toBe(SignupStatus.NotSignedUp);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should poll for signup status if flags are not set', async () => {
    const setFlagMock = jest.fn();
    useFeatureFlagMock.mockImplementation((flag) => [!(flag === 'SIGNUP'), setFlagMock]);
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({ status: { ready: true } }),
    });
    const { result, rerender } = renderHook(() => useSignupStatus());
    expect(result.current).toBe(SignupStatus.PendingApproval);
    jest.runOnlyPendingTimers();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(setFlagMock).toHaveBeenCalledTimes(2));
    expect(setFlagMock).toHaveBeenCalledWith(true);
    expect(setFlagMock).toHaveBeenCalledWith(false);
    useFeatureFlagMock.mockReturnValue([true, setFlagMock]);
    rerender();
    expect(result.current).toBe(SignupStatus.SignedUp);
  });
});
