import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { useComponents } from '../../../hooks/useComponents';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { SecretFor } from '../../../types';
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

jest.mock('../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));

const useApplicationsMock = useApplications as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;

describe('SecretTypeSubForm', () => {
  beforeEach(() => {
    const initialValues = {
      SecretFor: SecretFor.Build,
      opaque: {
        keyValues: [{ key: '', value: '' }],
      },
    };
    useApplicationsMock.mockReturnValue([[], true]);
    useComponentsMock.mockReturnValue([[], true]);
    useEnvironmentsMock.mockReturnValue([[], true]);

    formikRenderer(<SecretTypeSubForm />, initialValues);
  });

  it('should render Secret type sub form and fields', () => {
    expect(screen.getByText('Secret for')).toBeVisible();
    expect(screen.getByText('Secret type')).toBeVisible();
    expect(screen.getByText('Secret name')).toBeVisible();
  });

  it('should render subforms correctly for specified targets', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Deployment' }));
    });
    waitFor(() => {
      expect(screen.getByRole('button', { name: 'Key/value secret' })).toBeDisabled();
      expect(screen.getByText('Key value sub form')).toBeVisible();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Build' }));
    });
    waitFor(() => {
      expect(screen.getByRole('button', { name: 'Key/value secret' })).toBeEnabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Key/value secret' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Image pull secret'));
    });
    expect(screen.getByText('Image pull sub form')).toBeVisible();
  });

  it('should render correct variant of name field', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Deployment' }));
    });
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Secret name' })).toBeVisible();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Build' }));
    });
    waitFor(() => {
      expect(screen.getByRole('button', { name: 'Secret name' })).toBeVisible();
      act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Secret name' }));
      });
      expect(screen.getByText('snyk-secret')).toBeVisible();
    });
  });

  it('should render target fields for Deployment secret', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Deployment' }));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Select application' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'All components' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'All environments' })).toBeVisible();
    });
  });
});
