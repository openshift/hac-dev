import * as React from 'react';
import { act, screen, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthTokenModal } from '../AuthTokenModal';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ auth: { getToken: () => Promise.resolve('token-123') } }),
}));

describe('AuthTokenModal', () => {
  it('should be disabled when username or token is not entered', () => {
    render(<AuthTokenModal uploadUrl="example.com" />);
    expect(screen.getByText('Connect')).toBeDisabled();
  });

  it('should be enabled when values are entered', async () => {
    render(<AuthTokenModal uploadUrl="example.com" />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('auth-username'), { target: { value: 'test' } });
      fireEvent.change(screen.getByTestId('auth-token'), { target: { value: '1234' } });
    });
    expect(screen.getByText('Connect')).toBeEnabled();
  });

  it('should send token when submitted', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve());
    render(<AuthTokenModal uploadUrl="example.com" onClose={jest.fn()} />);
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
        'example.com',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer token-123' },
          // eslint-disable-next-line camelcase
          body: JSON.stringify({ username: 'test', access_token: '1234' }),
        }),
      ),
    );
  });

  it('should render error alert', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      throw new Error('failed');
    });
    render(<AuthTokenModal uploadUrl="example.com" onClose={jest.fn()} />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('auth-username'), { target: { value: 'test' } });
      fireEvent.change(screen.getByTestId('auth-token'), { target: { value: '1234' } });
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Connect'));
    });
    expect(screen.getByText('failed')).toBeInTheDocument();
  });
});
