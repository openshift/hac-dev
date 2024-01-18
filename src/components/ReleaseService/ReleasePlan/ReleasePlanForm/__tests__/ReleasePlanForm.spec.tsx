import React from 'react';
import '@testing-library/jest-dom';
import { FormikProps } from 'formik';
import { formikRenderer } from '../../../../../utils/test-utils';
import { WorkspaceContext } from '../../../../../utils/workspace-context-utils';
import { ReleasePlanForm } from '../ReleasePlanForm';

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
  Link: (props: any) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ workspace: 'test-ws' })),
}));

jest.mock('../../../../../hooks/useApplications', () => ({
  useApplications: jest.fn(() => [[], true]),
}));

jest.mock('../../../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...jest.requireActual('react'),
    useContext: jest.fn((ctx) =>
      ctx === WorkspaceContext
        ? { namespace: 'test-ns', workspaces: [], workspacesLoaded: true }
        : actual.useContext(ctx),
    ),
  };
});

describe('ReleasePlanForm', () => {
  it('should show create form if edit flag is not provided', () => {
    const values = {};
    const props = { values } as FormikProps<any>;
    const result = formikRenderer(<ReleasePlanForm {...props} />, values);
    expect(result.getByRole('heading', { name: 'Create release plan' })).toBeVisible();
    expect(result.getByRole('button', { name: 'Create' })).toBeVisible();
    expect(result.getByRole('button', { name: 'Create' })).toBeVisible();
    expect(result.getByRole('radio', { name: 'In the current workspace: test-ws' })).toBeVisible();
    expect(result.getByRole('radio', { name: 'In a target workspace' })).toBeVisible();
    expect(result.getByRole('checkbox', { name: 'Auto release' })).toBeVisible();
    expect(result.getByRole('checkbox', { name: 'Standing attribution' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Release plan name' })).toBeVisible();
  });

  it('should show edit form if edit flag is provided', () => {
    const values = {};
    const props = { values } as FormikProps<any>;
    const result = formikRenderer(<ReleasePlanForm {...props} edit />, values);
    expect(result.getByRole('heading', { name: 'Edit release plan' })).toBeVisible();
    expect(result.getByRole('button', { name: 'Save' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Release plan name' })).toBeDisabled();
  });
});
