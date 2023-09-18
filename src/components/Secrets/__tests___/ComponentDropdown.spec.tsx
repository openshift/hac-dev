import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { useComponents } from '../../../hooks/useComponents';
import { formikRenderer } from '../../../utils/test-utils';
import { ComponentDropdown } from '../SecretsForm/ComponentDropdown';

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useComponentsMock = useComponents as jest.Mock;

describe('ComponentDropdown', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show loading indicator if components arent loaded', () => {
    useComponentsMock.mockReturnValue([[], false]);
    formikRenderer(<ComponentDropdown name="test" />, { targets: { application: 'app' } });
    expect(screen.getByText('Loading components...')).toBeVisible();
  });

  it('should show disable dropdown if application is not selected', () => {
    useComponentsMock.mockReturnValue([[], true]);
    formikRenderer(<ComponentDropdown name="test" />, { targets: { application: '' } });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show dropdown if components are loaded', async () => {
    useComponentsMock.mockReturnValue([
      [{ metadata: { name: 'comp1' } }, { metadata: { name: 'comp2' } }],
      true,
    ]);
    formikRenderer(<ComponentDropdown name="test" />, { targets: { application: 'app' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'All components' })).toBeVisible();
      expect(screen.getByRole('menuitem', { name: 'comp1' })).toBeVisible();
      expect(screen.getByRole('menuitem', { name: 'comp2' })).toBeVisible();
    });
  });

  it('should change the dropdown value', async () => {
    useComponentsMock.mockReturnValue([
      [{ metadata: { name: 'comp1' } }, { metadata: { name: 'comp2' } }],
      true,
    ]);

    formikRenderer(<ComponentDropdown name="test" />, { targets: { application: 'app' } });
    expect(screen.queryByRole('button')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByLabelText('All components'));
      screen.getByText('comp2');
    });
    await act(async () => {
      fireEvent.click(screen.getByText('comp2'));
    });
    await waitFor(() => {
      expect(screen.getByText('comp2'));
    });
  });
});
