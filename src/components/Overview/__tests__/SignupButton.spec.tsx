import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupButton from '../SignupButton';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  commonFetch: jest.fn(),
}));

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
const fetchMock = commonFetch as jest.Mock;

describe('Signup Button', () => {
  it('should make signup call on submit', async () => {
    const setFlagMock = jest.fn();
    useFeatureFlagMock.mockReturnValue([false, setFlagMock]);
    fetchMock.mockResolvedValue({ status: 202 });
    render(<SignupButton />);
    const signupButton = screen.getByRole('button', { name: 'Join the waitlist' });
    expect(signupButton).toBeEnabled();
    fireEvent.click(signupButton);
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/registration/api/v1/signup', { method: 'POST' }),
    );
    expect(setFlagMock).toHaveBeenCalledWith(true);
  });
});
