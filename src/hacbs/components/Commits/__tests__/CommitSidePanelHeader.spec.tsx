import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, configure } from '@testing-library/react';
import { runStatus } from '../../../../shared';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import CommitSidePanelHeader, { SortedPLRList } from '../CommitSidePanelHeader';

const mockSortedPLRList: SortedPLRList = {
  [runStatus.Cancelled]: [],
  [runStatus.Failed]: [],
  [runStatus.Succeeded]: [],
  [runStatus.Running]: [],
  [runStatus.Pending]: [],
};

const successPLRs = pipelineWithCommits.slice(0, 3);
const failedPLRs = pipelineWithCommits.slice(3, 5);
const runningPLRs = pipelineWithCommits.slice(4, 5);

configure({ testIdAttribute: 'data-test' });

describe('CommitSidePanelHeader', () => {
  afterEach(() => {
    mockSortedPLRList[runStatus.Failed] = [];
    mockSortedPLRList[runStatus.Succeeded] = [];
    mockSortedPLRList[runStatus.Running] = [];
  });

  it('should render proper buttons for 1st PLR of type Failed', () => {
    mockSortedPLRList.Failed = failedPLRs;
    mockSortedPLRList.Succeeded = successPLRs;
    render(
      <CommitSidePanelHeader
        drawerRef={null}
        sortedPLRList={mockSortedPLRList}
        changeStatus={() => null}
        currentIndex={0}
        currentStatus={runStatus.Failed}
        previousTask={() => null}
        nextTask={() => null}
        onPanelCloseClick={() => null}
      />,
    );
    screen.getByText('1/2');
    screen.getByText('Failed');
    expect(screen.getByTestId('previous-plr-button')).toBeDisabled();
    expect(screen.getByTestId('next-plr-button')).toBeEnabled();
  });

  it('should render proper buttons for 2nd PLR of type Succeeded', () => {
    mockSortedPLRList.Failed = failedPLRs;
    mockSortedPLRList.Succeeded = successPLRs;
    render(
      <CommitSidePanelHeader
        drawerRef={null}
        sortedPLRList={mockSortedPLRList}
        changeStatus={() => null}
        currentIndex={1}
        currentStatus={runStatus.Succeeded}
        previousTask={() => null}
        nextTask={() => null}
        onPanelCloseClick={() => null}
      />,
    );
    screen.getByText('2/3');
    screen.getByText('Succeeded');
    expect(screen.getByTestId('previous-plr-button')).toBeEnabled();
    expect(screen.getByTestId('next-plr-button')).toBeEnabled();
  });

  it('should render proper buttons for only 1 PLR of type Succeded', () => {
    mockSortedPLRList.Running = runningPLRs;
    mockSortedPLRList.Succeeded = successPLRs;
    render(
      <CommitSidePanelHeader
        drawerRef={null}
        sortedPLRList={mockSortedPLRList}
        changeStatus={() => null}
        currentIndex={0}
        currentStatus={runStatus.Running}
        previousTask={() => null}
        nextTask={() => null}
        onPanelCloseClick={() => null}
      />,
    );
    screen.getByText('1/1');
    screen.getByText('Running');
    expect(screen.getByTestId('previous-plr-button')).toBeDisabled();
    expect(screen.getByTestId('next-plr-button')).toBeDisabled();
  });

  it('should render proper buttons for a Status with no PLR', () => {
    mockSortedPLRList.Running = runningPLRs;
    mockSortedPLRList.Succeeded = successPLRs;
    render(
      <CommitSidePanelHeader
        drawerRef={null}
        sortedPLRList={mockSortedPLRList}
        changeStatus={() => null}
        currentIndex={0}
        currentStatus={runStatus.Failed}
        previousTask={() => null}
        nextTask={() => null}
        onPanelCloseClick={() => null}
      />,
    );
    screen.getByText('Failed');
    expect(screen.getByTestId('previous-plr-button')).toBeDisabled();
    expect(screen.getByTestId('next-plr-button')).toBeDisabled();
  });
});
