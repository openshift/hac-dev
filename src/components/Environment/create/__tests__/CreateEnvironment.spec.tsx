import * as React from 'react';
import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EnvironmentModel, SecretModel } from '../../../../models';
import CreateEnvironment from '../CreateEnvironment';
import '@testing-library/jest-dom';

jest.mock('../../../../hooks/useEnvironments', () => ({
  useSortedEnvironments: () => [
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

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils');

const mockK8sCreate = k8sCreateResource as jest.Mock;

const mockKubeconfig = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: NTg5d3BLVmNCRnQo=
    server: https://api.example.com:6443
  name: ci-ln-d1l5dtt-72292
contexts:
- context:
    cluster: ci-ln-d1l5dtt-72292
    user: admin
  name: admin
current-context: admin
kind: Config
preferences: {}
users:
- name: admin
  user:
    client-certificate-data: 6Q0FJczNIUG9OKzQo=
    client-key-data: GTmRHbEptLQo=
`;

describe('CreateEnvironment', () => {
  const fillEnvironmentForm = () => {
    fireEvent.input(screen.getByLabelText('Environment Name'), { target: { value: 'Env 1' } });

    fireEvent.click(screen.getAllByRole('button', { name: 'Select' })[0]);
    fireEvent.click(screen.getByText('I would like to bring my own cluster'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Select' })[0]);
    fireEvent.click(screen.getByText('OpenShift'));

    fireEvent.input(screen.getByLabelText('File upload'), {
      target: { value: mockKubeconfig },
    });

    fireEvent.input(screen.getByLabelText('Target namespace on the selected cluster'), {
      target: { value: 'test-ns' },
    });
  };

  it('should render Create environment form', () => {
    render(<CreateEnvironment />);
    expect(screen.getByText('Create environment', { selector: 'h1' })).toBeVisible();
    expect(screen.getByText('Cluster information')).toBeVisible();
  });

  it('submit button should be disabled untill all the required fields are filled', () => {
    render(<CreateEnvironment />);
    const submitButton = screen.getByRole('button', { name: 'Create environment' });
    expect(submitButton).toBeDisabled();
    fillEnvironmentForm();
    expect(submitButton).toBeEnabled();
  });

  it('should have strategy field disabled with Automatic selected by default', () => {
    render(<CreateEnvironment />);
    const strategy = screen.getByRole('button', { name: 'Automatic' });
    expect(strategy).toBeVisible();
    expect(strategy).toBeDisabled();
  });

  it('should create secret and Environment', async () => {
    render(<CreateEnvironment />);
    fillEnvironmentForm();
    const submitButton = screen.getByRole('button', { name: 'Create environment' });
    expect(submitButton).toBeEnabled();
    mockK8sCreate.mockResolvedValue({ metadata: { name: 'cluster-cred-secret' } });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(mockK8sCreate).toHaveBeenCalledWith({
        model: SecretModel,
        resource: {
          apiVersion: 'v1',
          kind: 'Secret',
          type: 'managed-gitops.redhat.com/managed-environment',
          metadata: {
            generateName: 'env-cluster-credentials-',
            namespace: 'test-ns',
          },
          stringData: {
            kubeconfig: mockKubeconfig,
          },
        },
      }),
    );
    await waitFor(() =>
      expect(mockK8sCreate).toHaveBeenCalledWith({
        model: EnvironmentModel,
        resource: {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Environment',
          metadata: {
            name: 'env-1',
            namespace: 'test-ns',
          },
          spec: {
            deploymentStrategy: 'AppStudioAutomated',
            displayName: 'Env 1',
            tags: ['managed'],
            unstableConfigurationFields: {
              clusterType: 'OpenShift',
              kubernetesCredentials: {
                allowInsecureSkipTLSVerify: true,
                apiURL: 'https://api.example.com:6443',
                clusterCredentialsSecret: 'cluster-cred-secret',
                targetNamespace: 'test-ns',
              },
            },
          },
        },
      }),
    );
  });

  it('should call navigate once the create resource request is completed', async () => {
    render(<CreateEnvironment />);
    fillEnvironmentForm();
    mockK8sCreate.mockResolvedValue({ metadata: { name: 'cluster-cred-secret' } });
    const submitButton = screen.getByRole('button', { name: 'Create environment' });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/stonesoup/environments/workspaces/test-ws'),
    );
  });

  it('should call navigate on form cancel', () => {
    render(<CreateEnvironment />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(navigateMock).toHaveBeenCalledWith('/stonesoup/environments/workspaces/test-ws');
  });
});
