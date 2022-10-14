import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, render, screen } from '@testing-library/react';
import { sampleBuildPipelines } from '../../../ApplicationDetails/tabs/overview/visualization/hooks/__data__/workflow-data';
import { testPipelineRun } from '../../../topology/__data__/pipeline-test-data';
import PipelineRunDetailsTab from '../PipelineRunDetailsTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../../components/NamespacedPage/NamespacedPage', () => ({
  useNamespace: jest.fn(() => 'test'),
}));

jest.mock('../../../topology/factories/VisualizationFactory', () => () => <div />);

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

describe('PipelineRunDetailsTab', () => {
  it('should not render the pipelinerun details tab', () => {
    render(<PipelineRunDetailsTab pipelineRun={null} />);
    expect(screen.queryByText('Pipeline run details')).not.toBeInTheDocument();
  });

  it('should render the pipelinerun details tab', () => {
    render(<PipelineRunDetailsTab pipelineRun={sampleBuildPipelines[0]} />);
    screen.getByText('Pipeline run details');
  });

  it('should not render the pipelinerun visualization if the status field is missing', () => {
    render(<PipelineRunDetailsTab pipelineRun={sampleBuildPipelines[0]} />);
    expect(screen.queryByTestId('hacbs-pipelinerun-graph')).not.toBeInTheDocument();
  });

  it('should render the pipelinerun visualization', () => {
    render(<PipelineRunDetailsTab pipelineRun={testPipelineRun} />);
    screen.getByTestId('hacbs-pipelinerun-graph');
  });
});
