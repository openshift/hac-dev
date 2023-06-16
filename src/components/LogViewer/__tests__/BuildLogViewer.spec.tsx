import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { PipelineRunLabel, PipelineRunType } from '../../../consts/pipelinerun';
import { useTRPipelineRuns } from '../../../hooks/useTektonResults';
import { routerRenderer } from '../../../utils/test-utils';
import { componentCRMocks } from '../../ApplicationDetails/__data__/mock-data';
import { pipelineRunMock } from '../__data__/pipelineRunMocks';
import { BuildLogViewer } from '../BuildLogViewer';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});
jest.mock('../../../hooks/useTektonResults');

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;

describe('BuildLogViewer', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('should show empty box if pipelineRuns not found', () => {
    watchResourceMock.mockReturnValue([[], true]);
    routerRenderer(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });

  it('should show component name', () => {
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    routerRenderer(<BuildLogViewer component={componentCRMocks[0]} />);
    screen.getByText('basic-node-js');
  });

  it('should show pipeline run link', () => {
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    routerRenderer(<BuildLogViewer component={componentCRMocks[0]} />);
    const plrLink = screen.getByText('basic-node-js-7c8nd');
    expect(plrLink.getAttribute('href')).toBe(
      '/application-pipeline/workspaces//applications/purple-mermaid-app/pipelineruns/basic-node-js-7c8nd',
    );
  });

  it('should render PipelineRunLogs', () => {
    configure({ testIdAttribute: 'data-testid' });
    watchResourceMock.mockReturnValue([[pipelineRunMock], true]);
    routerRenderer(<BuildLogViewer component={componentCRMocks[0]} />);

    screen.getByTestId('logs-tasklist');
  });

  it('should show empty box if it is not a build pipelinerun', () => {
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

    routerRenderer(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('empty-message')).not.toBeNull();
    expect(screen.getByTestId('empty-message').innerHTML).toBe('No pipeline runs found');
  });

  it('should show loading box if pipelineRuns are being fetched', () => {
    watchResourceMock.mockReturnValue([[], false]);
    useTRPipelineRunsMock.mockReturnValue([[], false]);
    routerRenderer(<BuildLogViewer component={componentCRMocks[0]} />);
    expect(screen.getByTestId('loading-indicator')).not.toBeNull();
  });
});
