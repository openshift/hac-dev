import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { EnvConnectionStatus } from '../EnvConnectionStatus';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
}));

const useK8sWatchMock = useK8sWatchResource as jest.Mock;

describe('EnvConnectionStatus', () => {
  it('should render null if status is not found', () => {
    useK8sWatchMock.mockReturnValue([[], true]);
    const { container } = render(
      <EnvConnectionStatus
        environment={{ metadata: { name: 'test-env', namespace: 'my-ns' } } as any}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should show success message for true status', () => {
    useK8sWatchMock.mockReturnValue([
      [
        {
          metadata: { ownerReferences: [{ kind: 'Environment', name: 'test-env' }] },
          status: { conditions: [{ type: 'ConnectionInitializationSucceeded', status: 'True' }] },
        },
      ],
      true,
    ]);
    render(
      <EnvConnectionStatus
        environment={{ metadata: { name: 'test-env', namespace: 'my-ns' } } as any}
      />,
    );
    expect(screen.getByText('Connection successful')).toBeVisible();
  });

  it('should show error for false status', () => {
    useK8sWatchMock.mockReturnValue([
      [
        {
          metadata: { ownerReferences: [{ kind: 'Environment', name: 'test-env' }] },
          status: { conditions: [{ type: 'ConnectionInitializationSucceeded', status: 'False' }] },
        },
      ],
      true,
    ]);
    render(
      <EnvConnectionStatus
        environment={{ metadata: { name: 'test-env', namespace: 'my-ns' } } as any}
      />,
    );
    expect(screen.getByText('Connection error')).toBeVisible();
  });
});
