import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import { mockRoutes } from '../../../hooks/__data__/mock-data';
import { useApplicationHealthStatus } from '../../../hooks/useApplicationHealthStatus';
import { useApplicationRoutes } from '../../../hooks/useApplicationRoutes';
import { useSortedComponents } from '../../../hooks/useComponents';
import { useLatestApplicationRouteURL } from '../../../hooks/useLatestApplicationRouteURL';
import { ApplicationKind } from '../../../types';
import { getComponentRouteWebURL } from '../../../utils/route-utils';
import { ApplicationHeader } from '../ApplicationHeader';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test-id' });

jest.mock('../../../hooks/useComponents', () => {
  return {
    useSortedComponents: jest.fn(),
  };
});

jest.mock('../../../hooks/useApplicationRoutes', () => ({
  useApplicationRoutes: jest.fn(),
}));
jest.mock('../../../hooks/useApplicationHealthStatus', () => ({
  useApplicationHealthStatus: jest.fn(),
}));
jest.mock('../../../hooks/useLatestApplicationRouteURL', () => ({
  useLatestApplicationRouteURL: jest.fn(),
}));

const sortedComponentMocks = useSortedComponents as jest.Mock;
const applicationRoutesMock = useApplicationRoutes as jest.Mock;
const applicationHealthSTatusMock = useApplicationHealthStatus as jest.Mock;
const latesAppRouteMock = useLatestApplicationRouteURL as jest.Mock;

describe('ApplicationHeader', () => {
  it('should render Application header', () => {
    sortedComponentMocks.mockReturnValue([{ metadata: { name: 'test-component' } }, false]);
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    applicationHealthSTatusMock.mockReturnValue([{ status: 'Succeded' }, true]);
    render(
      <ApplicationHeader
        application={
          {
            metadata: { name: 'application-1', annotations: {} },
            spec: { displayName: 'Application 1' },
          } as ApplicationKind
        }
      />,
    );
    expect(screen.getByText('Application 1')).toBeInTheDocument();
  });

  it('should show application health status and thumbnail in the header', () => {
    sortedComponentMocks.mockReturnValue([[{ metadata: { name: 'test-component' } }], false]);
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    applicationHealthSTatusMock.mockReturnValue([{ status: 'Succeded' }, true]);
    render(
      <ApplicationHeader
        application={
          {
            metadata: { name: 'application-1', annotations: {} },
            spec: { displayName: 'Application 1' },
          } as ApplicationKind
        }
      />,
    );
    expect(screen.getByText('Succeded')).toBeInTheDocument();
    expect(screen.getByAltText('Application thumbnail')).toBeInTheDocument();
    expect(
      screen.queryByText(`${getComponentRouteWebURL(mockRoutes, 'basic-node-js').slice(0, 40)}...`),
    ).not.toBeInTheDocument();
  });

  it('should show ExternalLink in the application if it is available', () => {
    sortedComponentMocks.mockReturnValueOnce([[{ metadata: { name: 'basic-node-js' } }], true]);
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    applicationHealthSTatusMock.mockReturnValue([{ status: 'Succeded' }, true]);
    latesAppRouteMock.mockReturnValue(getComponentRouteWebURL(mockRoutes, 'basic-node-js'));
    render(
      <ApplicationHeader
        application={
          {
            metadata: { name: 'application-1', annotations: {} },
            spec: { displayName: 'Application 1' },
          } as ApplicationKind
        }
      />,
    );
    expect(screen.getByTestId('component-route-link')).toBeInTheDocument();
  });

  it('should show truncated URL with middle truncate', async () => {
    sortedComponentMocks.mockReturnValueOnce([[{ metadata: { name: 'basic-node-js' } }], true]);
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    applicationHealthSTatusMock.mockReturnValue([{ status: 'Succeded' }, true]);
    render(
      <ApplicationHeader
        application={
          {
            metadata: { name: 'application-1', annotations: {} },
            spec: { displayName: 'Application 1' },
          } as ApplicationKind
        }
      />,
    );
    expect(screen.getByTestId('component-route-link')).toBeInTheDocument();
    expect(screen.getByText('https://nodejs-test.apps.appstudio-s')).toBeInTheDocument(); // truncated first half
    expect(screen.getByText('tage.x99m.p1.openshiftapps.com')).toBeInTheDocument(); // truncated second half
  });
});
