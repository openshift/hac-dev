import React from 'react';
import '@testing-library/jest-dom';
import { FormikProps } from 'formik';
import { formikRenderer } from '../../../../../utils/test-utils';
import { WorkspaceContext } from '../../../../../utils/workspace-context-utils';
import { TriggerReleaseForm } from '../TriggerReleaseForm';

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
    ...actual,
    useContext: jest.fn((ctx) =>
      ctx === WorkspaceContext
        ? { namespace: 'test-ns', workspaces: [], workspacesLoaded: true }
        : actual.useContext(ctx),
    ),
  };
});

describe('ReleasePlanForm', () => {
  it('should show trigger form ', () => {
    const values = {};
    const props = { values } as FormikProps<any>;
    const result = formikRenderer(<TriggerReleaseForm {...props} />, values);
    expect(result.getByRole('heading', { name: 'Trigger release ' })).toBeVisible();
    expect(result.getByRole('button', { name: 'Trigger' })).toBeVisible();
    expect(result.getByRole('button', { name: 'Create' })).toBeVisible();
    expect(result.getByText('synopsis')).toBeVisible();
  });
});
