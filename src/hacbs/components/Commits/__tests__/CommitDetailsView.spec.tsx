import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { useLocalStorage } from '../../../../hooks';
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

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useLocalStorageMock = useLocalStorage as jest.Mock;

describe('CommitDetailsView', () => {
  const storageKeys = {};

  beforeEach(() => {
    storageKeys[COMMITS_GS_LOCAL_STORAGE_KEY] = undefined;
    useLocalStorageMock.mockImplementation((key: string) => {
      return [
        storageKeys,
        (value) => {
          storageKeys[key] = value[key];
        },
      ];
    });
  });

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

  it('should show the getting started modal when not dismissed', () => {
    watchResourceMock.mockReturnValueOnce([pipelineWithCommits, true]).mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(screen.getByTestId('hacbs-getting-started-modal')).toBeVisible();
  });

  it('should hide the getting started modal when dismissed', () => {
    storageKeys[COMMITS_GS_LOCAL_STORAGE_KEY] = true;
    watchResourceMock.mockReturnValueOnce([pipelineWithCommits, true]).mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(screen.queryByTestId('hacbs-getting-started-modal')).toBeNull();
  });

  it('should update local storage when getting started is dismissed', () => {
    watchResourceMock.mockReturnValueOnce([pipelineWithCommits, true]).mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(storageKeys[COMMITS_GS_LOCAL_STORAGE_KEY]).toBe(undefined);
    const dismissButton = screen.getByTestId('hacbs-getting-started-modal-dismiss');
    fireEvent.click(dismissButton);
    expect(storageKeys[COMMITS_GS_LOCAL_STORAGE_KEY]).toBe(true);
  });

  it('should update local storage when learn more is clicked', () => {
    storageKeys[COMMITS_GS_LOCAL_STORAGE_KEY] = true;
    watchResourceMock.mockReturnValueOnce([pipelineWithCommits, true]).mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(screen.queryByTestId('hacbs-getting-started-modal')).toBeNull();

    const learnMoreButton = screen.getByTestId('hacbs-commit-overview-learn-more');
    fireEvent.click(learnMoreButton);
    expect(storageKeys[COMMITS_GS_LOCAL_STORAGE_KEY]).toBe(false);

    watchResourceMock.mockReturnValueOnce([pipelineWithCommits, true]).mockReturnValue([[], true]);
    render(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    expect(screen.getByTestId('hacbs-getting-started-modal')).toBeVisible();
  });
});
