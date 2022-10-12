import * as React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useSortedEnvironments } from '../../../../hooks/useEnvironments';
import { EnvironmentKind } from '../../../../types';
import { formikRenderer } from '../../../../utils/test-utils';
import { ParentEnvironmentField } from '../ParentEnvironmentField';
import '@testing-library/jest-dom';

jest.mock('../../../../hooks/useEnvironments', () => ({
  useSortedEnvironments: jest.fn(),
}));

const mockEnvironmentsWatch = useSortedEnvironments as jest.Mock;

describe('ParentEnvironmentField', () => {
  const renderParentEnvironmentField = () => {
    formikRenderer(<ParentEnvironmentField />);
  };

  const mockEnvironments: EnvironmentKind[] = [
    {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'environment',
      metadata: { name: 'env-1' },
      spec: { displayName: 'Mock Environment 1', deploymentStrategy: 'Manual', type: 'poc' },
    },
    {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'environment',
      metadata: { name: 'env-2' },
      spec: {
        displayName: 'Mock Environment 2',
        deploymentStrategy: 'Manual',
        type: 'non-poc',
        parentEnvironment: 'env-1',
      },
    },
  ];

  it('should render dropdown field', () => {
    mockEnvironmentsWatch.mockReturnValueOnce([mockEnvironments, true]);
    renderParentEnvironmentField();
    screen.getByText('Order in continuous delivery');
    screen.getByText('Select order');
  });

  it('should render dropdown option on button click', () => {
    mockEnvironmentsWatch.mockReturnValueOnce([mockEnvironments, true]);
    renderParentEnvironmentField();
    screen.getByText('Order in continuous delivery');
    const button = screen.getByText('Select order');
    fireEvent.click(button);
    screen.getByText('#2 Mock Environment 1 \u2192 [new] \u2192 Mock Environment 2');
    screen.getByText('#3 Mock Environment 1 \u2192 Mock Environment 2 \u2192 [new]');
  });

  it('should render null incase environments are not available', () => {
    mockEnvironmentsWatch.mockReturnValueOnce([[], true]);
    renderParentEnvironmentField();
    expect(screen.queryByText('Order in continuous delivery')).not.toBeInTheDocument();
    expect(screen.queryByText('Select order')).not.toBeInTheDocument();
  });
});
