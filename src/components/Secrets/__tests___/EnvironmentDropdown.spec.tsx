import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen } from '@testing-library/react';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { formikRenderer } from '../../../utils/test-utils';
import { EnvironmentDropdown } from '../utils/EnvironmentDropdown';

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
    expect(screen.getByTestId('loading-indicator')).toBeVisible();
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
});
