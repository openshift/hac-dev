import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormikProps } from 'formik';
import { useReleasePlans } from '../../../../../hooks/useReleasePlans';
import { useSnapshots } from '../../../../../hooks/useSnapshots';
import { formikRenderer } from '../../../../../utils/test-utils';
import { TriggerReleaseForm, getApplicationNameForReleasePlan } from '../TriggerReleaseForm';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    Link: (props: any) => <a href={props.to}>{props.children}</a>,
    useLocation: () => jest.fn(),
  };
});

jest.mock('../AddIssueSection/AddIssueSection', () => ({
  AddIssueSection: (props) => <span>{props.name}</span>,
}));

jest.mock('../../../../../hooks/useSnapshots', () => ({
  useSnapshots: jest.fn(),
}));

jest.mock('../../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));

jest.mock('../../../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));

const useSnapshotsMock = useSnapshots as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;

describe('TriggerReleaseForm', () => {
  beforeEach(() => {
    useReleasePlansMock.mockReturnValue([[], false]);
    useSnapshotsMock.mockReturnValue([[], false]);
  });
  it('should show trigger release button and heading', () => {
    const values = {};
    const props = { values } as FormikProps<any>;
    const result = formikRenderer(<TriggerReleaseForm {...props} />, values);
    expect(result.getByRole('heading', { name: 'Trigger release plan' })).toBeVisible();
    expect(result.getByRole('button', { name: 'Trigger' })).toBeVisible();
  });

  it('should show trigger release input fields', () => {
    const values = {};
    const props = { values } as FormikProps<any>;
    const result = formikRenderer(<TriggerReleaseForm {...props} />, values);
    expect(result.getByRole('textbox', { name: 'Synopsis' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Description' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'Topic' })).toBeVisible();
    expect(result.getByRole('textbox', { name: 'References' })).toBeVisible();
  });

  it('should show release & snapshot dropdown in loading state', () => {
    const values = {};
    const props = { values } as FormikProps<any>;
    formikRenderer(<TriggerReleaseForm {...props} />, values);
    expect(screen.getByText('Loading release plans...')).toBeVisible();
    expect(screen.getByText('Loading snapshots...')).toBeVisible();
  });
});

describe('getApplicationNameForReleasePlan', () => {
  it('should return the application name if the release plan is found', () => {
    const releasePlans = [{ metadata: { name: 'plan1' }, spec: { application: 'app1' } }];
    const selectedReleasePlan = 'plan1';
    expect(getApplicationNameForReleasePlan(releasePlans, selectedReleasePlan, true)).toBe('app1');
  });

  it('should return an empty string if no matching release plan is found', () => {
    const releasePlans = [{ metadata: { name: 'plan1' }, spec: { application: 'app1' } }];
    const selectedReleasePlan = 'plan2';
    expect(getApplicationNameForReleasePlan(releasePlans, selectedReleasePlan, true)).toBe('');
  });

  it('should return an empty string if loaded is false', () => {
    const releasePlans = [{ metadata: { name: 'plan1' }, spec: { application: 'app1' } }];
    const selectedReleasePlan = 'plan2';
    expect(getApplicationNameForReleasePlan(releasePlans, selectedReleasePlan, false)).toBe('');
  });

  it('should return an empty string if release plan list is empty', () => {
    const releasePlans = [];
    const selectedReleasePlan = 'plan2';
    expect(getApplicationNameForReleasePlan(releasePlans, selectedReleasePlan, true)).toBe('');
  });

  it('should return an empty string if release plan has no application', () => {
    const releasePlans = [{ metadata: { name: 'plan1' }, spec: {} }];
    const selectedReleasePlan = 'plan1';
    expect(getApplicationNameForReleasePlan(releasePlans, selectedReleasePlan, true)).toBe('');
  });
});
