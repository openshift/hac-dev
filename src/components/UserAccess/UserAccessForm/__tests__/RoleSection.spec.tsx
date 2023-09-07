import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { RoleSection } from '../RoleSection';

describe('RoleSection', () => {
  it('should not render permissions if role is not selected', () => {
    formikRenderer(<RoleSection />, { role: '' });
    expect(screen.getByText('Select role')).toBeVisible();
    expect(
      screen.getByText('Select a role to assign to all of the users you added.'),
    ).toBeVisible();
    expect(screen.queryByText('Show list of permissions')).toBeNull();
  });

  it('should render permissions if role is selected', () => {
    formikRenderer(<RoleSection />, { role: '' });
    fireEvent.click(screen.getByText('Select role'));
    expect(screen.getByText('contributor')).toBeVisible();
    expect(screen.getByText('maintainer')).toBeVisible();
    expect(screen.getByText('owner')).toBeVisible();
    fireEvent.click(screen.getByText('maintainer'));
    expect(screen.getByText('Show list of permissions for the maintainer')).toBeVisible();

    fireEvent.click(screen.getByText('maintainer'));
    fireEvent.click(screen.getByText('owner'));
    expect(screen.getByText('Show list of permissions for the owner')).toBeVisible();
  });
});
