import * as React from 'react';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSpaceBindingRequests } from '../../../hooks/useSpaceBindingRequests';
import { SpaceBindingRequest } from '../../../types';
import { SBRListRow } from '../SBRListRow';
import { UserAccessListView } from '../UserAccessListView';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
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

jest.mock('../../../hooks/useSpaceBindingRequests', () => ({
  useSpaceBindingRequests: jest.fn(),
}));

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

const useSBRsMock = useSpaceBindingRequests as jest.Mock;

describe('UserAccessListView', () => {
  beforeEach(() => {
    useSBRsMock.mockReturnValue([[mockSBR], true]);
  });

  it('should render empty state if no sbrs are present', () => {
    useSBRsMock.mockReturnValue([[], true]);
    render(<UserAccessListView />);
    expect(screen.getByText('Grant user access')).toBeVisible();
    const addButton = screen.queryByText('Grant access');
    expect(addButton).toBeInTheDocument();
    expect(addButton.closest('a').href).toContain(
      `http://localhost/application-pipeline/access/workspaces/test-ws/grant`,
    );
  });

  it('should render filter present in the view', async () => {
    render(<UserAccessListView />);
    expect(screen.getByPlaceholderText('Search by username...')).toBeVisible();
  });

  it('should render row of user data', () => {
    render(<UserAccessListView />);
    expect(screen.getByText('user1')).toBeVisible();
    expect(screen.getByText('contributor')).toBeVisible();
    expect(screen.getByText('Provisioned')).toBeVisible();
  });

  it('should match the user if filtered by name', () => {
    render(<UserAccessListView />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search by username...');
    act(() => {
      fireEvent.input(filter, {
        target: { value: 'user1' },
      });
    });
    expect(screen.queryByText('user1')).toBeInTheDocument();
  });

  it('should perform case insensitive filter by name', () => {
    render(<UserAccessListView />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Search by username...');
    act(() => {
      fireEvent.input(filter, {
        target: { value: 'USER1' },
      });
    });
    expect(screen.queryByText('user1')).toBeInTheDocument();
  });

  it('should not match the user if filtered by unmatched name', () => {
    render(<UserAccessListView />);

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
    useSBRsMock.mockReturnValue([[], false]);
    render(<UserAccessListView />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });
});
