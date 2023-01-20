import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

const mockNavigate = useNavigate as jest.Mock;

const commits = getCommitsFromPLRs(pipelineWithCommits.slice(0, 4));

describe('CommitsListView', () => {
  it('renders correct commit data', () => {
    const { getByText, queryByText, container } = render(
      <CommitsListRow columns={null} obj={commits[0]} />,
    );
    const expectedDate = dateTime.dateTimeFormatter.format(new Date(commits[0].creationTime));
    expect(queryByText('commit1')).not.toBeInTheDocument();
    expect(getByText('test-title')).toBeInTheDocument();
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
});
