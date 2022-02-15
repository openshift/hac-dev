import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from 'formik';
import { initiateAccessTokenBinding } from '../../../utils/create-utils';
import { GitAuthorization } from '../GitAuthorization';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

jest.mock('../../../hooks/useActiveNamespace', () => ({
  useActiveNamespace: jest.fn(() => 'test-ns'),
}));

jest.mock('../../../utils/create-utils', () => ({
  initiateAccessTokenBinding: jest.fn(),
}));

jest.mock('../utils', () => ({
  useAccessTokenBindingAuth: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;
const accessTokenBindingMock = initiateAccessTokenBinding as jest.Mock;

describe('GitAuthorization', () => {
  it('should be disabled if url is not valid', () => {
    useFieldMock.mockImplementation((field: string) => [
      {},
      { value: field === 'source' ? 'test' : null, error: true },
    ]);
    render(<GitAuthorization />);
    expect(screen.getByText('Sign In')).toBeDisabled();
  });

  it('should show success message if secret is available', () => {
    useFieldMock.mockReturnValue([{}, { value: 'test', touched: true }]);
    render(<GitAuthorization />);
    expect(screen.getByText('Authorized access')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('should create SPI access token binding when clicked', async () => {
    useFieldMock.mockImplementation((field: string) => [
      {},
      { value: field === 'source' ? 'https://github.com/test/repository' : null, touched: true },
    ]);
    accessTokenBindingMock.mockResolvedValue({
      metadata: { name: 'test-bind' },
      status: {},
    });

    render(<GitAuthorization />);
    const button = screen.getByText('Sign In');
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });
    expect(accessTokenBindingMock).toHaveBeenCalledWith(
      'https://github.com/test/repository',
      'test-ns',
    );
  });

  afterAll(jest.resetAllMocks);
});
