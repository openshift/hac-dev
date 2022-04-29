import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { useApplicationRoutes } from '../../../hooks/useApplicationRoutes';
import { componentCRMocks } from '../__data__/mock-data';
import ComponentListView from '../ComponentListView';

jest.mock('../../../hooks/useApplicationRoutes', () => ({
  useApplicationRoutes: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const applicationRoutesMock = useApplicationRoutes as jest.Mock;

describe('ComponentListViewPage', () => {
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
});
