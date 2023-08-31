import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../utils/test-utils';
import { SecretTarget, SecretTypeSubForm } from '../SecretTypeSubForm';

jest.mock('../ImagePullSecretForm', () => ({ ImagePullSecretForm: () => 'Image pull sub form' }));
jest.mock('../KeyValueSecretForm', () => ({ KeyValueSecretForm: () => 'Key value sub form' }));
jest.mock('../SourceSecretForm', () => ({ SourceSecretForm: () => 'Source secret sub form' }));

describe('SecretTypeSubForm', () => {
  beforeEach(() => {
    const initialValues = {
      target: SecretTarget.Build,
    };
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
    expect(screen.getByRole('button', { name: 'Key/value secret' })).toBeDisabled();
    expect(screen.getByText('Key value sub form')).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Build' }));
    });
    expect(screen.getByText('Key/value secret')).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByText('Key/value secret'));
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
    expect(screen.getByRole('textbox', { name: 'Secret name' })).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Build' }));
    });
    expect(screen.getByRole('button', { name: 'Secret name' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Secret name' }));
    expect(screen.getByText('snyk-secret')).toBeVisible();
  });
});
