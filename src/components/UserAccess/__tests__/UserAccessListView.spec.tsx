import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { act, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SpaceBindingRequest } from '../../../types';
import { namespaceRenderer } from '../../../utils/test-utils';
import { SBRListRow } from '../SBRListRow';
import { UserAccessListView } from '../UserAccessListView';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [null, false]),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
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
                <SBRListRow columns={null} obj={d} />
              </tr>
            ))}
          </tbody>
        </PfTable>
      );
    },
  };
});

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const watchMock = useK8sWatchResource as jest.Mock;

const mockSBR: SpaceBindingRequest = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'SpaceBindingRequest',
  metadata: {
    name: 'test-sbr',
  },
  spec: {
    masterUserRecord: 'user1',
    spaceRole: 'contributor',
  },
  status: {
    conditions: [
      {
        reason: 'Provisioned',
        status: 'True',
      },
    ],
  },
};

describe('UserAccessListView', () => {
  it('should render empty state if no bindings are present', () => {
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        apiVersion: 'v1alpha1',
        apiGroup: 'toolchain.dev.openshift.com',
        kind: 'Workspace',
        status: {
          namespaces: [],
          role: 'admin',
          owner: 'my-user',
        },
      },
    });
    expect(screen.getByText('Grant user access')).toBeVisible();
    const addButton = screen.queryByText('Grant access');
    expect(addButton).toBeInTheDocument();
    expect(addButton.closest('a').href).toContain(
      `http://localhost/application-pipeline/access/workspaces/test-ws/grant`,
    );
  });

  it('should render filter present in the view', () => {
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        apiVersion: 'v1alpha1',
        apiGroup: 'toolchain.dev.openshift.com',
        kind: 'Workspace',
        status: {
          namespaces: [],
          role: 'admin',
          owner: 'my-user',
          bindings: [{ masterUserRecord: 'my-user', role: 'admin' }],
        },
      },
    });
    expect(screen.getByPlaceholderText('Search by username...')).toBeVisible();
  });

  it('should render row of user data', () => {
    watchMock.mockReturnValue([mockSBR, true]);
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        apiVersion: 'v1alpha1',
        apiGroup: 'toolchain.dev.openshift.com',
        kind: 'Workspace',
        status: {
          namespaces: [],
          role: 'admin',
          owner: 'my-user',
          bindings: [
            {
              masterUserRecord: 'user1',
              role: 'contributor',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      },
    });
    expect(screen.getByText('user1')).toBeVisible();
    expect(screen.getByText('contributor')).toBeVisible();
    expect(screen.getByText('Provisioned')).toBeVisible();
  });

  it('should match the user if filtered by name', () => {
    watchMock.mockReturnValue([mockSBR, true]);
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        apiVersion: 'v1alpha1',
        apiGroup: 'toolchain.dev.openshift.com',
        kind: 'Workspace',
        status: {
          namespaces: [],
          role: 'admin',
          owner: 'my-user',
          bindings: [
            {
              masterUserRecord: 'user1',
              role: 'contributor',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      },
    });

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search by username...');
    act(() => {
      fireEvent.input(filter, {
        target: { value: 'user1' },
      });
    });
    expect(screen.queryByText('user1')).toBeInTheDocument();
  });

  it('should perform case insensitive filter by name', () => {
    watchMock.mockReturnValue([mockSBR, true]);
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        apiVersion: 'v1alpha1',
        apiGroup: 'toolchain.dev.openshift.com',
        kind: 'Workspace',
        status: {
          namespaces: [],
          role: 'admin',
          owner: 'my-user',
          bindings: [
            {
              masterUserRecord: 'user1',
              role: 'contributor',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      },
    });

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search by username...');
    act(() => {
      fireEvent.input(filter, {
        target: { value: 'USER1' },
      });
    });
    expect(screen.queryByText('user1')).toBeInTheDocument();
  });

  it('should not match the user if filtered by unmatched name', () => {
    watchMock.mockReturnValue([mockSBR, true]);
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        apiVersion: 'v1alpha1',
        apiGroup: 'toolchain.dev.openshift.com',
        kind: 'Workspace',
        status: {
          namespaces: [],
          role: 'admin',
          owner: 'my-user',
          bindings: [
            {
              masterUserRecord: 'user1',
              role: 'contributor',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      },
    });

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search by username...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'invalid-user-2' },
      });
    });
    expect(screen.queryByText('user1')).not.toBeInTheDocument();
    expect(screen.queryByText('No results found')).toBeInTheDocument();
    expect(screen.queryByText('Clear all filters')).toBeInTheDocument();
  });

  it('should render spinner while data is not loaded', () => {
    namespaceRenderer(<UserAccessListView />, 'my-ns', {
      workspace: 'test-ws',
      workspaceResource: null,
    });
    expect(screen.getByRole('progressbar')).toBeVisible();
  });
});
