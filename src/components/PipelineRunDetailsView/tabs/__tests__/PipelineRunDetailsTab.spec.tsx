import * as React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { CustomError } from '../../../../shared/utils/error/custom-error';
import { PipelineRunKind, TaskRunKind, TektonResourceLabel } from '../../../../types';
import { sampleBuildPipelines } from '../../../ApplicationDetails/tabs/overview/visualization/hooks/__data__/workflow-data';
import { pipelineWithCommits } from '../../../Commits/__data__/pipeline-with-commits';
import { testPipelineRun } from '../../../topology/__data__/pipeline-test-data';
import PipelineRunDetailsTab from '../PipelineRunDetailsTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
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
const getTaskRunsFromPLR = (plr: PipelineRunKind): TaskRunKind[] =>
  Object.keys(plr.status.taskRuns).map((trName) => ({
    apiVersion: 'v1alpha1',
    kind: 'TaskRun',
    metadata: {
      labels: {
        [TektonResourceLabel.pipelineTask]: plr.status.taskRuns[trName].pipelineTaskName,
        [PipelineRunLabel.APPLICATION]: 'my-app',
      },
      name: trName,
    },
    spec: {},
    status: plr.status.taskRuns[trName].status,
  }));
describe('PipelineRunDetailsTab', () => {
  it('should render the pipelinerun details tab', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={sampleBuildPipelines[0]}
        taskRuns={getTaskRunsFromPLR(sampleBuildPipelines[0])}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByText('Pipeline run details');
  });

  it('should render the pipelinerun component reference', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={sampleBuildPipelines[0]}
        taskRuns={getTaskRunsFromPLR(sampleBuildPipelines[0])}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.getByRole('link', { name: /1-nodejs/ })).toBeInTheDocument();
  });

  it('should not render the pipelinerun visualization if the status field is missing', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={sampleBuildPipelines[1]}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.queryByTestId('pipelinerun-graph')).not.toBeInTheDocument();
  });

  it('should render the pipelinerun visualization', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByTestId('pipelinerun-graph');
  });

  it('should not render the error fields for the succeeded pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);

    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
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
    render(
      <PipelineRunDetailsTab
        pipelineRun={failedPipelineRun}
        taskRuns={getTaskRunsFromPLR(failedPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByText('Message');
    screen.getByText('Log snippet');
  });

  it('should render the graph error state', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
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
    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByText('Component');
  });

  it('should not render the commit link for simple pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.queryByText('Commit')).not.toBeInTheDocument();
  });

  it('should render the commit link for pac pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={pipelineWithCommits[0]}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByText('Commit');
  });

  it('should render the source Url for advanced pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(
      <PipelineRunDetailsTab
        pipelineRun={pipelineWithCommits[0]}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByText('Source');
  });

  it('should render the source Url for simple pipelinerun', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const simplePipelineRun = {
      ...testPipelineRun,
      metadata: {
        ...testPipelineRun.metadata,
        annotations: {
          ...testPipelineRun.metadata.annotations,
          [PipelineRunLabel.BUILD_SERVICE_REPO_ANNOTATION]:
            'https://github.com/test/test-repo?rev=1e0f5587bb0a4986071ddae9a2d59834c3cf8432',
        },
      },
    };
    render(
      <PipelineRunDetailsTab
        pipelineRun={simplePipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    screen.getByText('Source');
  });

  it('should not render the source section for a pipelinerun without any source', () => {
    watchResourceMock.mockReturnValue([[], true]);

    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.queryByText('Source')).not.toBeInTheDocument();
  });

  it('should render the download SBOM section for a pipelinerun with image annotation', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const simplePipelineRun = {
      ...testPipelineRun,
      metadata: {
        ...testPipelineRun.metadata,
        annotations: {
          ...testPipelineRun.metadata.annotations,
          [PipelineRunLabel.BUILD_IMAGE_ANNOTATION]: 'quay.io/test/user-workload:test-image',
        },
      },
    };
    render(
      <PipelineRunDetailsTab
        pipelineRun={simplePipelineRun}
        taskRuns={getTaskRunsFromPLR(simplePipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.queryByText('Download SBOM')).toBeInTheDocument();
  });

  it('should render the download SBOM section for a pipelinerun with IMAGE_URL result', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const simplePipelineRun = {
      ...testPipelineRun,
      status: {
        ...testPipelineRun.status,
        pipelineResults: [
          {
            name: 'IMAGE_URL',
            value: 'quay.io/test/user-workload:test-image',
          },
        ],
      },
    };
    render(
      <PipelineRunDetailsTab
        pipelineRun={simplePipelineRun}
        taskRuns={getTaskRunsFromPLR(simplePipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.queryByText('Download SBOM')).toBeInTheDocument();
  });

  it('should not render the download SBOM section for a pipelinerun without any image annotation', () => {
    watchResourceMock.mockReturnValue([[], true]);

    render(
      <PipelineRunDetailsTab
        pipelineRun={testPipelineRun}
        taskRuns={getTaskRunsFromPLR(testPipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.queryByText('Download SBOM')).not.toBeInTheDocument();
  });

  it('should render the view SBOM logs section for a pipelinerun with show-sbom task', () => {
    watchResourceMock.mockReturnValue([[], true]);
    const simplePipelineRun = {
      ...testPipelineRun,
      metadata: {
        ...testPipelineRun.metadata,
        annotations: {
          ...testPipelineRun.metadata.annotations,
          [PipelineRunLabel.BUILD_IMAGE_ANNOTATION]: 'quay.io/test/user-workload:test-image',
        },
      },
    };
    render(
      <PipelineRunDetailsTab
        pipelineRun={simplePipelineRun}
        taskRuns={getTaskRunsFromPLR(simplePipelineRun)}
        error={null}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(screen.getByText('View SBOM')).toBeInTheDocument();
    expect(screen.getByText('View SBOM')).toHaveProperty(
      'href',
      'http://localhost/stonesoup/workspaces/test-ws/applications/my-app/taskruns/sum-and-multiply-pipeline-8mhx4-show-sbom/logs',
    );
  });
});
