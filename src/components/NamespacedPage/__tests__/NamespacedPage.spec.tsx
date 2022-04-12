import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useActiveNamespace } from '../../../hooks/useActiveNamespace';
import NamespacedPage from '../NamespacedPage';

jest.mock('../../../hooks/useActiveNamespace', () => ({
  useActiveNamespace: jest.fn(() => ['test-ns', true]),
}));

const activeNamepaceMock = useActiveNamespace as jest.Mock;

describe('Application List', () => {
  it('should render spinner if namespace is not loaded', () => {
    activeNamepaceMock.mockReturnValue(['', false]);
    render(
      <NamespacedPage>
        <h1>Test Component</h1>
      </NamespacedPage>,
    );
    screen.getByRole('progressbar');
  });

  it('should render children if namespace is loaded', () => {
    activeNamepaceMock.mockReturnValue(['test-ns', true]);
    render(
      <NamespacedPage>
        <h1>Test Component</h1>
      </NamespacedPage>,
    );
    screen.getByText('Test Component');
  });
});
