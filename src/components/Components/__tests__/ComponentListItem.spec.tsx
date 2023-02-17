import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import '@testing-library/jest-dom';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockRoutes } from '../../../hooks/__data__/mock-data';
import { useLatestPipelineRunForComponent } from '../../../hooks/usePipelineRunsForApplication';
import { componentCRMocks } from '../../ApplicationDetails/__data__/mock-data';
import { mockPipelineRuns } from '../../ApplicationDetails/__data__/mock-pipeline-run';
import { ComponentListItem } from '../ComponentListItem';

configure({ testIdAttribute: 'data-testid' });

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunForComponent: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('ComponentListItem', () => {
  const mockLatestPipelineRunForComponent = useLatestPipelineRunForComponent as jest.Mock;

  beforeEach(() => {
    mockLatestPipelineRunForComponent.mockReturnValue(mockPipelineRuns[0]);
    useK8sWatchResourceMock.mockReturnValue([[mockPipelineRuns[2]], true]);
  });

  it('should render display name of the component', () => {
    render(<ComponentListItem component={componentCRMocks[0]} routes={[]} />);
    screen.getByText('basic-node-js');
  });

  it('should render git repository link of the component', () => {
    render(<ComponentListItem component={componentCRMocks[0]} routes={[]} />);
    screen.getByText('Git repository');
    expect(screen.queryByText('Route')).not.toBeInTheDocument();
  });

  it('should render component URL link of the component if route exists', () => {
    render(<ComponentListItem component={componentCRMocks[0]} routes={mockRoutes} />);
    screen.getAllByText('Route');
  });

  it('should render View Build logs action item', async () => {
    render(
      <BrowserRouter>
        <ComponentListItem component={componentCRMocks[0]} routes={[]} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Build Succeeded'));
    await waitFor(() => screen.getByText('View logs'));
  });

  it('should render View Build logs action item', async () => {
    mockLatestPipelineRunForComponent.mockReturnValue(mockPipelineRuns[1]);
    render(
      <BrowserRouter>
        <ComponentListItem component={componentCRMocks[0]} routes={[]} />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('Build Failed'));
    await waitFor(() => screen.getByText('View logs'));
  });

  it('should render Delete action item', async () => {
    render(
      <BrowserRouter>
        <ComponentListItem component={componentCRMocks[0]} routes={[]} />
      </BrowserRouter>,
    );
    const kebabButton = screen.getByTestId('kebab-button');
    fireEvent.click(kebabButton);
    await waitFor(() => screen.getByText('Delete component'));
  });

  it('should render Component settings action item', async () => {
    render(
      <BrowserRouter>
        <ComponentListItem component={componentCRMocks[0]} routes={[]} />
      </BrowserRouter>,
    );
    const kebabButton = screen.getByTestId('kebab-button');
    fireEvent.click(kebabButton);
    await waitFor(() => screen.getByText('Edit component settings'));
  });

  it('should not render Success component condition status on UI', async () => {
    const component = componentCRMocks[0];
    component.status.conditions = [];
    render(<ComponentListItem component={component} routes={[]} />);
    await waitFor(() => expect(screen.queryByText('Component Created')).not.toBeInTheDocument());
  });

  it('should not render Built container image if the containerImage is missing in component status', async () => {
    const component = { ...componentCRMocks[0], status: undefined };
    render(<ComponentListItem component={component} routes={[]} />);
    await waitFor(() =>
      expect(screen.queryByText('Built container image')).not.toBeInTheDocument(),
    );
  });

  it('should render Built container image if the component status contains the containerImage field', async () => {
    const component = componentCRMocks[0];
    render(<ComponentListItem component={component} routes={[]} />);
    await waitFor(() => expect(screen.queryByText('Built container image')).toBeInTheDocument());
  });
});
