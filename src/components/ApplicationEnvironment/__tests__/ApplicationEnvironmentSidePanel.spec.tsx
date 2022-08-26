import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { useApplicationRoutes } from '../../../hooks';
import { mockComponents } from '../__data__/mock-data';
import ApplicationEnvironmentSidePanel from '../ApplicationEnvironmentSidePanel';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

jest.mock('../../../hooks/useApplicationRoutes', () => ({
  useApplicationRoutes: jest.fn(),
}));

const applicationRoutesMock = useApplicationRoutes as jest.Mock;

describe('ApplicationEnvironmentSidePanel', () => {
  it('should render the component name in the title', () => {
    watchResourceMock.mockReturnValue([[], false]);
    applicationRoutesMock.mockReturnValue([[], true]);
    render(<ApplicationEnvironmentSidePanel component={mockComponents[0]} onClose={() => {}} />);
    screen.getAllByText(`${mockComponents[0].metadata.name}`);
  });
  it('should render a spinner while loading application routes', () => {
    watchResourceMock.mockReturnValue([[], false]);
    applicationRoutesMock.mockReturnValue([[], false]);
    render(<ApplicationEnvironmentSidePanel component={mockComponents[0]} onClose={() => {}} />);
    screen.getByRole('progressbar');
  });
});
