import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render, waitFor, configure, fireEvent, act } from '@testing-library/react';
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

const mockUseScrollDirection = useScrollDirection as jest.Mock;

const getCurrentLogs = () => 'Current log text';

describe('MultiStreamLogs', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());

    configure({ testIdAttribute: 'data-testid' });
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
        setCurrentLogsGetter={getCurrentLogs}
      />,
    );

    await waitFor(() => {
      getByTestId('loading-indicator');
    });
  });

  it('should render resume log stream button when user scrolls up and removed when users scrolls to the bottom of the logs', async () => {
    mockUseScrollDirection.mockReturnValue([ScrollDirection.scrollingUp, () => {}]);
    const { getByTestId, rerender } = render(
      <MultiStreamLogs
        resourceName={samplePod.metadata.name}
        resource={samplePod}
        setCurrentLogsGetter={() => {}}
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
        setCurrentLogsGetter={() => {}}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('resume-log-stream')).not.toBeInTheDocument();
    });
  });
});
