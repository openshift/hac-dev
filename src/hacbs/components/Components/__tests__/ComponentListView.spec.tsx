import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { mockRoutes } from '../../../../hooks/__data__/mock-data';
import { useApplicationRoutes } from '../../../../hooks/useApplicationRoutes';
import { useGitOpsDeploymentCR } from '../../../../hooks/useGitOpsDeploymentCR';
import { ComponentGroupVersionKind } from '../../../../models';
import { PipelineRunGroupVersionKind } from '../../../../shared';
import { componentCRMocks } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import ComponentListView from '../ComponentListView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../hooks/useApplicationRoutes', () => ({
  useApplicationRoutes: jest.fn(),
}));

jest.mock('../../../../hooks/useGitOpsDeploymentCR', () => ({
  useGitOpsDeploymentCR: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  useSearchParams: () => {
    const [params, setParams] = React.useState(() => new URLSearchParams());
    const setParamsCb = React.useCallback((newParams: URLSearchParams) => {
      setParams(newParams);
      window.location.search = `?${newParams.toString()}`;
    }, []);
    return [params, setParamsCb];
  },
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunForComponent: () => mockPipelineRuns[0],
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const applicationRoutesMock = useApplicationRoutes as jest.Mock;
const gitOpsDeploymentMock = useGitOpsDeploymentCR as jest.Mock;

const getMockedResources = (kind: WatchK8sResource) => {
  if (kind.groupVersionKind === ComponentGroupVersionKind) {
    return [componentCRMocks, true];
  }
  if (kind.groupVersionKind === PipelineRunGroupVersionKind) {
    return [mockPipelineRuns, true];
  }
  return [[], true];
};

describe('ComponentListViewPage', () => {
  beforeAll(() => {
    gitOpsDeploymentMock.mockReturnValue([[], false]);
  });

  it('should render spinner if routes are not loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    applicationRoutesMock.mockReturnValue([[], false]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByRole('progressbar');
  });

  it('should render button to add components', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    applicationRoutesMock.mockReturnValue([[], true]);
    render(<ComponentListView applicationName="test-app" components={componentCRMocks} />);
    const button = screen.getByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe(
      'http://localhost/app-studio/import?application=test-app',
    );
  });

  it('should render filter toolbar and filter components based on name', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    applicationRoutesMock.mockReturnValue([[], true]);
    render(<ComponentListView applicationName="test-app" components={componentCRMocks} />);
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    const searchInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(searchInput, { target: { value: 'nodejs' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(1);
  });

  it('should render routes URL when route is created on cluster', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByText('https://nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com');
  });

  it('should render spinner in toolbar if gitOpsDeploymentCR is not loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([[], false]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByRole('progressbar');
  });

  it('should render Application health status if gitOpsDeployment CR is loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([{ status: { health: { status: 'Degraded' } } }, true]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByText('Application Degraded');
  });

  it('should render deployment strategy if gitOpsDeployment CR is loaded', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([
      { spec: { type: 'automated' }, status: { health: { status: 'Degraded' } } },
      true,
    ]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByText('Automated');
  });
  it('should show a warning when showMergeStatus is set', () => {
    useK8sWatchResourceMock.mockImplementation(getMockedResources);
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([
      { spec: { type: 'automated' }, status: { health: { status: 'Degraded' } } },
      true,
    ]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByTestId('components-unmerged-build-pr');
  });
  it('should filter components by type', async () => {
    useK8sWatchResourceMock.mockImplementation(getMockedResources);
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([
      { spec: { type: 'automated' }, status: { health: { status: 'Degraded' } } },
      true,
    ]);
    const view = render(<ComponentListView applicationName="test" components={componentCRMocks} />);

    expect(view.getAllByTestId('component-list-item')).toHaveLength(2);

    // interact with filters
    const filterMenuButton = view.getByRole('button', { name: /filter/i });
    fireEvent.click(filterMenuButton);

    const successCb = view.getByLabelText(/successful/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(successCb);
    expect(successCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(1);
    fireEvent.click(successCb);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);

    const failedCb = view.getByLabelText(/failed/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(failedCb);
    expect(failedCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(0);
    fireEvent.click(failedCb);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);

    const buildingCb = view.getByLabelText(/Building/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(buildingCb);
    expect(buildingCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(0);
    fireEvent.click(buildingCb);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);

    const needsMergeCb = view.getByLabelText(/Merge/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(needsMergeCb);
    expect(needsMergeCb.checked).toBe(true);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(1);

    // clear the filter
    const clearFilterButton = view.getAllByRole('button', { name: 'Clear filters' })[1];
    fireEvent.click(clearFilterButton);
    expect(view.queryAllByTestId('component-list-item')).toHaveLength(2);
  });
  it('should clear filters from empty state', () => {
    useK8sWatchResourceMock.mockImplementation(getMockedResources);
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([
      { spec: { type: 'automated' }, status: { health: { status: 'Degraded' } } },
      true,
    ]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    expect(screen.getAllByTestId('component-list-item')).toHaveLength(2);

    const textFilterInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(textFilterInput, { target: { value: 'no match' } });

    expect(screen.queryAllByTestId('component-list-item')).toHaveLength(0);

    const clearFilterButton = screen.getByRole('button', { name: 'Clear all filters' });
    fireEvent.click(clearFilterButton);
    expect(screen.getAllByTestId('component-list-item')).toHaveLength(2);
  });
});
