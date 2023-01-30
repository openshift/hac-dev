import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table as PfTable, TableHeader } from '@patternfly/react-table';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as dateTime from '../../../shared/components/timestamp/datetime';
import { getCommitsFromPLRs } from '../../../utils/commits-utils';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitsListRow from '../CommitsListRow';
import CommitsListView from '../CommitsListView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: jest.fn(),
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('../commit-status', () => ({
  useCommitStatus: () => ['-', true],
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
                <CommitsListRow columns={null} obj={d} />
              </tr>
            ))}
          </tbody>
        </PfTable>
      );
    },
  };
});

const mockNavigate = useNavigate as jest.Mock;

const commits = getCommitsFromPLRs(pipelineWithCommits.slice(0, 4));

describe('CommitsListView', () => {
  it('renders correct commit data', () => {
    const { getByText, queryByText, container } = render(
      <CommitsListRow columns={null} obj={commits[0]} />,
    );
    const expectedDate = dateTime.dateTimeFormatter.format(new Date(commits[0].creationTime));
    expect(queryByText('commit1')).not.toBeInTheDocument();
    expect(getByText('#11 test-title')).toBeInTheDocument();
    expect(container).toHaveTextContent(expectedDate.toString());
    expect(getByText('branch_1')).toBeInTheDocument();
    expect(getByText('sample-component')).toBeInTheDocument();
  });

  it('should filter present in the view', async () => {
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" />);
    await waitFor(() => screen.getAllByText('Status'));
    await waitFor(() => screen.getAllByPlaceholderText<HTMLInputElement>('Filter by name...'));
  });

  it('should show Recent commits heading based on the props', () => {
    const { rerender } = render(
      <CommitsListView commits={commits} applicationName="purple-mermaid-app" />,
    );
    expect(screen.queryByText('Recent commits')).not.toBeInTheDocument();
    rerender(<CommitsListView commits={commits} applicationName="purple-mermaid-app" recentOnly />);
    expect(screen.queryByText('Recent commits')).toBeInTheDocument();
  });

  it('should navigate to activiy tab', () => {
    const navigate = jest.fn();
    mockNavigate.mockImplementation(() => navigate);
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" recentOnly />);
    fireEvent.click(screen.getByText('View More'));
    expect(navigate).toHaveBeenCalledWith(`/stonesoup/applications/purple-mermaid-app/activity`);
  });

  it('should contain the list of commits', () => {
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" recentOnly />);

    screen.getByText('#11 test-title');
    screen.getByText('#11 test-title-2');
  });

  it('should match the commit if it is filtered by name', () => {
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'test-title-2' },
      });
    });
    expect(screen.queryByText('#11 test-title-2')).toBeInTheDocument();
    expect(screen.queryByText('#11 test-title')).not.toBeInTheDocument();
  });

  it('should match the commits if it is filtered by pr number', () => {
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" />);

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
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" />);

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
    render(<CommitsListView commits={commits} applicationName="purple-mermaid-app" />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'invalid-test-title-2' },
      });
    });
    expect(screen.queryByText('#11 test-title')).not.toBeInTheDocument();
    expect(screen.queryByText('#11 test-title-2')).not.toBeInTheDocument();
  });
});
