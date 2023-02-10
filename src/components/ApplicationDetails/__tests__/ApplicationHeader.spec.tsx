import * as React from 'react';
import { configure, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useApplicationHealthStatus, useApplicationRoutes } from '../../../hooks';
import { mockRoutes } from '../../../hooks/__data__/mock-data';
import { useSortedComponents } from '../../../hooks/useComponents';
import { ApplicationKind } from '../../../types';
import { getComponentRouteWebURL } from '../../../utils/route-utils';
import { ApplicationHeader } from '../ApplicationHeader';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-testid' });

jest.mock('../../../hooks/useComponents', () => {
  return {
    useSortedComponents: jest.fn(),
  };
});

jest.mock('../../../hooks', () => {
  const actual = jest.requireActual('../../../hooks');
  return {
    ...actual,
    useApplicationHealthStatus: jest.fn(),
    useApplicationRoutes: jest.fn(),
  };
});

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
    expect(screen.getByText('Succeded')).toBeInTheDocument();
    expect(screen.getByAltText('Application thumbnail')).toBeInTheDocument();
    expect(
      screen.queryByText(`${getComponentRouteWebURL(mockRoutes, 'basic-node-js').slice(0, 40)}...`),
    ).not.toBeInTheDocument();
  });

  it('should show route in the application if it is available', () => {
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
    expect(
      screen.queryByText(`${getComponentRouteWebURL(mockRoutes, 'basic-node-js').slice(0, 40)}...`),
    ).toBeInTheDocument();
  });

  it('should show tooltip on copy button if it is available', async () => {
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

    expect(
      screen.queryByText(`${getComponentRouteWebURL(mockRoutes, 'basic-node-js').slice(0, 40)}...`),
    ).toBeInTheDocument();

    const user = userEvent.setup();

    await waitFor(() => user.hover(screen.getByTestId('route-copy-icon')));

    await waitFor(() => expect(screen.getByText('Copy URL')).toBeInTheDocument());
  });
});
