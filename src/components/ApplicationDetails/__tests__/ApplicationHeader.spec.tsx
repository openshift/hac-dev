import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import { mockRoutes } from '../../../hooks/__data__/mock-data';
import { useApplicationHealthStatus } from '../../../hooks/useApplicationHealthStatus';
import { useApplicationRoutes } from '../../../hooks/useApplicationRoutes';
import { useSortedComponents } from '../../../hooks/useComponents';
import { ApplicationKind } from '../../../types';
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
    expect(screen.getByAltText('Application thumbnail')).toBeInTheDocument();
  });
});
