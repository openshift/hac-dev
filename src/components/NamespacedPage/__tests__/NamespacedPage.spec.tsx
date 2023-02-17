import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NamespacedPage from '../NamespacedPage';

jest.mock('react', () => ({
  ...(jest as any).requireActual('react'),
  useContext: jest.fn(() => ({ namespace: 'test-ns', workspacesLoaded: true })),
}));

const activeNamepaceMock = React.useContext as jest.Mock;

describe('Application List', () => {
  it('should render spinner if namespace is not loaded', () => {
    activeNamepaceMock.mockReturnValue({ namespace: '', workspacesLoaded: false });
    render(
      <NamespacedPage>
        <h1>Test Component</h1>
      </NamespacedPage>,
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render children if namespace is loaded', () => {
    activeNamepaceMock.mockReturnValue({ namespace: 'test-ns', workspacesLoaded: true });
    render(
      <NamespacedPage>
        <h1>Test Component</h1>
      </NamespacedPage>,
    );
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
