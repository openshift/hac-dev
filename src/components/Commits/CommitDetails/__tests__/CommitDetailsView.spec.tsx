import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen } from '@testing-library/react';
import { usePipelineRunsForCommit } from '../../../../hooks/usePipelineRuns';
import { getCommitShortName } from '../../../../utils/commits-utils';
import { routerRenderer } from '../../../../utils/test-utils';
import { pipelineWithCommits } from '../../__data__/pipeline-with-commits';
import CommitDetailsView, { COMMITS_GS_LOCAL_STORAGE_KEY } from '../CommitDetailsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: () => {},
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

jest.mock('../../../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

jest.mock('../../../../hooks/usePipelineRuns', () => ({
  usePipelineRunsForCommit: jest.fn(),
}));

jest.mock('../visualization/CommitVisualization', () => () => <div />);

const watchCommitPrsMock = usePipelineRunsForCommit as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('CommitDetailsView', () => {
  beforeEach(() => {
    localStorage.removeItem(COMMITS_GS_LOCAL_STORAGE_KEY);
    watchResourceMock.mockReturnValue([pipelineWithCommits, true]);
    watchCommitPrsMock.mockReturnValue([pipelineWithCommits, true]);
  });

  it('should render spinner while pipeline data is not loaded', () => {
    watchResourceMock.mockReturnValueOnce([[], false]);
    watchCommitPrsMock.mockReturnValueOnce([[], false]);
    routerRenderer(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByRole('progressbar');
  });

  it('should show plr fetching error if unable to load plrs', () => {
    watchResourceMock.mockReturnValueOnce([[], true, { code: 503 }]);
    watchCommitPrsMock.mockReturnValueOnce([[], false, { code: 503 }]);
    routerRenderer(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByText('Could not load PipelineRun');
    screen.getByText('Not found');
  });

  it('should show commit not found error if no matching pipelineruns are found ', () => {
    watchResourceMock.mockReturnValueOnce([[], true]);
    watchCommitPrsMock.mockReturnValueOnce([[], true]);
    routerRenderer(<CommitDetailsView applicationName="test" commitName="commit123" />);
    screen.getByText('404: Page not found');
    screen.getByText('Go to applications list');
  });

  it('should render proper commit details', () => {
    routerRenderer(<CommitDetailsView applicationName="test-application" commitName="commit123" />);
    screen.getAllByText(getCommitShortName('commit123'));
  });
});
