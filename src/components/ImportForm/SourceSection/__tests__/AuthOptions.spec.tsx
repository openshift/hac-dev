import * as React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useFormikContext } from 'formik';
import { namespaceRenderer } from '../../../../utils/test-utils';
import { useAccessTokenBinding } from '../../utils/auth-utils';
import AuthOptions from '../AuthOptions';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ auth: { getToken: () => Promise.resolve('token') } }),
}));

jest.mock('../../utils/auth-utils', () => ({
  useAccessTokenBinding: jest.fn(),
}));

(window.open = jest.fn()) as jest.Mock;

const useFormikContextMock = useFormikContext as jest.Mock;

const useAccessTokenBindingMock = useAccessTokenBinding as jest.Mock;

const windowOpenMock = window.open as jest.Mock;

const renderAuthOptions = () => namespaceRenderer(<AuthOptions />, 'test-ns');

describe('AuthOptions', () => {
  it('should show spinner if auth url is not loaded', () => {
    useAccessTokenBindingMock.mockReturnValue([{}, false]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'test-source' } }, secret: null },
    });
    renderAuthOptions();
    screen.getByRole('progressbar');
  });

  it('should show success message if secret is available', () => {
    useAccessTokenBindingMock.mockReturnValue([{}, true]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'test-source' } }, secret: 'test-secret' },
    });
    renderAuthOptions();
    expect(screen.getByText('Authorized access')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Use a token instead')).not.toBeInTheDocument();
  });

  it('should not call window.open if auth url is not available', async () => {
    useAccessTokenBindingMock.mockReturnValue([{}, true]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'https://github.com/test/repository' } }, secret: null },
    });

    renderAuthOptions();
    const button = screen.getByText('Sign in');
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(windowOpenMock).not.toHaveBeenCalled();
  });

  it('should call window.open with auth url and token', async () => {
    useAccessTokenBindingMock.mockReturnValue([{ oAuthUrl: 'example.com/auth?state=abcd' }, true]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'https://github.com/test/repository' } }, secret: null },
    });
    renderAuthOptions();
    const button = screen.getByText('Sign in');
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(windowOpenMock).toHaveBeenCalledWith(
      'example.com/auth?state=abcd&k8s_token=token',
      '_blank',
    );
  });

  afterAll(jest.resetAllMocks);
});
