import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitDetailsView from '../CommitDetailsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('CommitDetailsView', () => {
  it('should render spinner while pipeline data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByRole('progressbar');
  });

  it('should show plr fetching error if unable to load plrs', () => {
    watchResourceMock.mockReturnValue([[], true, true]);
    render(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByText('Could not load PipelineRun');
    screen.getByText('Not found');
  });

  it('should show commit not found error if no matching pipelineruns are found ', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByText('Commit not found');
    screen.getByText('No such commit');
  });

  it('should render proper commit details', () => {
    watchResourceMock.mockReturnValueOnce([pipelineWithCommits, true]).mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    screen.getAllByText('commit123');
  });
});
