import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { ApplicationKind } from '../../../types';
import ApplicationListView from '../ApplicationListView';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const applications: ApplicationKind[] = [
  {
    kind: 'Application',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      creationTimestamp: '2022-02-03T19:34:28Z',
      finalizers: Array['application.appstudio.redhat.com/finalizer'],
      name: 'mno-app',
      namespace: 'test',
      resourceVersion: '187593762',
      uid: '60725777-a545-4c54-bf25-19a3f231aed1',
    },
    spec: {
      displayName: 'mno-app',
    },
  },
  {
    kind: 'Application',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      creationTimestamp: '2022-02-03T14:34:28Z',
      finalizers: Array['application.appstudio.redhat.com/finalizer'],
      name: 'mno-app1',
      namespace: 'test',
      resourceVersion: '187593762',
      uid: '60725777-a545-4c54-bf25-19a3f231aed1',
    },
    spec: {
      displayName: 'mno-app1',
    },
  },
  {
    kind: 'Application',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      creationTimestamp: '2022-01-03T14:34:28Z',
      finalizers: Array['application.appstudio.redhat.com/finalizer'],
      name: 'mno-app2',
      namespace: 'test',
      resourceVersion: '187593762',
      uid: '60725777-a545-4c54-bf25-19a3f231aed1',
    },
    spec: {
      displayName: 'mno-app2',
    },
  },
  {
    kind: 'Application',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      creationTimestamp: '2022-01-03T14:34:28Z',
      finalizers: Array['application.appstudio.redhat.com/finalizer'],
      name: 'xyz-app',
      namespace: 'test2',
      resourceVersion: '187593762',
      uid: '60725777-a545-4c54-bf25-19a3f231aed1',
    },
    spec: {
      displayName: 'xyz-app',
    },
  },
];

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

describe('Application List', () => {
  it('should render spinner if application data is not loaded', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([[], false]);
    render(<ApplicationListView />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no application is present', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([[], true]);
    render(<ApplicationListView />);
    screen.getByText('Easily onboard your applications');
    screen.getByText('Create and manage your applications');
    const button = screen.getByText('Create application');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe('http://localhost/stonesoup/import');
  });

  it('should render empty state with no card', () => {
    useFeatureFlagMock.mockReturnValue([true]);
    watchResourceMock.mockReturnValue([[], true]);
    render(<ApplicationListView />);
    screen.getByText('Easily onboard your applications');
    expect(screen.queryByText('Create and manage your applications.')).toBeNull();
  });

  it('should render application list when application(s) is(are) present', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    render(<ApplicationListView />);
    screen.getByText('Create application');
    screen.getByText('Name');
    screen.getByText('Components');
    screen.getByText('Last deploy');
  });
});
