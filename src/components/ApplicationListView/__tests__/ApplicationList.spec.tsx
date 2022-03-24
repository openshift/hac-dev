import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '../../../dynamic-plugin-sdk';
import { ApplicationKind } from '../../../types';
import ApplicationList from '../ApplicationList';

jest.mock('../../../dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../hooks/useActiveNamespace', () => ({
  useActiveNamespace: jest.fn(() => 'test-ns'),
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

describe('Application List', () => {
  it('renders empty state if no application is present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const { getByText } = render(<ApplicationList />);
    expect(getByText('Create an application')).toBeInTheDocument();
    expect(getByText('No applications found')).toBeInTheDocument();
  });

  it('renders application list when application(s) is(are) present', () => {
    watchResourceMock.mockReturnValue([applications, true]);
    const { getByText } = render(<ApplicationList />);
    expect(getByText('Create application')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Components')).toBeInTheDocument();
    expect(getByText('Environments')).toBeInTheDocument();
  });
});
