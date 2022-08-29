import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as dateTime from '../../../../shared/components/timestamp/datetime';
import { getCommitsFromPLRs } from '../../../utils/commits-utils';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitsListRow from '../CommitsListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const commits = getCommitsFromPLRs(pipelineWithCommits);

describe('CommitsListView', () => {
  it('renders correct commit data', () => {
    const { getByText, container } = render(<CommitsListRow columns={null} obj={commits[0]} />);
    const expectedDate = dateTime.dateTimeFormatter.format(new Date(commits[0].creationTime));
    expect(getByText('commit1')).toBeInTheDocument();
    expect(container).toHaveTextContent(expectedDate.toString());
    expect(getByText('branch_1')).toBeInTheDocument();
    expect(getByText('sample-component')).toBeInTheDocument();
  });
});
