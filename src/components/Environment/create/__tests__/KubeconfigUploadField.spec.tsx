import * as React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import '@testing-library/jest-dom';
import KubeconfigUploadField from '../KubeconfigUploadField';

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

describe('KubeconfigUploadField', () => {
  it('should accept valid kubeconfig file', async () => {
    formikRenderer(<KubeconfigUploadField name="kubeconfig" />, { kubeconfig: '' });
    await act(async () => {
      fireEvent.input(screen.getByLabelText('File upload'), {
        target: { value: mockKubeconfig },
      });
    });
    expect(screen.getByText('Contents verified. Everything looks good.')).toBeVisible();
  });

  it('should reset field when cleared', async () => {
    formikRenderer(<KubeconfigUploadField name="kubeconfig" />, { kubeconfig: '' });
    await act(async () => {
      fireEvent.input(screen.getByLabelText('File upload'), {
        target: { value: mockKubeconfig },
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Clear'));
    });
    expect(screen.getByLabelText('File upload')).toBeEmptyDOMElement();
  });
});
