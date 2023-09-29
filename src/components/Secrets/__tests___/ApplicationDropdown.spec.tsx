import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { formikRenderer } from '../../../utils/test-utils';
import { ApplicationDropdown } from '../SecretsForm/ApplicationDropdown';

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
    expect(screen.getByText('Loading applications...')).toBeVisible();
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

  it('should change the application dropdown value', async () => {
    useApplicationsMock.mockReturnValue([
      [{ metadata: { name: 'app1' } }, { metadata: { name: 'app2' } }],
      true,
    ]);

    formikRenderer(<ApplicationDropdown name="targets.application" />, {
      targets: { application: 'app' },
    });
    expect(screen.queryByRole('button')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByLabelText('Select application'));
      screen.getByText('app2');
    });
    await act(async () => {
      fireEvent.click(screen.getByText('app2'));
    });
    waitFor(() => {
      expect(screen.getByText('app2'));
    });
  });
});
