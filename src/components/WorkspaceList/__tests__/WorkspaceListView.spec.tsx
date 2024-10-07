import * as React from 'react';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { act, fireEvent, screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WorkspaceContext } from '../../../utils/workspace-context-utils';
import WorkspaceListRow from '../WorkspaceListRow';
import WorkspaceListView from '../WorkspaceListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('../../../shared/components/table/TableComponent', () => {
  return (props) => {
    const { data, filters, selected, match, kindObj } = props;
    const cProps = { data, filters, selected, match, kindObj };
    const columns = props.Header(cProps);

    return (
      <PfTable role="table" aria-label="table" cells={columns} variant="compact" borders={false}>
        <TableHeader role="rowgroup" />
        <tbody>
          {props.data.map((d, i) => (
            <tr key={i}>
              <WorkspaceListRow columns={null} obj={d} />
            </tr>
          ))}
        </tbody>
      </PfTable>
    );
  };
});

describe('WorkspaceListView', () => {
  beforeEach(() => {});

  it('should render failure message if no data', () => {
    render(
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
        <WorkspaceListView />
      </WorkspaceContext.Provider>,
    );
    expect(screen.getByText('Unable to load workspaces')).toBeVisible();
  });

  it('should render rows when workspaces loaded', () => {
    render(
      <WorkspaceContext.Provider
        value={{
          namespace: 'test-ns',
          lastUsedWorkspace: 'test-ws',
          workspace: 'test-ws',
          workspaceResource: undefined,
          workspacesLoaded: true,
          kubesawWorkspaces: [],
          konfluxWorkspaces: [
            {
              metadata: { namespace: 'test-ws' },
              kind: 'Workspace',
              apiVersion: 'v1alpha1',
              status: null,
            },
            {
              metadata: { namespace: 'test-ws-1' },
              kind: 'Workspace',
              apiVersion: 'v1alpha1',
              status: null,
            },
            {
              metadata: { namespace: 'test-ws-2' },
              kind: 'Workspace',
              apiVersion: 'v1alpha1',
              status: null,
            },
          ],
          updateWorkspace: jest.fn(),
        }}
      >
        <WorkspaceListView />
      </WorkspaceContext.Provider>,
    );
    expect(screen.queryByText('test-ws')).toBeInTheDocument();
    expect(screen.queryByText('test-ws-1')).toBeInTheDocument();
    expect(screen.queryByText('test-ws-2')).toBeInTheDocument();
  });

  it('should perform case insensitive filter by name', () => {
    render(
      <WorkspaceContext.Provider
        value={{
          namespace: 'test-ns',
          lastUsedWorkspace: 'test-ws',
          workspace: 'test-ws',
          workspaceResource: undefined,
          workspacesLoaded: true,
          kubesawWorkspaces: [],
          konfluxWorkspaces: [
            {
              metadata: { namespace: 'test-ws' },
              kind: 'Workspace',
              apiVersion: 'v1alpha1',
              status: null,
            },
            {
              metadata: { namespace: 'test-ws-1' },
              kind: 'Workspace',
              apiVersion: 'v1alpha1',
              status: null,
            },
            {
              metadata: { namespace: 'test-ws-2' },
              kind: 'Workspace',
              apiVersion: 'v1alpha1',
              status: null,
            },
          ],
          updateWorkspace: jest.fn(),
        }}
      >
        <WorkspaceListView />
      </WorkspaceContext.Provider>,
    );
    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'test-ws-1' },
      });
    });
    expect(screen.queryByText('test-ws-1')).toBeInTheDocument();
    expect(screen.queryByText('test-ws-2')).not.toBeInTheDocument();
  });
});
