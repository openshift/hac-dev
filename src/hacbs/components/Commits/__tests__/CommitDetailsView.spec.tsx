import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getCommitShortName } from '../../../utils/commits-utils';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitDetailsView, { COMMITS_GS_LOCAL_STORAGE_KEY } from '../CommitDetailsView';

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

jest.mock('../../../../hooks', () => ({
  useLocalStorage: jest.fn(),
}));

jest.mock('../tabs/CommitDetails/CommitVisualization', () => () => <div />);

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('CommitDetailsView', () => {
  beforeEach(() => {
    localStorage.removeItem(COMMITS_GS_LOCAL_STORAGE_KEY);
    watchResourceMock.mockReturnValue([pipelineWithCommits, true]);
  });

  it('should render spinner while pipeline data is not loaded', () => {
    watchResourceMock.mockReturnValueOnce([[], false]);
    render(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByRole('progressbar');
  });

  it('should show plr fetching error if unable to load plrs', () => {
    watchResourceMock.mockReturnValueOnce([[], true, true]);
    render(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByText('Could not load PipelineRun');
    screen.getByText('Not found');
  });

  it('should show commit not found error if no matching pipelineruns are found ', () => {
    watchResourceMock.mockReturnValueOnce([[], true]);
    render(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByText('Commit not found');
    screen.getByText('No such commit');
  });

  it('should render proper commit details', () => {
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    screen.getAllByText(getCommitShortName('commit123'));
  });

  it('should show the getting started modal when not dismissed', () => {
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(screen.getByTestId('getting-started-modal')).toBeVisible();
  });

  it('should hide the getting started modal when dismissed', () => {
    localStorage[COMMITS_GS_LOCAL_STORAGE_KEY] = 'true';
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(screen.queryByTestId('getting-started-modal')).toBeNull();
  });

  it('should update local storage when getting started is dismissed', () => {
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(localStorage[COMMITS_GS_LOCAL_STORAGE_KEY]).toBe(undefined);
    const dismissButton = screen.getByTestId('getting-started-modal-dismiss');
    fireEvent.click(dismissButton);
    expect(localStorage[COMMITS_GS_LOCAL_STORAGE_KEY]).toBe('true');
  });

  it('should show the getting started modal when learn more is clicked', async () => {
    localStorage.setItem(COMMITS_GS_LOCAL_STORAGE_KEY, 'true');
    await act(() => {
      render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    });
    expect(screen.queryByTestId('getting-started-modal')).toBeNull();
    const learnMoreButton = screen.getByTestId('commit-overview-learn-more');
    fireEvent.click(learnMoreButton);

    await waitFor(() => {
      expect(screen.getByTestId('getting-started-modal')).toBeVisible();
    });
  });
});
