import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useK8sWatchResource, k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, screen, waitFor } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../__data__/pipelinerun-data';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { routerRenderer } from '../../../utils/test-utils';
import { PipelineRunDetailsView } from '../PipelineRunDetailsView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
  k8sPatchResource: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../PipelineRunDetailsView/PipelineRunVisualization', () => () => <div />);

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: jest.fn(),
    useSearchParams: () => React.useState(() => new URLSearchParams()),
    useParams: jest.fn(),
  };
});

jest.mock('../../../hooks/useComponents', () => {
  const actual = jest.requireActual('../../../hooks/useComponents');
  return {
    ...actual,
    useComponent: () => [
      {
        metadata: { name: 'mock-component', namespace: 'test' },
        spec: { application: 'test-app' },
      },
      true,
    ],
  };
});

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;
const mockK8sCreate = k8sCreateResource as jest.Mock;
const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;
const useParamsMock = useParams as jest.Mock;

const pipelineRunName = 'java-springboot-sample-b4trz';
const mockPipelineRun = {
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
      'appstudio.openshift.io/component': 'java-springboot-sample',
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

configure({ testIdAttribute: 'data-test' });

describe('PipelineRunDetailsView', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({});
  });

  it('should render spinner if pipelinerun data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getByRole('progressbar');
  });

  it('should render the error state if the pipeline run is not found', () => {
    watchResourceMock.mockReturnValue([[], false, { code: 404 }]);
    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getByText('404: Page not found');
    screen.getByText('Go to applications list');
  });

  it('should render the error state if the pipeline run is being deleted', () => {
    const deletedPipelineRun = {
      ...mockPipelineRun,
      metadata: { ...mockPipelineRun.metadata, deletionTimestamp: '1' },
    };
    watchResourceMock.mockReturnValueOnce([deletedPipelineRun, true]).mockReturnValue([[], true]);
    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getByText('404: Page not found');
    screen.getByText('Go to applications list');
  });

  it('should render pipeline run name if pipeline run data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockPipelineRun, true]).mockReturnValue([[], true]);
    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    screen.getAllByText(pipelineRunName);
  });

  it('should render pipeline run if components data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockPipelineRun, true]).mockReturnValue([[], true]);
    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    expect(screen.queryByText('Pipeline run details')).toBeInTheDocument();
    expect(screen.queryByText('Status')).toBeInTheDocument();
    expect(screen.queryByText('Namespace')).toBeInTheDocument();
  });

  it('should render Stop and Cancel buttons under the Actions dropdown', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.SUCCEEDED], true])
      .mockReturnValue([[], true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);

    const actionsDropdown = screen.queryByRole('button', { name: 'Actions' });
    expect(actionsDropdown).toBeInTheDocument();
    fireEvent.click(actionsDropdown);

    expect(screen.queryByText('Stop')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
  });

  it('should enable Stop and Cancel buttons if the pipeline is running', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.RUNNING], true])
      .mockReturnValue([[], true]);
    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);

    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'false');
    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'false');
  });

  it('should disable Stop and Cancel buttons if the pipelinerun is succeeded', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.SUCCEEDED], true])
      .mockReturnValue([[], true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable Stop and Cancel buttons if the pipelinerun is in cancelled state', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.PIPELINE_RUN_CANCELLED], true])
      .mockReturnValue([[], true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable Stop and Cancel buttons if the pipelinerun is in stopped state', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.PIPELINE_RUN_STOPPED], true])
      .mockReturnValue([[], true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });

  // Todo: will re-enable this after we figure out the proper rerun solution after mvp
  xit('should rerun and navigate to new pipelinerun page', async () => {
    const navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    let newPlrName: string;
    mockK8sCreate.mockImplementation((data) => {
      newPlrName = data.resource.metadata.name;
      return Promise.resolve(data.resource);
    });
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.RUNNING], true])
      .mockReturnValue([[], true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Rerun')).toHaveAttribute('aria-disabled', 'false');

    fireEvent.click(screen.queryByRole('menuitem', { name: 'Rerun' }));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(`/application-pipeline/pipelineruns/${newPlrName}`);
    });
  });

  it('should render start new build action', async () => {
    const navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => {
      return navigateMock;
    });
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.SUCCEEDED], true])
      .mockReturnValue([[], true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    const startNewBuildButton = screen.queryByText('Start new build');
    expect(startNewBuildButton).toHaveAttribute('aria-disabled', 'false');

    fireEvent.click(startNewBuildButton);
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/application-pipeline/workspaces//applications/test-app/activity/pipelineruns?name=mock-component',
      ),
    );
  });

  it('should disable Stop and Cancel buttons if user does not have access to patch pipeline run', () => {
    watchResourceMock
      .mockReturnValueOnce([testPipelineRuns[DataState.RUNNING], true])
      .mockReturnValue([[], true]);
    useAccessReviewForModelMock
      .mockReturnValueOnce([true, true])
      .mockReturnValueOnce([false, true]);

    routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Actions' }));

    expect(screen.queryByText('Stop')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Cancel')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should display the correct tab', async () => {
    useParamsMock.mockReturnValue({ activeTab: 'detail' });
    watchResourceMock.mockReturnValueOnce([mockPipelineRun, true]).mockReturnValue([[], true]);
    let detailsPage = routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);

    let appDetails = screen.getByTestId('details');
    let activeTab = appDetails.querySelector('.pf-c-tabs__item.pf-m-current .pf-c-tabs__item-text');
    expect(activeTab).toHaveTextContent('Details');
    detailsPage.unmount();

    useParamsMock.mockReturnValue({ activeTab: 'taskruns' });
    watchResourceMock.mockReturnValueOnce([mockPipelineRun, true]).mockReturnValue([[], true]);
    detailsPage = routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    appDetails = detailsPage.getByTestId('details');
    activeTab = appDetails.querySelector('.pf-c-tabs__item.pf-m-current .pf-c-tabs__item-text');
    expect(activeTab).toHaveTextContent('Task runs');
    detailsPage.unmount();

    useParamsMock.mockReturnValue({ activeTab: 'logs' });
    watchResourceMock.mockReturnValueOnce([mockPipelineRun, true]).mockReturnValue([[], true]);
    detailsPage = routerRenderer(<PipelineRunDetailsView pipelineRunName={pipelineRunName} />);
    appDetails = detailsPage.getByTestId('details');
    activeTab = appDetails.querySelector('.pf-c-tabs__item.pf-m-current .pf-c-tabs__item-text');
    expect(activeTab).toHaveTextContent('Logs');
    detailsPage.unmount();
  });
});
