import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { commonFetch } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignupView from '../SignupView';
import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  commonFetch: jest.fn(),
}));

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
const fetchMock = commonFetch as jest.Mock;

describe('Signup View', () => {
  it('should show Signup Form when status is NotSignedup', () => {
    useFeatureFlagMock.mockReturnValue([false, () => {}]);
    render(<SignupView />);
    expect(
      screen.getByRole('button', { name: 'Sign up for App Studio access' }),
    ).toBeInTheDocument();
  });

  it('should show alert when status is PendingApproval', () => {
    useFeatureFlagMock.mockReturnValue([true, () => {}]);
    render(<SignupView />);
    expect(
      screen.getByRole('heading', {
        name: 'Info alert: We have received your request. We are working hard to get you early access to the App Studio services.',
      }),
    ).toBeInTheDocument();
  });

  it('should make signup call on submit', async () => {
    const setFlagMock = jest.fn();
    useFeatureFlagMock.mockReturnValue([false, setFlagMock]);
    fetchMock.mockResolvedValue({ status: 202 });
    render(<SignupView />);
    const signupButton = screen.getByRole('button', { name: 'Sign up for App Studio access' });
    expect(signupButton).toBeEnabled();
    fireEvent.click(signupButton);
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/registration/api/v1/signup', { method: 'POST' }),
    );
    expect(setFlagMock).toHaveBeenCalledWith(true);
  });
});
