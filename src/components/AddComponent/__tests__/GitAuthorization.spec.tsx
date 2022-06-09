import * as React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from 'formik';
import { namespaceRenderer } from '../../../utils/test-utils';
import { GitAuthorization } from '../GitAuthorization';
import { useAccessTokenBindingAuth } from '../utils';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ auth: { getToken: () => Promise.resolve('token') } }),
}));

jest.mock('../utils', () => ({
  useAccessTokenBindingAuth: jest.fn(),
}));

(window.open = jest.fn()) as jest.Mock;

const useFieldMock = useField as jest.Mock;

const useAccessTokenBindingAuthMock = useAccessTokenBindingAuth as jest.Mock;

const windowOpenMock = window.open as jest.Mock;

const renderGitAuthorization = () => namespaceRenderer(<GitAuthorization />, 'test-ns');

describe('GitAuthorization', () => {
  it('should be disabled if auth url is not loaded', () => {
    useAccessTokenBindingAuthMock.mockReturnValue([undefined, false]);
    useFieldMock.mockImplementation((field: string) => [
      {},
      { value: field === 'source' ? 'test' : null, error: true },
    ]);
    renderGitAuthorization();
    expect(screen.getByText('Sign In')).toBeDisabled();
  });

  it('should show success message if secret is available', () => {
    useAccessTokenBindingAuthMock.mockReturnValue(['', true]);
    useFieldMock.mockReturnValue([{}, { value: 'test', touched: true }]);
    renderGitAuthorization();
    expect(screen.getByText('Authorized access')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('should not call window.open if auth url is not available', async () => {
    useAccessTokenBindingAuthMock.mockReturnValue(['', true]);
    useFieldMock.mockImplementation((field: string) => [
      {},
      { value: field === 'source' ? 'https://github.com/test/repository' : null, touched: true },
    ]);

    renderGitAuthorization();
    const button = screen.getByText('Sign In');
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });

    await expect(windowOpenMock).not.toHaveBeenCalled();
  });

  it('should call window.open with auth url and token', async () => {
    useAccessTokenBindingAuthMock.mockReturnValue(['example.com/auth?state=abcd', true]);
    useFieldMock.mockImplementation((field: string) => [
      {},
      { value: field === 'source' ? 'https://github.com/test/repository' : null, touched: true },
    ]);

    renderGitAuthorization();
    const button = screen.getByText('Sign In');
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });

    await expect(windowOpenMock).toHaveBeenCalledWith(
      'example.com/auth?state=abcd&k8s_token=token',
      '_blank',
    );
  });

  afterAll(jest.resetAllMocks);
});
