import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as dateTime from '../../../shared/components/timestamp/datetime';
import { getCommitsFromPLRs } from '../../../utils/commits-utils';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitsListRow from '../CommitsListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../commit-status', () => ({
  useCommitStatus: () => ['-', true],
}));

const commits = getCommitsFromPLRs(pipelineWithCommits);

describe('CommitsListRow', () => {
  it('lists correct Commit details', () => {
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

  it('should show commit icon for commits', () => {
    render(<CommitsListRow columns={null} obj={commits[0]} />);
    screen.getByAltText('Commit icon');
  });

  it('should show pull request icon for pull requests', () => {
    commits[0].isPullRequest = true;
    commits[0].pullRequestNumber = '23';
    render(<CommitsListRow columns={null} obj={commits[0]} />);
    screen.getByAltText('Pull request icon');
    screen.getAllByText('#23 test-title');
  });
});
