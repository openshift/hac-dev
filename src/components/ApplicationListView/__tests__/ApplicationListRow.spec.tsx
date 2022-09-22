import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as dateTime from '../../../shared/components/timestamp/datetime';
import { ApplicationKind, ComponentKind } from '../../../types';
import ApplicationListRow from '../ApplicationListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const application: ApplicationKind = {
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
};

const components: ComponentKind[] = [
  {
    kind: 'Component',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      creationTimestamp: '2022-02-03T19:34:28Z',
      finalizers: Array['application.appstudio.redhat.com/finalizer'],
      name: 'component1',
      namespace: 'test',
      resourceVersion: '187593762',
      uid: '60725777-a545-4c54-bf25-19a3f231aed1',
    },
    spec: {
      application: 'mno-app',
      componentName: 'component1',
      source: null,
    },
  },
  {
    kind: 'Component',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      creationTimestamp: '2022-02-03T19:34:28Z',
      finalizers: Array['application.appstudio.redhat.com/finalizer'],
      name: 'component2',
      namespace: 'test',
      resourceVersion: '187593762',
      uid: '60725777-a545-4c54-bf25-19a3f231aed1',
    },
    spec: {
      application: 'mno-app',
      componentName: 'component2',
      source: null,
    },
  },
];

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('Application List Row', () => {
  it('renders application list row', () => {
    watchResourceMock.mockReturnValue([components, true]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText(application.metadata.name)).toBeInTheDocument();
    expect(getByText('2 Components')).toBeInTheDocument();
  });

  it('renders 0 components in the component column if the application has none available', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText('0 Components')).toBeInTheDocument();
  });

  it('renders skeleton in the component & last deploy columns if the components are not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText('Loading component count')).toBeInTheDocument();
    expect(getByText('Loading last deploy time')).toBeInTheDocument();
  });

  it('shows latest component deploy time in last deploy column', () => {
    watchResourceMock.mockReturnValue([components, true]);
    const { container } = render(<ApplicationListRow columns={null} obj={application} />);
    const expectedDate = dateTime.dateTimeFormatter.format(
      new Date(components[0].metadata.creationTimestamp),
    );
    expect(container).toHaveTextContent(expectedDate.toString());
  });
});
