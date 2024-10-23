import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { SecretTypeDropdownLabel, SecretType } from '../../../types';
import { formikRenderer } from '../../../utils/test-utils';
import SecretModal, { SecretModalValues } from '../SecretModal';
import { supportedPartnerTasksSecrets } from '../utils/secret-utils';

const initialValues: SecretModalValues = {
  secretName: '',
  type: SecretTypeDropdownLabel.opaque,
  keyValues: [{ key: '', value: '', readOnlyKey: false }],
  existingSecrets: [],
};

const snykSecret = {
  type: SecretType.opaque,
  name: 'snyk-secret',
  tokenKeyName: 'snyk-secret',
  providerUrl: '',
  keyValuePairs: [{ key: 'snyk_token', value: 'snyk_value', readOnlyKey: true }],
};

const testSecret = {
  type: SecretType.opaque,
  name: 'test-secret',
  tokenKeyName: 'test-secret',
  providerUrl: '',
  keyValuePairs: [{ key: 'test_token', value: 'test_value', readOnlyKey: true }],
};

describe('SecretForm', () => {
  it('should show secret form in a modal', async () => {
    formikRenderer(
      <SecretModal
        existingSecrets={[testSecret]}
        onSubmit={jest.fn()}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
      initialValues,
    );

    await waitFor(() => {
      screen.getByTestId('build-secret-modal');
    });
  });

  it('should render validation message when user click on create button without filling the form', async () => {
    formikRenderer(
      <SecretModal
        existingSecrets={[testSecret]}
        onSubmit={jest.fn()}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
      initialValues,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Create/ }));
      expect(screen.getAllByText('Required')).toHaveLength(3);
    });
  });

  it('should call onClose callback when cancel button is clicked', async () => {
    const onClose = jest.fn();
    formikRenderer(
      <SecretModal
        onSubmit={jest.fn()}
        existingSecrets={[testSecret]}
        modalProps={{ isOpen: true, onClose }}
      />,
      initialValues,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('build-secret-modal')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('should show all the predefined tasks in the select dropdown', async () => {
    const onClose = jest.fn();
    formikRenderer(
      <SecretModal
        onSubmit={jest.fn()}
        existingSecrets={[testSecret]}
        modalProps={{ isOpen: true, onClose }}
      />,
      initialValues,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('build-secret-modal')).toBeInTheDocument();
      const modal = screen.queryByTestId('build-secret-modal');
      fireEvent.click(modal.querySelector('#secret-name-toggle-select-typeahead'));
    });

    await waitFor(() => {
      Object.values(supportedPartnerTasksSecrets).map((partnerSecret) => {
        expect(screen.getByText(partnerSecret.name));
      });
    });
  });

  it('should show the secrets in the select dropdown if it is already existing', async () => {
    const onClose = jest.fn();
    formikRenderer(
      <SecretModal
        onSubmit={jest.fn()}
        existingSecrets={[snykSecret]}
        modalProps={{ isOpen: true, onClose }}
      />,
      initialValues,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('build-secret-modal')).toBeInTheDocument();
      const modal = screen.queryByTestId('build-secret-modal');
      fireEvent.click(modal.querySelector('#secret-name-toggle-select-typeahead'));
    });
    expect(screen.queryByText('snyk-secret')).toBeInTheDocument();
  });

  it('should remove the selected value with clearn button is clicked', async () => {
    const onSubmit = jest.fn();
    formikRenderer(
      <SecretModal
        onSubmit={jest.fn()}
        existingSecrets={[]}
        modalProps={{ isOpen: true, onClose: onSubmit }}
      />,
      initialValues,
    );

    const secretModal = screen.queryByTestId('build-secret-modal');

    act(() => {
      expect(secretModal).toBeInTheDocument();
      fireEvent.click(secretModal.querySelector('#secret-name-toggle-select-typeahead'));
    });

    act(() => {
      fireEvent.click(screen.queryByText('snyk-secret'));
      expect(screen.queryByText('snyk-secret')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(secretModal.querySelector('.pf-v5-c-select__toggle-clear'));
      expect(screen.queryByText('snyk-secret')).not.toBeInTheDocument();
    });
  });

  it('should call onSubmit handler with newly added secret', async () => {
    const onSubmit = jest.fn();
    formikRenderer(
      <SecretModal
        onSubmit={jest.fn()}
        existingSecrets={[]}
        modalProps={{ isOpen: true, onClose: onSubmit }}
      />,
      initialValues,
    );

    act(() => {
      expect(screen.queryByTestId('build-secret-modal')).toBeInTheDocument();
      const modal = screen.queryByTestId('build-secret-modal');
      fireEvent.click(modal.querySelector('#secret-name-toggle-select-typeahead'));
    });

    act(() => {
      fireEvent.click(screen.queryByText('snyk-secret'));
      fireEvent.input(screen.getByTestId('file-upload-value').querySelector('textarea'), {
        target: { value: 'Value' },
      });
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Create/ }));
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
