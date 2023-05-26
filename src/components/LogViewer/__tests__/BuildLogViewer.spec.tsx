import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { PipelineRunLabel, PipelineRunType } from '../../../consts/pipelinerun';
import { componentCRMocks } from '../../ApplicationDetails/__data__/mock-data';
import { pipelineRunMock } from '../__data__/pipelineRunMocks';
import { BuildLogViewer } from '../BuildLogViewer';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

describe('BuildLogViewer', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show loading box if pipelineRuns are being fetched', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[], false]);
    render(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('loading-indicator')).not.toBeNull();
  });

  it('should show empty box if pipelineRuns not found', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[], true]);
    render(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });

  it('should show component name', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    render(<BuildLogViewer component={componentCRMocks[0]} />);
    screen.getByText('basic-node-js', { exact: false });
  });

  it('should render PipelineRunLogs', () => {
    configure({ testIdAttribute: 'data-testid' });

    const watchResourceMock = useK8sWatchResource as jest.Mock;
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    render(<BuildLogViewer component={componentCRMocks[0]} />);

    screen.getByTestId('logs-tasklist');
  });

  it('should show empty box if it is not a build pipelinerun', () => {
    const watchResourceMock = useK8sWatchResource as jest.Mock;
    const pipelineruns = [
      {
        ...pipelineRunMock,
        metadata: {
          ...pipelineRunMock.metadata,
          labels: {
            ...pipelineRunMock.metadata.labels,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
          },
        },
      },
    ];
    watchResourceMock.mockReturnValue([
      pipelineruns.filter(
        (p) => p.metadata.labels[PipelineRunLabel.PIPELINE_TYPE] === PipelineRunType.BUILD,
      ),
      true,
    ]);

    render(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });
});
