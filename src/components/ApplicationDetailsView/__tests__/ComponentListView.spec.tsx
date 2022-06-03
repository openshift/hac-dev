import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { mockRoutes } from '../../../hooks/__data__/mock-data';
import { useApplicationRoutes } from '../../../hooks/useApplicationRoutes';
import { useGitOpsDeploymentCR } from '../../../hooks/useGitOpsDeploymentCR';
import { componentCRMocks } from '../__data__/mock-data';
import ComponentListView from '../ComponentListView';

jest.mock('../../../hooks/useApplicationRoutes', () => ({
  useApplicationRoutes: jest.fn(),
}));

jest.mock('../../../hooks/useGitOpsDeploymentCR', () => ({
  useGitOpsDeploymentCR: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const applicationRoutesMock = useApplicationRoutes as jest.Mock;
const gitOpsDeploymentMock = useGitOpsDeploymentCR as jest.Mock;

describe('ComponentListViewPage', () => {
  beforeAll(() => {
    gitOpsDeploymentMock.mockReturnValue([[], false]);
  });
  it('should render spinner if routes are not loaded', () => {
    applicationRoutesMock.mockReturnValue([[], false]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByRole('progressbar');
  });

  it('should render button to add components', () => {
    applicationRoutesMock.mockReturnValue([[], true]);
    render(<ComponentListView applicationName="test-app" components={componentCRMocks} />);
    const button = screen.getByText('Add Component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe(
      'http://localhost/app-studio/import?application=test-app',
    );
  });

  it('should render filter toolbar and filter components based on name', () => {
    applicationRoutesMock.mockReturnValue([[], true]);
    render(<ComponentListView applicationName="test-app" components={componentCRMocks} />);
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    const searchInput = screen.getByTestId('name-input-filter');
    fireEvent.change(searchInput, { target: { value: 'nodejs' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(1);
  });

  it('should render routes URL when route is created on cluster', () => {
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByText('https://nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com');
  });

  it('should render spinner in toolbar if gitOpsDeploymentCR is not loaded', () => {
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([[], false]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByRole('progressbar');
  });

  it('should render Application health status if gitOpsDeployment CR is loaded', () => {
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([{ status: { health: { status: 'Degraded' } } }, true]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByText('Application Degraded');
  });

  it('should render deployment strategy if gitOpsDeployment CR is loaded', () => {
    applicationRoutesMock.mockReturnValue([[], true]);
    gitOpsDeploymentMock.mockReturnValue([
      { spec: { type: 'automated' }, status: { health: { status: 'Degraded' } } },
      true,
    ]);
    render(<ComponentListView applicationName="test" components={componentCRMocks} />);
    screen.getByText('Automated');
  });
});
