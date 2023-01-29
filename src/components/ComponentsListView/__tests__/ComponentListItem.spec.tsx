import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockRoutes } from '../../../hooks/__data__/mock-data';
import { useLatestPipelineRunForComponent } from '../../../hooks/usePipelineRunsForApplication';
import { componentCRMocks } from '../../ApplicationDetailsView/__data__/mock-data';
import { mockPipelineRuns } from '../../ApplicationDetailsView/__data__/mock-pipeline-run';
import BuildStatusColumn from '../BuildStatusColumn';
import { ComponentListItem } from '../ComponentListItem';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
}));

configure({ testIdAttribute: 'data-testid' });

jest.mock('../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunForComponent: jest.fn(),
}));

describe('ComponentListItem', () => {
  const mockLatestPipelineRunForcomponent = useLatestPipelineRunForComponent as jest.Mock;

  beforeEach(() => {
    mockLatestPipelineRunForcomponent.mockReturnValue(mockPipelineRuns[0]);
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
    mockLatestPipelineRunForcomponent.mockReturnValue(mockPipelineRuns[1]);
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
    await waitFor(() => screen.getByText('Delete'));
  });

  it('should render Component settings action item', async () => {
    render(
      <BrowserRouter>
        <ComponentListItem component={componentCRMocks[0]} routes={[]} />
      </BrowserRouter>,
    );
    const kebabButton = screen.getByTestId('kebab-button');
    fireEvent.click(kebabButton);
    await waitFor(() => screen.getByText('Component settings'));
  });

  it('should not render Success component condition status on UI', async () => {
    const component = componentCRMocks[0];
    component.status.conditions = [];
    render(
      <ComponentListItem
        component={component}
        routes={[]}
        BuildStatusComponent={BuildStatusColumn}
      />,
    );
    await waitFor(() => expect(screen.queryByText('Component Created')).not.toBeInTheDocument());
  });
});
