import * as React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useFormikContext } from 'formik';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { namespaceRenderer } from '../../../../utils/test-utils';
import { useAccessTokenBinding } from '../../utils/auth-utils';
import AuthOptions from '../AuthOptions';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));

jest.mock('../../utils/auth-utils', () => ({
  useAccessTokenBinding: jest.fn(),
  initiateSpiAuthSession: jest.fn(),
}));

(window.open = jest.fn()) as jest.Mock;

const useFormikContextMock = useFormikContext as jest.Mock;

const useAccessTokenBindingMock = useAccessTokenBinding as jest.Mock;

const useChromeMock = useChrome as jest.Mock;

const renderAuthOptions = () => namespaceRenderer(<AuthOptions />, 'test-ns');

describe('AuthOptions', () => {
  it('should show spinner if auth url is not loaded', () => {
    useChromeMock.mockReturnValue({ auth: { getToken: () => Promise.resolve('token') } });
    useAccessTokenBindingMock.mockReturnValue([{}, false]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'test-source' } }, secret: null },
    });
    renderAuthOptions();
    screen.getByRole('progressbar');
  });

  it('should show success message if secret is available', () => {
    useChromeMock.mockReturnValue({ auth: { getToken: () => Promise.resolve('token') } });
    useAccessTokenBindingMock.mockReturnValue([{}, true]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'test-source' } }, secret: 'test-secret' },
    });
    renderAuthOptions();
    expect(screen.getByText('Authorized access')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Use a token instead')).not.toBeInTheDocument();
  });

  it('should show render form once token is resolved', async () => {
    useChromeMock.mockReturnValue({ auth: { getToken: () => Promise.resolve('token') } });
    useAccessTokenBindingMock.mockReturnValue([{}, true]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'test-source' } } },
    });
    renderAuthOptions();
    await waitFor(() => expect(screen.queryByText('Sign in')).toBeInTheDocument());
  });

  it('should not render form if token is null', async () => {
    useChromeMock.mockReturnValue({ auth: { getToken: () => Promise.resolve(null) } });
    useAccessTokenBindingMock.mockReturnValue([{}, true]);
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'test-source' } } },
    });
    renderAuthOptions();
    await waitFor(() => expect(screen.queryByText('Sign in')).not.toBeInTheDocument());
  });

  afterAll(jest.resetAllMocks);
});
