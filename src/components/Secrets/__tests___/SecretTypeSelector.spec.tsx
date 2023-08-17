import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { SecretTypeDropdownLabel } from '../../../types';
import { formikRenderer } from '../../../utils/test-utils';
import { SecretModalValues } from '../SecretModal';
import SecretTypeSelector from '../SecretTypeSelector';

const initialValues: SecretModalValues = {
  secretName: '',
  type: SecretTypeDropdownLabel.opaque,
  keyValues: [{ key: '', value: '', readOnlyKey: false }],
  existingSecrets: [],
};

describe('SecretForm', () => {
  it('should render Secret type dropdown and should default to opaque secret', async () => {
    const onChange = jest.fn();
    formikRenderer(<SecretTypeSelector onChange={onChange} />, initialValues);

    screen.getByText('Secret type');
    screen.getByText('Opaque secret');
  });

  it('should call onChange handler with selected value', async () => {
    const onChange = jest.fn();
    formikRenderer(<SecretTypeSelector onChange={onChange} />, initialValues);

    const dropdown = screen.getByRole('button', { name: 'Opaque secret' });

    act(() => {
      fireEvent.click(dropdown);
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Image pull secret'));
    });

    expect(onChange).toHaveBeenCalledWith('Image pull secret');
  });
});
