import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '../../../dynamic-plugin-sdk';
import * as dateTime from '../../../shared/components/timestamp/datetime';
import { ApplicationKind, ComponentKind } from '../../../types';
import ApplicationListRow from '../ApplicationListRow';

jest.mock('../../../dynamic-plugin-sdk', () => ({
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
    const { getByText, container } = render(
      <ApplicationListRow columns={null} obj={application} />,
    );
    const expectedDate = dateTime.dateTimeFormatter.format(
      new Date(application.metadata.creationTimestamp),
    );
    expect(getByText(application.metadata.name)).toBeInTheDocument();
    expect(getByText('2 Components')).toBeInTheDocument();
    expect(container).toHaveTextContent(expectedDate.toString());
  });

  it('renders 0 components in the component column if the application has none available', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText('0 Components')).toBeInTheDocument();
  });
});
