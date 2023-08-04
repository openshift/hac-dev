import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import { setSignupFeatureFlags, SIGNUP_FLAG, SIGNUP_PENDING_FLAG } from '../flag-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  commonFetch: jest.fn(),
}));

const fetchMock = commonFetch as jest.Mock;

describe('setSignupFeatureFlags', () => {
  it('sets signup flag on successful call', async () => {
    fetchMock.mockResolvedValue({ status: 200, json: async () => ({ status: { ready: true } }) });
    const setFlag = jest.fn();
    await setSignupFeatureFlags(setFlag);
    expect(setFlag).toHaveBeenCalledWith(SIGNUP_FLAG, true);
  });

  it('sets signup pending flag on PendingApproval reason', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({ status: { ready: false, reason: 'PendingApproval' } }),
    });
    const setFlag = jest.fn();
    await setSignupFeatureFlags(setFlag);
    expect(setFlag).toHaveBeenCalledWith(SIGNUP_PENDING_FLAG, true);
  });

  it('sets signup pending flag on ProvisioningSpace reason', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: async () => ({ status: { ready: false, reason: 'ProvisioningSpace' } }),
    });
    const setFlag = jest.fn();
    await setSignupFeatureFlags(setFlag);
    expect(setFlag).toHaveBeenCalledWith(SIGNUP_PENDING_FLAG, true);
  });

  it('sets signup flag on fetch error', async () => {
    fetchMock.mockRejectedValue({ code: 404 });
    const setFlag = jest.fn();
    await setSignupFeatureFlags(setFlag);
    expect(setFlag).toHaveBeenCalledWith(SIGNUP_FLAG, false);
  });

  it('sets signup flag on any error', async () => {
    fetchMock.mockRejectedValue({ code: 401 });
    const setFlag = jest.fn();
    await setSignupFeatureFlags(setFlag);
    expect(setFlag).toHaveBeenCalledWith(SIGNUP_FLAG, false);
  });
});
