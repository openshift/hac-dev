import * as React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useEnvironments } from '../../../../hooks/useEnvironments';
import { EnvironmentKind } from '../../../../types';
import { formikRenderer } from '../../../../utils/test-utils';
import { ParentEnvironmentField } from '../ParentEnvironmentField';
import '@testing-library/jest-dom';

jest.mock('../../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));

const mockEnvironmentsWatch = useEnvironments as jest.Mock;

describe('ParentEnvironmentField', () => {
  const renderParentEnvironmentField = () => {
    formikRenderer(<ParentEnvironmentField />);
  };

  const mockEnvironments: EnvironmentKind[] = [
    {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'environment',
      metadata: { name: 'env-1' },
      spec: { displayName: 'Mock Environment 1' },
    },
    {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'environment',
      metadata: { name: 'env-2' },
      spec: { displayName: 'Mock Environment 2' },
    },
  ];

  it('should render dropdown field', () => {
    mockEnvironmentsWatch.mockReturnValueOnce([mockEnvironments, true]);
    renderParentEnvironmentField();
    screen.getByText('Parent Environment');
    screen.getByText('Select environment...');
  });

  it('should render dropdown option on button click', () => {
    mockEnvironmentsWatch.mockReturnValueOnce([mockEnvironments, true]);
    renderParentEnvironmentField();
    screen.getByText('Parent Environment');
    const button = screen.getByText('Select environment...');
    fireEvent.click(button);
    screen.getByText('Mock Environment 1');
    screen.getByText('Mock Environment 2');
  });

  it('should render null incase environments are not available', () => {
    mockEnvironmentsWatch.mockReturnValueOnce([[], true]);
    renderParentEnvironmentField();
    expect(screen.queryByText('Parent Environment')).not.toBeInTheDocument();
    expect(screen.queryByText('Select environment...')).not.toBeInTheDocument();
  });
});
