import * as React from 'react';
import '@testing-library/jest-dom';
import { commonFetchText, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, render, waitFor, configure, fireEvent, act } from '@testing-library/react';
import { saveAs } from 'file-saver';
import { debounce, throttle } from 'lodash-es';
import { PodGroupVersionKind } from '../../../../models/pod';
import { TaskRunKind } from '../../../../types';
import { useFullscreen } from '../../../hooks/fullscreen';
import { useScrollDirection } from '../../../hooks/scroll';
import LogsWrapperComponent from '../logs/LogsWrapperComponent';

jest.mock('../logs/Logs', () => (props) => {
  React.useEffect(() => {
    props.onComplete(props.container.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>{`Logs - ${props.container.name}`}</div>;
});

jest.mock('../../../hooks/scroll', () => {
  const actual = jest.requireActual('../../../hooks/scroll');

  return {
    ...actual,
    useScrollDirection: jest.fn(),
  };
});

jest.mock('../../../hooks/fullscreen', () => {
  return {
    useFullscreen: jest.fn(),
  };
});

jest.mock('file-saver', () => {
  const actual = jest.requireActual('lodash-es');
  return {
    ...actual,
    saveAs: jest.fn(),
  };
});

jest.mock('lodash-es', () => {
  const actual = jest.requireActual('lodash-es');
  return {
    ...actual,
    debounce: jest.fn(),
    throttle: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    useK8sWatchResource: jest.fn(),
    commonFetchText: jest.fn(),
  };
});

const mockCommonFetchText = commonFetchText as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useFullscreenMock = useFullscreen as jest.Mock;

const mockDebounce = debounce as jest.Mock;
const mockThrottle = throttle as jest.Mock;
const mockUseScrollDirection = useScrollDirection as jest.Mock;
const mockSaveAs = saveAs as jest.Mock;

const downloadAllCallback = jest.fn();

describe('LogWrapperComponent', () => {
  const taskRun: TaskRunKind = {
    apiVersion: 'v1alpha1',
    kind: 'TaskRun',
    metadata: {
      labels: {
        'tekton.dev/pipelineTask': 'do-something',
      },
      name: 'test-caseqfvdj-do-something',
    },
    spec: {
      taskRef: {
        name: 'first',
      },
    },
    status: {
      completionTime: '2022-11-28T12:09:26Z',
      conditions: [
        {
          lastTransitionTime: '2022-11-28T12:09:26Z',
          message: 'All Steps have completed executing',
          reason: 'Succeeded',
          status: 'True',
          type: 'Succeeded',
        },
      ],
      podName: 'test-caseqfvdj-do-something-pod',
      startTime: '2022-11-28T12:09:18Z',
      steps: [
        {
          container: 'step-do-something',
          imageID:
            'docker.io/library/alpine@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4',
          name: 'do-something',
          terminated: {
            containerID: 'cri-o://51ed1ddfa563e5149d0281ebc9c761967bf6bbb85c5454e0b34ae04066d8091c',
            exitCode: 0,
            finishedAt: '2022-11-28T12:09:26Z',
            reason: 'Completed',
            startedAt: '2022-11-28T12:09:26Z',
          },
        },
      ],
      taskSpec: {
        params: [
          {
            name: 'arg',
            type: 'string',
          },
        ],
        steps: [
          {
            image: 'alpine',
            name: 'do-something',
            computeResources: {},
            script: 'echo "prefix:suffix" | grep "prefix:suffix"\n',
          },
        ],
      },
    },
  };

  let fullScreen = false;

  useFullscreenMock.mockImplementation(() => {
    return [
      fullScreen,
      () => {},
      () => {
        fullScreen = !fullScreen;
      },
    ];
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
    fullScreen = false;

    configure({ testIdAttribute: 'data-testid' });
    mockCommonFetchText.mockReturnValue(Promise.resolve());
    mockDebounce.mockImplementation((fn) => fn);
    mockThrottle.mockImplementation((fn) => fn);
    mockUseScrollDirection.mockReturnValue([null, () => {}]);
    watchResourceMock.mockReturnValue([{ metadata: { name: 'test-pod' } }, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading indicator', async () => {
    watchResourceMock.mockReturnValueOnce([[], false]);
    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel="Download all task logs"
        onDownloadAll={downloadAllCallback}
      />,
    );

    await waitFor(() => {
      screen.getByTestId('loading-indicator');
    });
  });

  it('should download data on download', async () => {
    watchResourceMock.mockReturnValueOnce([[], true, 'error']);
    const downloadAll = () =>
      new Promise<Error>((resolve) => {
        resolve(null);
      });

    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel="Download all task logs"
        onDownloadAll={downloadAll}
      />,
    );

    const downloadButton = screen.getByText('Download');
    expect(downloadButton).toHaveClass('pf-v5-c-button');

    act(() => {
      fireEvent.click(downloadButton);
    });
    await waitFor(() => {
      expect(mockSaveAs).toHaveBeenCalled();
    });
  });
  it('should render the logs control buttons and container', () => {
    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    waitFor(() => {
      screen.getByTestId('logs-task-container');
      screen.getByText('Download');
      screen.getByText('Download all task logs');
      screen.getByText('Expand');
    });
  });
  it('should render fullscreen', async () => {
    fullScreen = true;
    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    await waitFor(() => {
      screen.getByText('Collapse');
    });
  });
  it('should call onDownloadAll callback when download all button is pressed', async () => {
    downloadAllCallback.mockImplementation(() => null);
    const downloadAll = () =>
      new Promise<Error>((resolve) => {
        resolve(null);
        downloadAllCallback();
      });

    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel="Download all task logs"
        onDownloadAll={downloadAll}
      />,
    );

    const downloadAllButton = screen.getByText('Download all task logs');
    expect(downloadAllButton).toHaveClass('pf-v5-c-button');

    act(() => {
      fireEvent.click(screen.getByText('Download all task logs'));
    });
    await waitFor(() => {
      expect(downloadAllCallback).toHaveBeenCalled();
    });
  });
  it('should show tekton logs when pod is not available', async () => {
    watchResourceMock.mockReturnValue([[], true, 'error']);
    const downloadAll = () =>
      new Promise<Error>((resolve) => {
        resolve(null);
      });

    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel="Download all task logs"
        onDownloadAll={downloadAll}
      />,
    );
    screen.getByTestId('tr-logs-container');
  });

  it('should handle if the download fails', async () => {
    downloadAllCallback.mockImplementation(() => null);
    const downloadAll = () =>
      new Promise<Error>((resolve, reject) => {
        reject(new Error('Download Failed'));
        downloadAllCallback();
      });
    render(
      <LogsWrapperComponent
        resource={{
          name: 'podName',
          groupVersionKind: PodGroupVersionKind,
          namespace: 'test-ns',
          isList: false,
        }}
        pipelineRunUID="test-id"
        taskRun={taskRun}
        downloadAllLabel="Download all task logs"
        onDownloadAll={downloadAll}
      />,
    );

    act(() => {
      fireEvent.click(screen.getByText('Download all task logs'));
    });
    await waitFor(() => {
      expect(downloadAllCallback).toHaveBeenCalled();
    });
  });
});
