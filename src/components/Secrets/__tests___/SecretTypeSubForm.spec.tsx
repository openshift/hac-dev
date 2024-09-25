import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { useComponents } from '../../../hooks/useComponents';
import { SecretFor, SecretTypeDropdownLabel } from '../../../types';
import { formikRenderer } from '../../../utils/test-utils';
import { SecretTypeSubForm } from '../SecretsForm/SecretTypeSubForm';

jest.mock('../SecretsForm/ImagePullSecretForm', () => ({
  ImagePullSecretForm: () => 'Image pull sub form',
}));
jest.mock('../SecretsForm/KeyValueSecretForm', () => ({
  KeyValueSecretForm: () => 'Key value sub form',
}));
jest.mock('../SecretsForm/SourceSecretForm', () => ({
  SourceSecretForm: () => 'Source secret sub form',
}));

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

const useApplicationsMock = useApplications as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;

describe('SecretTypeSubForm', () => {
  beforeEach(() => {
    const initialValues = {
      secretFor: SecretFor.Build,
      type: SecretTypeDropdownLabel.opaque,
      opaque: {
        keyValues: [{ key: '', value: '' }],
      },
    };
    useApplicationsMock.mockReturnValue([[], true]);
    useComponentsMock.mockReturnValue([[], true]);

    formikRenderer(<SecretTypeSubForm />, initialValues);
  });

  it('should render Secret type sub form and fields', () => {
    expect(screen.getByText('Secret type')).toBeVisible();
    expect(screen.getByText('Select or enter secret name')).toBeVisible();
  });

  it('should render subforms correctly for specified targets', async () => {
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Key/value secret' })).toBeEnabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Key/value secret' }));
    await fireEvent.click(screen.getByText('Image pull secret'));
    expect(screen.getByText('Image pull sub form')).toBeVisible();
  });

  it('should render correct variant of name field', async () => {
    await waitFor(async () => {
      expect(screen.getByRole('button', { name: 'Select or enter secret name' })).toBeVisible();
      await fireEvent.click(screen.getByRole('button', { name: 'Select or enter secret name' }));
      expect(screen.getByText('snyk-secret')).toBeVisible();
    });
  });
});
