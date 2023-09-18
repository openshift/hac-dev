import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { formikRenderer } from '../../../utils/test-utils';
import { EnvironmentDropdown } from '../SecretsForm/EnvironmentDropdown';

jest.mock('../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));

const useEnvironmentsMock = useEnvironments as jest.Mock;

describe('EnvironmentDropdown', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show loading indicator if environments arent loaded', () => {
    useEnvironmentsMock.mockReturnValue([[], false]);
    formikRenderer(<EnvironmentDropdown name="test" />);
    expect(screen.getByText('Loading environments...')).toBeVisible();
  });

  it('should show dropdown if environments are loaded', async () => {
    useEnvironmentsMock.mockReturnValue([
      [{ metadata: { name: 'env1' } }, { metadata: { name: 'env2' } }],
      true,
    ]);
    formikRenderer(<EnvironmentDropdown name="test" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByRole('menuitem', { name: 'All environments' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'env1' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'env2' })).toBeVisible();
  });

  it('should change the environment dropdown value', async () => {
    useEnvironmentsMock.mockReturnValue([
      [{ metadata: { name: 'env1' } }, { metadata: { name: 'env2' } }],
      true,
    ]);

    formikRenderer(<EnvironmentDropdown name="targets.environment" />, {
      targets: { environment: '' },
    });
    expect(screen.queryByRole('button')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByLabelText('All environments'));
      screen.getByText('env2');
    });

    await act(async () => {
      fireEvent.click(screen.getByText('env2'));
    });

    await waitFor(() => {
      expect(screen.getByText('env2'));
    });
  });
});
