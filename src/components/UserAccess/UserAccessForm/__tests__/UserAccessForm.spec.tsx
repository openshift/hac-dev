import * as React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { FormikProps } from 'formik';
import { formikRenderer } from '../../../../utils/test-utils';
import { UserAccessForm } from '../UserAccessForm';

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ workspace: 'test-ws' })),
}));

jest.mock('../../../../utils/breadcrumb-utils', () => ({
  useWorkspaceBreadcrumbs: jest.fn(() => []),
}));

jest.mock('../../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

describe('UserAccessForm', () => {
  it('should show create form', () => {
    const values = { usernames: [], role: null };
    const props = { values } as FormikProps<any>;
    formikRenderer(<UserAccessForm {...props} />, values);
    expect(screen.getByText('Grant access to workspace, test-ws')).toBeVisible();
    expect(
      screen.getByText(
        'Invite users to collaborate with you by granting them access to your workspace.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Grant access' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Grant access' })).toBeDisabled();
  });

  it('should show edit form', () => {
    const values = { usernames: [], role: null };
    const props = { values } as FormikProps<any>;
    formikRenderer(<UserAccessForm {...props} edit />, values);
    expect(screen.getByText('Edit access to workspace, test-ws')).toBeVisible();
    expect(
      screen.getByText(
        'Change permissions for this user by adding a role or removing a current role.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });
});
