import * as React from 'react';
import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EnvironmentModel } from '../../../../models';
import CreateEnvironment from '../CreateEnvironment';
import '@testing-library/jest-dom';

jest.mock('../../../../hooks/useEnvironments', () => ({
  useEnvironments: () => [
    {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'Environment',
      metadata: { name: 'env-1' },
      spec: { displayName: 'Mock Environment 1' },
    },
  ],
}));

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

jest.mock('../../../../shared/hooks/useScrollContainer', () => ({
  useScrollContainer: jest.fn().mockReturnValue([null, jest.fn()]),
}));

jest.mock('../../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));
jest.mock('@openshift/dynamic-plugin-sdk-utils');

const mockK8sCreate = k8sCreateResource as jest.Mock;

describe('CreateEnvironment', () => {
  const fillEnvironmentForm = () => {
    fireEvent.input(screen.getByLabelText('Environment Name'), { target: { value: 'Env 1' } });
    const typeDropdownToggle = screen.getByText('Select type...');
    fireEvent.click(typeDropdownToggle);
    const typeDropdownOption = screen.getByText('POC');
    fireEvent.click(typeDropdownOption);
  };

  it('should render Create environment form', () => {
    render(<CreateEnvironment />);
    screen.getAllByText('Create environment', { selector: 'h1' });
    screen.getByText('Define environment');
    screen.getByText('Select compute');
  });

  it('submit button should be disabled untill all the required fields are filled', () => {
    render(<CreateEnvironment />);
    const submitButton = screen.getByRole('button', { name: 'Create environment' });
    expect(submitButton).toBeDisabled();
    fillEnvironmentForm();
    expect(submitButton).toBeEnabled();
  });

  it('should have Automatic selected by default', () => {
    render(<CreateEnvironment />);
    const strategy = screen.getByText('Automatic');
    fireEvent.click(strategy);
    screen.getByText('Manual');
  });

  it('should call K8sCreateResource with args', async () => {
    render(<CreateEnvironment />);
    fillEnvironmentForm();
    const submitButton = screen.getByRole('button', { name: 'Create environment' });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(mockK8sCreate).toHaveBeenCalledWith({
        model: EnvironmentModel,
        resource: {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Environment',
          metadata: {
            name: 'env-1',
            namespace: '',
          },
          spec: {
            deploymentStrategy: 'AppStudioAutomated',
            displayName: 'Env 1',
            parentEnvironment: undefined,
            type: 'poc',
          },
        },
      }),
    );
  });

  it('should call navigate once the create resource request is completed', async () => {
    mockK8sCreate.mockResolvedValue({});
    render(<CreateEnvironment />);
    fillEnvironmentForm();
    const submitButton = screen.getByRole('button', { name: 'Create environment' });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/app-studio/workspace-settings'),
    );
  });

  it('should call navigate on form cancel', () => {
    render(<CreateEnvironment />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(navigateMock).toHaveBeenCalledWith('/app-studio/workspace-settings');
  });
});
