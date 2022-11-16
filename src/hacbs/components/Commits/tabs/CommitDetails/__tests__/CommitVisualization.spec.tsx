import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createCommitObjectFromPLR } from '../../../../../utils/commits-utils';
import { useCommitWorkflowData } from '../../../../ApplicationDetails/tabs/overview/visualization/hooks/useCommitWorkflowData';
import { pipelineWithCommits } from '../../../__data__/pipeline-with-commits';
import CommitVisualization from '../CommitVisualization';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../topology/factories/VisualizationFactory', () => () => <div />);

jest.mock(
  '../../../../ApplicationDetails/tabs/overview/visualization/hooks/useCommitWorkflowData',
  () => ({
    useCommitWorkflowData: jest.fn(),
  }),
);

const useCommitWorkflowDataMock = useCommitWorkflowData as jest.Mock;

beforeEach(() => {
  useCommitWorkflowDataMock.mockReturnValue([[], true]);
});

const commit = createCommitObjectFromPLR(pipelineWithCommits[0]);

describe('CommitVisualization', () => {
  it('should not render the pipelinerun graph', () => {
    useCommitWorkflowDataMock.mockReturnValue([[], false]);
    render(<CommitVisualization commit={null} />);
    expect(screen.queryByTestId('hacbs-commit-graph')).not.toBeInTheDocument();
  });

  it('should render the pipelinerun graph', () => {
    render(<CommitVisualization commit={commit} />);
    screen.getByTestId('hacbs-commit-graph');
  });
});
