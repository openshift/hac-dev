import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, render, screen } from '@testing-library/react';
import { CustomError } from '../../../shared/utils/error/custom-error';
import { testPipelineRun } from '../../topology/__data__/pipeline-test-data';
import PipelineRunVisualization from '../PipelineRunVisualization';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../topology/factories/VisualizationFactory', () => () => <div />);

configure({ testIdAttribute: 'data-test' });

beforeEach(() => {
  const createElement = document.createElement.bind(document);
  document.createElement = (tagName) => {
    if (tagName === 'canvas') {
      return {
        getContext: () => ({
          measureText: () => ({}),
        }),
      };
    }
    return createElement(tagName);
  };
});

describe('PipelineRunVisualization', () => {
  it('should not render the pipelinerun graph', () => {
    render(<PipelineRunVisualization pipelineRun={null} taskRuns={[]} error={null} />);
    expect(screen.queryByTestId('pipelinerun-graph')).not.toBeInTheDocument();
  });

  it('should not render the pipelinerun graph if the pipelinerun status is not available yet', () => {
    const plrWithoutStatus = { ...testPipelineRun, status: undefined };
    render(<PipelineRunVisualization pipelineRun={plrWithoutStatus} taskRuns={[]} error={null} />);
    expect(screen.queryByTestId('pipelinerun-graph')).not.toBeInTheDocument();
  });

  it('should surface the api error message', () => {
    render(
      <PipelineRunVisualization
        taskRuns={[]}
        pipelineRun={null}
        error={new CustomError('Model does not exist')}
      />,
    );
    expect(screen.queryByText('Model does not exist')).toBeInTheDocument();
  });

  it('should render the pipelinerun graph', () => {
    render(<PipelineRunVisualization pipelineRun={testPipelineRun} taskRuns={[]} error={null} />);
    screen.getByTestId('pipelinerun-graph');
  });
});
