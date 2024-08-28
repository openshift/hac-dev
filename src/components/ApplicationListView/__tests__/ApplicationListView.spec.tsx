import * as React from 'react';
import '@testing-library/jest-dom';
import { useSearchParams } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { render, screen, configure, fireEvent, waitFor } from '@testing-library/react';
import { ApplicationKind } from '../../../types';
import { WorkspaceContext } from '../../../utils/workspace-context-utils';
import ApplicationListRow from '../ApplicationListRow';
import ApplicationListView from '../ApplicationListView';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../utils/workspace-context-utils', () => {
  const actual = jest.requireActual('../../../utils/workspace-context-utils');
  return {
    ...actual,
    useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
  };
});

configure({ testIdAttribute: 'data-test' });

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useLocation: jest.fn(() => ({})),
    useSearchParams: jest.fn(),
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../shared/components/table', () => {
  const actual = jest.requireActual('../../../shared/components/table');
  return {
    ...actual,
    Table: (props) => {
      const { data, filters, selected, match, kindObj } = props;
      const cProps = { data, filters, selected, match, kindObj };
      const columns = props.Header(cProps);
      return (
        <PfTable role="table" aria-label="table" cells={columns} variant="compact" borders={false}>
          <TableHeader role="rowgroup" />
          <tbody>
            {props.data.map((d, i) => (
              <tr key={i}>
                <ApplicationListRow columns={null} obj={d} />
              </tr>
            ))}
          </tbody>
        </PfTable>
      );
    },
  };
});

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
const useSearchParamsMock = useSearchParams as jest.Mock;

const ApplicationList = () => (
  <WorkspaceContext.Provider
    value={{
      namespace: 'test-ns',
      lastUsedWorkspace: 'test-ws',
      workspace: 'test-ws',
      workspaceResource: undefined,
      workspacesLoaded: true,
      kubesawWorkspaces: [],
      konfluxWorkspaces: [],
      updateWorkspace: jest.fn(),
    }}
  >
    <ApplicationListView />
  </WorkspaceContext.Provider>
);
describe('Application List', () => {
  beforeEach(() => {
    useSearchParamsMock.mockImplementation(() => React.useState(new URLSearchParams()));
  });

  it('should render spinner if application data is not loaded', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([[], false]);
    render(<ApplicationList />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no application is present', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([[], true]);
    render(<ApplicationList />);
    screen.getByText('Easily onboard your applications');
    screen.getByText('Create and manage your applications');
    const button = screen.getByText('Create application');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe(
      'http://localhost/application-pipeline/workspaces/test-ws/import',
    );
  });

  it('should render empty state with no card', () => {
    useFeatureFlagMock.mockReturnValue([true]);
    watchResourceMock.mockReturnValue([[], true]);
    render(<ApplicationList />);
    screen.getByText('Easily onboard your applications');
    expect(screen.queryByText('Create and manage your applications.')).toBeNull();
  });

  it('should render application list when application(s) is(are) present', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    render(<ApplicationList />);
    screen.getByText('Create application');
    screen.getByText('Name');
    screen.getByText('Components');
    screen.getByText('Last deploy');
  });

  it('should render empty state when the only application is marked for deletion', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    const deletedApp = {
      ...applications[0],
      metadata: { ...applications[0].metadata, deletionTimestamp: '1' },
    };
    watchResourceMock.mockReturnValue([[deletedApp], true]);
    render(<ApplicationList />);
    screen.getByText('Easily onboard your applications');
    expect(screen.queryByText('Create and manage your applications.')).toBeNull();
  });

  it('should not contain applications breadcrumb link in the list view', () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    render(<ApplicationList />);
    expect(screen.queryByTestId('applications-breadcrumb-link')).not.toBeInTheDocument();
  });

  it('should apply query params to the filter', async () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    useSearchParamsMock.mockImplementation(() =>
      React.useState(new URLSearchParams('name=xyz-app')),
    );
    render(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).not.toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });
  });

  it('should filter applications by name', async () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    const { rerender } = render(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });

    const filter = screen.getByPlaceholderText('Filter by name...');
    fireEvent.change(filter, { target: { value: 'xyz-app' } });
    rerender(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).not.toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });
  });

  it('should use fallback filter value of metadata.name', async () => {
    useFeatureFlagMock.mockReturnValue([false]);
    const alteredApplications = applications.map((app) => ({
      ...app,
      spec: { displayName: undefined },
    }));
    watchResourceMock.mockReturnValue([alteredApplications, true]);
    const { rerender } = render(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });

    const filter = screen.getByPlaceholderText('Filter by name...');
    fireEvent.change(filter, { target: { value: 'xyz-app' } });
    rerender(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).not.toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });
  });

  it('should filter case insensitive', async () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    const { rerender } = render(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });

    const filter = screen.getByPlaceholderText('Filter by name...');
    fireEvent.change(filter, { target: { value: 'XYZ' } });
    rerender(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).not.toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });
  });

  it('should clear the filter when clear button is clicked', async () => {
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([applications, true]);
    const { rerender } = render(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });

    const filter = screen.getByPlaceholderText('Filter by name...');
    fireEvent.change(filter, { target: { value: 'invalid-app' } });
    rerender(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).not.toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).not.toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).not.toBeInTheDocument();
      expect(screen.queryByText('No results found')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));
    rerender(<ApplicationList />);
    await waitFor(() => {
      expect(screen.queryByText('mno-app')).toBeInTheDocument();
      expect(screen.queryByText('mno-app1')).toBeInTheDocument();
      expect(screen.queryByText('mno-app2')).toBeInTheDocument();
      expect(screen.queryByText('xyz-app')).toBeInTheDocument();
    });
  });
});
