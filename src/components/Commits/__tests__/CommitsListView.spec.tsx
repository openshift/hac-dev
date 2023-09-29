import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useComponents } from '../../../hooks/useComponents';
import { useTRPipelineRuns } from '../../../hooks/useTektonResults';
import * as dateTime from '../../../shared/components/timestamp/datetime';
import { getCommitsFromPLRs } from '../../../utils/commits-utils';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import { MockComponents } from '../CommitDetails/visualization/__data__/MockCommitWorkflowData';
import CommitsListRow from '../CommitsListRow';
import CommitsListView from '../CommitsListView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useTektonResults');

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../commit-status', () => ({
  useCommitStatus: () => ['-', true],
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
              <CommitsListRow columns={null} obj={d} />
            </tr>
          ))}
        </tbody>
      </PfTable>
    );
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;

const commits = getCommitsFromPLRs(pipelineWithCommits.slice(0, 4));

describe('CommitsListView', () => {
  beforeEach(() => {
    watchResourceMock.mockReturnValue([pipelineWithCommits.slice(0, 4), true]);
    useComponentsMock.mockReturnValue([MockComponents, true]);
  });

  it('should render empty state if no commits are present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<CommitsListView applicationName="purple-mermaid-app" />);
    expect(
      screen.getByText(
        /To get started, add a component and merge its pull request for a build pipeline./,
      ),
    ).toBeVisible();
    const addButton = screen.queryByText('Add component');
    expect(addButton).toBeInTheDocument();
    expect(addButton.closest('a').href).toContain(
      `http://localhost/application-pipeline/workspaces/test-ws/import?application=purple-mermaid-app`,
    );
  });

  it('renders correct commit data', () => {
    const { getByText, queryByText, container } = render(
      <CommitsListRow columns={null} obj={commits[0]} />,
    );
    const expectedDate = dateTime.dateTimeFormatter.format(new Date(commits[0].creationTime));
    expect(queryByText('commit1')).toBeInTheDocument();
    expect(getByText('#11 test-title')).toBeInTheDocument();
    expect(container).toHaveTextContent(expectedDate.toString());
    expect(getByText('branch_1')).toBeInTheDocument();
    expect(getByText('sample-component')).toBeInTheDocument();
  });

  it('should filter present in the view', async () => {
    render(<CommitsListView applicationName="purple-mermaid-app" />);
    await waitFor(() => screen.getAllByText('Status'));
    await waitFor(() => screen.getAllByPlaceholderText<HTMLInputElement>('Filter by name...'));
  });

  it('should match the commit if it is filtered by name', () => {
    render(<CommitsListView applicationName="purple-mermaid-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'test-title-2' },
      });
    });
    expect(screen.getByText('#11 test-title-2')).toBeInTheDocument();
    expect(screen.queryByText('#11 test-title')).not.toBeInTheDocument();
  });

  it('should match the commits if it is filtered by pr number', () => {
    render(<CommitsListView applicationName="purple-mermaid-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: '#11' },
      });
    });
    expect(screen.queryByText('#11 test-title-2')).toBeInTheDocument();
    expect(screen.queryByText('#11 test-title')).toBeInTheDocument();
  });

  it('should perform case insensitive filter by name', () => {
    render(<CommitsListView applicationName="purple-mermaid-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'TEST-TITLE-2' },
      });
    });
    expect(screen.queryByText('#11 test-title-2')).toBeInTheDocument();
    expect(screen.queryByText('#11 test-title')).not.toBeInTheDocument();
  });

  it('should not match the commit if filtered by unmatched name', () => {
    const view = render(<CommitsListView applicationName="purple-mermaid-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'invalid-test-title-2' },
      });
    });
    expect(screen.queryByText('#11 test-title')).not.toBeInTheDocument();
    expect(screen.queryByText('#11 test-title-2')).not.toBeInTheDocument();

    // clear the filter
    const clearFilterButton = view.getAllByRole('button', { name: 'Clear all filters' })[0];
    fireEvent.click(clearFilterButton);
    expect(screen.queryByText('#11 test-title')).toBeInTheDocument();
    expect(screen.queryByText('#11 test-title-2')).toBeInTheDocument();
  });

  it('should filter by commit status', () => {
    const view = render(<CommitsListView applicationName="purple-mermaid-app" />);

    const filterMenuButton = view.getByRole('button', { name: /filter/i });
    fireEvent.click(filterMenuButton);

    const successCb = view.getByLabelText(/succeeded/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(successCb);
    expect(successCb.checked).toBe(true);

    expect(screen.queryByText('#11 test-title')).toBeInTheDocument();
    expect(screen.queryByText('#11 test-title-2')).not.toBeInTheDocument();
  });

  it('should render skeleton while data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    useTRPipelineRunsMock.mockReturnValue([[], false]);
    useComponentsMock.mockReturnValue([[], false]);
    render(<CommitsListView applicationName="purple-mermaid-app" />);
    expect(screen.getByTestId('data-table-skeleton')).toBeVisible();
  });
});
