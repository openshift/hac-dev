import * as React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { CustomError } from '../../../../shared/utils/error/custom-error';
import { sampleBuildPipelines } from '../../../ApplicationDetails/tabs/overview/visualization/hooks/__data__/workflow-data';
import { pipelineWithCommits } from '../../../Commits/__data__/pipeline-with-commits';
import { testPipelineRun } from '../../../topology/__data__/pipeline-test-data';
import PipelineRunDetailsTab from '../PipelineRunDetailsTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../NamespacedPage/NamespacedPage', () => ({
  useNamespace: jest.fn(() => 'test'),
}));

jest.mock('../../../topology/factories/VisualizationFactory', () => () => <div />);

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

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
  it('should render the pipelinerun details tab', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={sampleBuildPipelines[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('Pipeline run details');
  });

  it('should render the pipelinerun component reference', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={sampleBuildPipelines[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByRole('link', { name: /1-nodejs/ })).toBeInTheDocument();
  });

  it('should not render the pipelinerun visualization if the status field is missing', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={sampleBuildPipelines[1]} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.queryByTestId('pipelinerun-graph')).not.toBeInTheDocument();
  });

  it('should render the pipelinerun visualization', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={testPipelineRun} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByTestId('pipelinerun-graph');
  });

  it('should not render the error fields for the succeeded pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);

    render(<PipelineRunDetailsTab pipelineRun={testPipelineRun} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.queryByText('Message')).not.toBeInTheDocument();
    expect(screen.queryByText('Log snippet')).not.toBeInTheDocument();
  });

  it('should render the error fields for the failed pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const failedPipelineRun = {
      ...testPipelineRun,
      status: {
        ...testPipelineRun.status,
        conditions: [
          {
            lastTransitionTime: '2022-12-20T11:58:45Z',
            message: 'PipelineRun "node-on-pull-request-g5twk" failed to finish within "1m0s"',
            reason: 'PipelineRunTimeout',
            status: 'False',
            type: 'Succeeded',
          },
        ],
      },
    };
    render(<PipelineRunDetailsTab pipelineRun={failedPipelineRun} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('Message');
    screen.getByText('Log snippet');
  });

  it('should render the graph error state', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        error={new CustomError('Model not found')}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByTestId('graph-error-state');
  });

  it('should render the component link', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={testPipelineRun} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('Component');
  });

  it('should not render the commit link for simple pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={testPipelineRun} error={null} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.queryByText('Commit')).not.toBeInTheDocument();
  });

  it('should render the commit link for pac pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunDetailsTab pipelineRun={pipelineWithCommits[0]} error={null} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('Commit');
  });
});
