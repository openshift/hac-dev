import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSnapshotsEnvironmentBindings } from '../../../hooks/useSnapshotsEnvironmentBindings';
import * as dateTime from '../../../shared/components/timestamp/datetime';
import { ApplicationKind, ComponentKind } from '../../../types';
import { mockSnapshotsEnvironmentBindings } from '../../ApplicationDetails/__data__';
import ApplicationListRow from '../ApplicationListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
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
    displayName: 'mno app display name',
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
const useSnapshotsEnvironmentBindingsMock = useSnapshotsEnvironmentBindings as jest.Mock;

describe('Application List Row', () => {
  beforeEach(() => {
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([mockSnapshotsEnvironmentBindings, true]);
  });

  it('renders application list row', () => {
    watchResourceMock.mockReturnValue([components, true]);
    const { getByText, container } = render(
      <ApplicationListRow columns={null} obj={application} />,
    );
    const expectedDate = dateTime.dateTimeFormatter.format(
      new Date(
        mockSnapshotsEnvironmentBindings[0].status.componentDeploymentConditions[0].lastTransitionTime,
      ),
    );
    expect(getByText(application.spec.displayName)).toBeInTheDocument();
    expect(getByText('2 Components')).toBeInTheDocument();
    expect(container).toHaveTextContent(expectedDate.toString());
  });

  it('should render the last deployed environment timestamp in an application list', () => {
    watchResourceMock.mockReturnValue([components, true]);
    render(<ApplicationListRow columns={null} obj={application} />);
    dateTime.dateTimeFormatter.format(
      new Date(
        mockSnapshotsEnvironmentBindings[0].status.componentDeploymentConditions[0].lastTransitionTime,
      ),
    );
  });

  it('renders 0 components in the component column if the application has none available', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText('0 Components')).toBeInTheDocument();
  });

  it('renders skeleton in the component column if the components are not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText('Loading component count')).toBeInTheDocument();
  });

  it('renders skeleton in the last deploy column if the snapshots are not loaded', () => {
    watchResourceMock.mockReturnValue([components, true]);
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([[], false]);
    const { getByText } = render(<ApplicationListRow columns={null} obj={application} />);
    expect(getByText('Loading deploy time')).toBeInTheDocument();
  });

  it('should render metadata name if there is no display name', () => {
    watchResourceMock.mockReturnValue([[], false]);
    const { getByRole } = render(
      <ApplicationListRow
        columns={null}
        obj={{ ...application, spec: { ...application.spec, displayName: '' } }}
      />,
    );
    expect(getByRole('link', { name: application.metadata.name })).toBeInTheDocument();
  });
});
