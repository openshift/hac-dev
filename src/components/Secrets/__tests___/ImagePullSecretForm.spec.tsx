import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../utils/test-utils';
import { ImagePullSecretForm } from '../SecretsForm/ImagePullSecretForm';

const initialValues = {
  imageAuthType: 'Image registry credentials',
};

describe('ImagePullSecretForm', () => {
  it('should show correct fields based on selected auth type', async () => {
    formikRenderer(<ImagePullSecretForm />, initialValues);
    expect(screen.getByText('Authentication type')).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Image registry credentials' }));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Upload configuration file'));
    });

    expect(screen.getByText('Upload a .dockercfg or .docker/config.json file')).toBeVisible();
  });
});
