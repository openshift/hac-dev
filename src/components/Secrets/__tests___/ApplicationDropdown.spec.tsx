import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { formikRenderer } from '../../../utils/test-utils';
import { ApplicationDropdown } from '../utils/ApplicationDropdown';

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

const useApplicationsMock = useApplications as jest.Mock;

describe('ApplicationDropdown', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show loading indicator if applications arent loaded', () => {
    useApplicationsMock.mockReturnValue([[], false]);
    formikRenderer(<ApplicationDropdown name="app" />);
    expect(screen.getByTestId('loading-indicator')).toBeVisible();
  });

  it('should show dropdown if applications are loaded', async () => {
    useApplicationsMock.mockReturnValue([
      [{ metadata: { name: 'app1' } }, { metadata: { name: 'app2' } }],
      true,
    ]);
    formikRenderer(<ApplicationDropdown name="app" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByRole('menuitem', { name: 'app1' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'app2' })).toBeVisible();
  });
});
