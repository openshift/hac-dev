import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useLatestPipelineRunForComponent } from '../../../hooks/usePipelineRunsForApplication';
import { componentCRMocks } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import { ComponentListItem } from '../ComponentListItem';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-testId' });

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
    render(<ComponentListItem component={component} routes={[]} />);
    await waitFor(() => expect(screen.queryByText('Component Created')).not.toBeInTheDocument());
  });
});
