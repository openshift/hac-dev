import * as React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { commonFetch, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import IntroBanner from '../IntroBanner';
import '@testing-library/jest-dom';
import SignupButton from '../SignupButton';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  commonFetch: jest.fn(),
  useK8sWatchResource: jest.fn(() => [[], true]),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => (
      <a href={props.to} data-test={props.to}>
        {props.children}
      </a>
    ),
  };
});

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;
const fetchMock = commonFetch as jest.Mock;

describe('Intro Banner', () => {
  it('should show signup action when user is not signed up', () => {
    useFeatureFlagMock.mockReturnValue([false, () => {}]);
    render(<IntroBanner />);
    expect(screen.getByRole('button', { name: 'Join the waitlist' })).toBeInTheDocument();
  });

  it('should show waitlist alert when user is pending approval', () => {
    useFeatureFlagMock.mockReturnValueOnce([false, () => {}]).mockReturnValue([true, () => {}]);
    render(<IntroBanner />);
    expect(
      screen.getByRole('heading', {
        name: 'Info alert: We have received your request. While you are waiting, please join our Slack channel.',
      }),
    ).toBeInTheDocument();
  });

  it('should show create application action when user is signed up', () => {
    useFeatureFlagMock.mockReturnValue([true, () => {}]);
    render(<IntroBanner />);
    expect(screen.getByRole('link', { name: '+ Create an application' })).toBeInTheDocument();
  });

  it('should show view application action when user is signed up and has applications', () => {
    useFeatureFlagMock.mockReturnValue([true, () => {}]);
    render(<IntroBanner />);
    expect(screen.queryByRole('link', { name: 'View my applications' })).not.toBeInTheDocument();

    useK8sWatchResourceMock.mockReturnValue([[{}], true]);
    render(<IntroBanner />);
    expect(screen.queryByRole('link', { name: 'View my applications' })).toBeInTheDocument();
  });

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
