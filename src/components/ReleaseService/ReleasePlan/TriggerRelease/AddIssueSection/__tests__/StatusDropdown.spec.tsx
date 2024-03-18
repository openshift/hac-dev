import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import StatusDropdown from '../StatusDropdown';

describe('StatusDropdown', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show dropdown options', async () => {
    formikRenderer(<StatusDropdown name="status" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByRole('menuitem', { name: 'Resolved' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Unresolved' })).toBeVisible();
  });

  it('should change the status dropdown value', async () => {
    formikRenderer(<StatusDropdown name="status" />, {
      targets: { application: 'app' },
    });
    expect(screen.queryByRole('button')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      screen.getByText('Unresolved');
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Unresolved'));
    });
    waitFor(() => {
      expect(screen.getByText('Unresolved'));
    });
  });
});
