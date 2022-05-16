import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { componentCRMocks, mockApplication } from '../__data__/mock-data';
import ApplicationDetailsView from '../ApplicationDetailsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../hooks/useQuickstartCloseOnUnmount', () => ({
  useQuickstartCloseOnUnmount: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn() } }),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('ApplicationDetailsView', () => {
  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getByRole('progressbar');
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValueOnce([[], false]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getAllByText('Test Application');
  });

  it('should render spinner if components data is not loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValueOnce([[], false]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no components available for an application', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValueOnce([[], true]);
    render(<ApplicationDetailsView applicationName="test-application" />);
    screen.getByText('No components');
    screen.getByText('To get started, add a component to your application.');
    const button = screen.getByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe(
      'http://localhost/app-studio/import?application=test-application',
    );
  });

  it('should render filter toolbar and filter components based on name', () => {
    watchResourceMock
      .mockReturnValueOnce([mockApplication, true])
      .mockReturnValue([componentCRMocks, true]);
    render(<ApplicationDetailsView applicationName="test-application" />);
    expect(screen.getByTestId('component-list-toolbar')).toBeInTheDocument();
    const searchInput = screen.getByTestId('name-input-filter');
    fireEvent.change(searchInput, { target: { value: 'nodejs' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(1);
  });
});
