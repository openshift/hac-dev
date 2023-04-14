import * as React from 'react';
import '@testing-library/jest-dom';
import { WebSocketFactory, commonFetchText } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { samplePod } from '../../../../__data__/pod-data';
import Logs from '../logs/Logs';
import { getRenderContainers } from '../logs/logs-utils';
import { LOG_SOURCE_RUNNING, LOG_SOURCE_TERMINATED } from '../utils';

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

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    commonFetchText: jest.fn(),
    WebSocketFactory: jest.fn(),
  };
});

const mockCommonFetchText = commonFetchText as jest.Mock;
const mockWebSocketFactory = WebSocketFactory as jest.Mock;
const ws = {
  onMessage: () => ws,
  onClose: () => ws,
  onError: () => ws,
  destroy: () => ws,
};

describe('Logs', () => {
  beforeEach(() => {
    mockCommonFetchText.mockReturnValue(Promise.resolve());
    mockWebSocketFactory.mockImplementation(() => ws);
  });

  it('should not render logs component if the render is set to false', async () => {
    const { containers } = getRenderContainers(samplePod);

    render(
      <Logs
        resourceStatus={LOG_SOURCE_TERMINATED}
        resource={samplePod}
        errorMessage={''}
        container={containers[0]}
        onComplete={() => {}}
        render={false}
        autoScroll={true}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('logs-container')).toHaveStyle({ display: 'none' });
    });
  });

  it('should render logs component', async () => {
    const { containers } = getRenderContainers(samplePod);

    render(
      <Logs
        resourceStatus={LOG_SOURCE_TERMINATED}
        resource={samplePod}
        errorMessage={''}
        container={containers[0]}
        onComplete={() => {}}
        render={true}
        autoScroll={true}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('step-init')).toBeInTheDocument();
      expect(screen.queryByTestId('logs-content')).toBeInTheDocument();
    });
  });

  it('should show the error alert', async () => {
    mockCommonFetchText.mockImplementation(() => Promise.reject('failed to retrieving logs'));
    const { containers } = getRenderContainers(samplePod);

    render(
      <Logs
        resourceStatus={LOG_SOURCE_TERMINATED}
        resource={null}
        errorMessage={'test'}
        container={containers[0]}
        onComplete={() => {}}
        render={true}
        autoScroll={true}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should fetch data from web sockets', async () => {
    const { containers } = getRenderContainers(samplePod);

    render(
      <Logs
        resourceStatus={LOG_SOURCE_RUNNING}
        resource={samplePod}
        errorMessage={''}
        container={containers[0]}
        onComplete={() => {}}
        render={true}
        autoScroll={true}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('step-init')).toBeInTheDocument();
      expect(screen.queryByTestId('logs-content')).toBeInTheDocument();
    });
  });
});
