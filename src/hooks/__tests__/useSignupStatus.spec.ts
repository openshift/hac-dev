import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';
import { UserSignupStatus, useSignupStatus } from '../useSignupStatus';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const originalModule = (jest as any).requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...originalModule,
    commonFetch: jest.fn(),
  };
});

describe('useSignupStatus', () => {
  const mockCommonFetch = commonFetch as jest.Mock;

  it('should return NotSignedUp when user hasnt signed up yet', async () => {
    mockCommonFetch.mockRejectedValue({ code: 404 });
    const { result } = await waitFor(() => renderHook(() => useSignupStatus()));
    const [status, , loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(status).toEqual(UserSignupStatus.NOT_SIGNEDUP);
  });

  it('should return PendingApproval when user has signed up but is not approved yet', async () => {
    mockCommonFetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ status: { ready: false, reason: 'PendingApproval' } }),
    });
    const { result } = await waitFor(() => renderHook(() => useSignupStatus()));
    const [status, , loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(status).toEqual(UserSignupStatus.PENDING_APPROVAL);
  });

  it('should return Provisioned when user has signed up and is also approved', async () => {
    mockCommonFetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ status: { ready: true, reason: 'Provisioned' } }),
    });
    const { result } = await waitFor(() => renderHook(() => useSignupStatus()));
    const [status, , loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(status).toEqual(UserSignupStatus.PROVISIONED);
  });
});
