import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../__data__/pipelinerun-data';
import { PipelineRunDetailsView } from '../PipelineRunDetailsView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../PipelineRunDetailsView/PipelineRunVisualization', () => () => <div />);

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

const pipelineRunName = 'java-springboot-sample-b4trz';
const mockApplication = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    annotations: {},
    creationTimestamp: '2022-04-11T19:36:25Z',
    finalizers: ['chains.tekton.dev/pipelinerun', 'pipelineruns.tekton.dev'],
    name: 'java-springboot-sample-b4trz',
    namespace: 'test',
    resourceVersion: '933786813',
    uid: 'f5dff823-52c5-43ee-a7de-a05915357689',
    labels: {
      'build.appstudio.openshift.io/component': 'java-springboot-sample',
    },
  },
  spec: {
    appModelRepository: {
      url: '',
    },
    displayName: 'Test Application',
    gitOpsRepository: {
      url: '',
    },
  },
  status: {
    conditions: [
      {
        startTime: '2022-08-04T16:23:43Z',
        completionTime: '2022-08-04T16:24:02Z',
      },
    ],
    taskRuns: {
      'java-springboot-sample-b4trz-show-summary': {
        pipelineTaskName: 'show-summary',
        status: {
          completionTime: '2022-08-23T19:08:18Z',
          conditions: [
            {
              lastTransitionTime: '2022-08-23T19:08:18Z',
              message:
                'failed to create task run pod "java-springboot-sample-b4trz-show-summary": Pod "java-springboot-sample-b4trz-show-summary-pod" is invalid: spec.activeDeadlineSeconds: Invalid value: 0: must be between 1 and 2147483647, inclusive. Maybe missing or invalid Task mfrances/summary',
              reason: 'CouldntGetTask',
              status: 'False',
              type: 'Succeeded',
            },
          ],
          podName: '',
          startTime: '2022-08-23T19:08:18Z',
          taskSpec: {
            description: 'App Studio Summary Pipeline Task.',
            params: [
              {
                description: 'pipeline-run to annotate',
                name: 'pipeline-run-name',
                type: 'string',
              },
              {
                description: 'Git URL',
                name: 'git-url',
                type: 'string',
              },
              {
                description: 'Image URL',
                name: 'image-url',
                type: 'string',
              },
            ],
            steps: [
              {
                image:
                  'registry.redhat.io/openshift4/ose-cli@sha256:e6b307c51374607294d1756b871d3c702251c396efdd44d4ef8db68e239339d3',
                name: 'appstudio-summary',
                resources: {},
                script:
                  '#!/usr/bin/env bash\necho\necho "App Studio Build Summary:"\necho\necho "Build repository: $(params.git-url)"\necho "Generated Image is in : $(params.image-url)"\necho\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/repo=$(params.git-url)\noc annotate pipelinerun $(params.pipeline-run-name) build.appstudio.openshift.io/image=$(params.image-url)\n\necho "Output is in the following annotations:"\n\necho "Build Repo is in \'build.appstudio.openshift.io/repo\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/repo}"\'\n\necho "Build Image is in \'build.appstudio.openshift.io/image\' "\necho \'oc get pr $(params.pipeline-run-name) -o jsonpath="{.metadata.annotations.build\\.appstudio\\.openshift\\.io/image}"\'\n\necho End Summary\n',
              },
            ],
          },
        },
      },
    },
  },
};

describe('PipelineRunDetailsView', () => {
  it('should render spinner if pipelinerun data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getByRole('progressbar');
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValue([[], true]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getAllByText(pipelineRunName);
  });

  it('should render application if components data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValue([[], true]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    expect(screen.queryByText('Pipeline run details')).toBeInTheDocument();
    expect(screen.queryByText('Status')).toBeInTheDocument();
    expect(screen.queryByText('Message')).toBeInTheDocument();
    expect(screen.queryByText('Namespace')).toBeInTheDocument();
    expect(screen.queryByText('Message')).toBeInTheDocument();
  });

  it('should render Stop and Cancel button under the Actions dropdown', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.SUCCEEDED], true])
      .mockReturnValue([[], true]);

    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);

    const actionsDropdown = screen.queryByRole('button', { name: 'Actions' });
    expect(actionsDropdown).toBeInTheDocument();
    fireEvent.click(actionsDropdown);

    expect(screen.queryByText('Stop')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
  });

  it('should enable Stop and Cancel button if the pipeline is running', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.RUNNING], true])
      .mockReturnValue([[], true]);
    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);

    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'false');
    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'false');
  });

  it('should disable Stop and Cancel button if the pipelinerun is succeeded', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.SUCCEEDED], true])
      .mockReturnValue([[], true]);

    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable Stop and Cancel button if the pipelinerun is in cancelled state', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.PIPELINE_RUN_CANCELLED], true])
      .mockReturnValue([[], true]);

    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable Stop and Cancel button if the pipelinerun is in stopped state', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.PIPELINE_RUN_STOPPED], true])
      .mockReturnValue([[], true]);

    render(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });
});
