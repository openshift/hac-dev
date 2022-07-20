import * as React from 'react';
import { act, screen, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthTokenModal } from '../AuthTokenModal';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ auth: { getToken: () => Promise.resolve('token-123') } }),
}));

global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve());

describe('AuthTokenModal', () => {
  it('should be disabled when username or token is not entered', () => {
    render(<AuthTokenModal accessTokenName="test-token" />);
    expect(screen.getByText('Connect')).toBeDisabled();
  });

  it('should be enabled when values are entered', async () => {
    render(<AuthTokenModal accessTokenName="test-token" />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('auth-username'), { target: { value: 'test' } });
      fireEvent.change(screen.getByTestId('auth-token'), { target: { value: '1234' } });
    });
    expect(screen.getByText('Connect')).toBeEnabled();
  });

  it('should send token when submitted', async () => {
    render(<AuthTokenModal accessTokenName="test-token" onClose={jest.fn()} />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('auth-username'), { target: { value: 'test' } });
      fireEvent.change(screen.getByTestId('auth-token'), { target: { value: '1234' } });
    });
    expect(screen.getByText('Connect')).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByText('Connect'));
    });
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer token-123' },
          // eslint-disable-next-line camelcase
          body: JSON.stringify({ username: 'test', access_token: '1234' }),
        }),
      ),
    );
  });
});
