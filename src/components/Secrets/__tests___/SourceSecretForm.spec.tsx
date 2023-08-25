import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../utils/test-utils';
import { SourceSecretForm } from '../SourceSecretForm';

const initialValues = {
  sourceAuthType: 'Basic authentication',
};

describe('SourceSecretForm', () => {
  it('should show correct fields based on selected auth type', async () => {
    formikRenderer(<SourceSecretForm />, initialValues);
    expect(screen.getByText('Authentication type')).toBeVisible();
    expect(screen.getByText('Username')).toBeVisible();
    expect(screen.getByText('Password')).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Basic authentication' }));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('SSH Key'));
    });

    expect(screen.getByText('SSH private key')).toBeVisible();
  });
});
