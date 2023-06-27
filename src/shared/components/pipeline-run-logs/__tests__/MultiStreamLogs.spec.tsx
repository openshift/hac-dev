import * as React from 'react';
import '@testing-library/jest-dom';
import { commonFetchText } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, render, waitFor, configure, fireEvent, act } from '@testing-library/react';
import { debounce, throttle } from 'lodash-es';
import { samplePod } from '../../../../__data__/pod-data';
import { ScrollDirection, useScrollDirection } from '../../../hooks/scroll';
import { MultiStreamLogs } from '../logs/MultiStreamLogs';

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
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

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
    commonFetchText: jest.fn(),
  };
});

const mockCommmonFetchText = commonFetchText as jest.Mock;
const mockDebounce = debounce as jest.Mock;
const mockThrottle = throttle as jest.Mock;
const mockUseScrollDirection = useScrollDirection as jest.Mock;

describe('MultiStreamLogs', () => {
  let downloadAllCallback;
  beforeEach(() => {
    downloadAllCallback = jest.fn();
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());

    configure({ testIdAttribute: 'data-testid' });
    mockCommmonFetchText.mockReturnValue(Promise.resolve());
    mockDebounce.mockImplementation((fn) => fn);
    mockThrottle.mockImplementation((fn) => fn);
    mockUseScrollDirection.mockReturnValue([null, () => {}]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading indicator', async () => {
    configure({ testIdAttribute: 'data-test' });
    const { getByTestId } = render(
      <MultiStreamLogs
        resourceName={'invalid-pod'}
        resource={samplePod}
        errorMessage={''}
        taskName={'step-init'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    await waitFor(() => {
      getByTestId('loading-indicator');
    });
  });

  it('should render the logs control buttons and container', () => {
    render(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        errorMessage={''}
        taskName={'step-init'}
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

  it('should disable download when an error is present', () => {
    render(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        errorMessage="test error"
        taskName={'step-init'}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );
    const downloadButton = screen.getByText('Download');
    expect(downloadButton).toBeDisabled();
  });

  it('should render resume log stream button when user scrolls up and removed when users scrolls to the bottom of the logs', async () => {
    mockUseScrollDirection.mockReturnValue([ScrollDirection.scrollingUp, () => {}]);
    const { getByTestId, rerender } = render(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        errorMessage={''}
        taskName={'step-init'}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    let resumeLogStream: HTMLElement;

    await waitFor(() => {
      resumeLogStream = getByTestId('resume-log-stream');
    });

    act(() => {
      fireEvent.click(resumeLogStream);
    });

    mockUseScrollDirection.mockReturnValue([ScrollDirection.scrolledToBottom, () => {}]);
    rerender(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        errorMessage={''}
        taskName={'step-init'}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('resume-log-stream')).not.toBeInTheDocument();
    });
  });

  it('should call onDownload callback when download button is pressed', async () => {
    downloadAllCallback.mockReturnValue(Promise.resolve());

    render(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        errorMessage={''}
        taskName={'step-init'}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    act(() => {
      fireEvent.click(screen.getByText('Download all task logs'));
    });
    await waitFor(() => {
      expect(downloadAllCallback).toHaveBeenCalled();
    });
  });

  it('should handle if the download fails', async () => {
    downloadAllCallback.mockImplementation(() => Promise.reject(new Error('Download Failed')));
    render(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        errorMessage={''}
        taskName={'step-init'}
        downloadAllLabel={'Download all task logs'}
        onDownloadAll={downloadAllCallback}
      />,
    );

    act(() => {
      fireEvent.click(screen.getByText('Download all task logs'));
    });
    await waitFor(() => {
      expect(downloadAllCallback).rejects.toThrowError();
    });
  });
});
