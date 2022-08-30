import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, render, screen } from '@testing-library/react';
import { testPipelineRun } from '../../topology/__data__/pipeline-test-data';
import PipelineRunVisualization from '../PipelineRunVisualization';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
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
    render(<PipelineRunVisualization pipelineRun={null} />);
    expect(screen.queryByTestId('hacbs-pipelinerun-graph')).not.toBeInTheDocument();
  });

  it('should render the pipelinerun graph', () => {
    render(<PipelineRunVisualization pipelineRun={testPipelineRun} />);
    screen.getByTestId('hacbs-pipelinerun-graph');
  });
});
