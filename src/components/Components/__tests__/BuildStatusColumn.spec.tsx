import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen, waitFor } from '@testing-library/react';
import { componentCRMocks } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import BuildStatusColumn from '../BuildStatusColumn';

configure({ testIdAttribute: 'data-testId' });

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('BuildStatusColumn', () => {
  it('should render View Build logs action item', async () => {
    useK8sWatchResourceMock.mockReturnValue([mockPipelineRuns, true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[0]} allComponents={componentCRMocks} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Build Succeeded'));
    await waitFor(() => screen.getByText('View logs'));
  });
  it('should render failures', async () => {
    useK8sWatchResourceMock.mockReturnValue([[mockPipelineRuns[2]], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[1]} allComponents={componentCRMocks} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Build Failed'));
    await waitFor(() => screen.getByText('View logs'));
  });

  it('should not render merge status if the pipelineruns is still loading', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[1]} allComponents={componentCRMocks} />
      </BrowserRouter>,
    );
    expect(screen.queryByText('Merge build PR')).not.toBeInTheDocument();
  });

  it('should render needs merge status', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[1]} allComponents={componentCRMocks} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Merge build PR'));
  });

  it('should not render View Build logs action item for components without build pipelinerun', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[0]} allComponents={componentCRMocks} />
      </BrowserRouter>,
    );
    expect(screen.queryByText('View logs')).not.toBeInTheDocument();
  });

  it('should render View Build logs action item for components without PAC annotation', async () => {
    useK8sWatchResourceMock.mockReturnValue([[mockPipelineRuns], true]);
    render(
      <BrowserRouter>
        <BuildStatusColumn component={componentCRMocks[0]} allComponents={componentCRMocks} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('View logs'));
  });
});
