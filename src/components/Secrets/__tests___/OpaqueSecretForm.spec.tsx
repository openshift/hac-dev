import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor, render } from '@testing-library/react';
import OpaqueSecretForm from '../OpaqueSecretForm';
import { supportedPartnerTasksSecrets } from '../secret-utils';

describe('OpaqueSecretForm', () => {
  it('should show Opaque secret form in a modal', async () => {
    render(
      <OpaqueSecretForm
        existingSecrets={['test']}
        onSubmit={jest.fn()}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
    );

    await waitFor(() => {
      screen.getByTestId('opaque-secret-modal');
    });
  });

  it('should render validation message when user click on create button without filling the form', async () => {
    const onSubmit = jest.fn();
    render(
      <OpaqueSecretForm
        existingSecrets={['test']}
        onSubmit={onSubmit}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Create/ }));
      expect(screen.getAllByText('Required')).toHaveLength(3);
    });
  });

  it('should call onClose callback when cancel button is clicked', async () => {
    const onClose = jest.fn();
    render(
      <OpaqueSecretForm
        existingSecrets={['test']}
        onSubmit={jest.fn()}
        modalProps={{ isOpen: true, onClose }}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('opaque-secret-modal')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('should show all the predefined tasks in the select dropdown', async () => {
    const onClose = jest.fn();
    render(
      <OpaqueSecretForm
        existingSecrets={['test']}
        onSubmit={jest.fn()}
        modalProps={{ isOpen: true, onClose }}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('opaque-secret-modal')).toBeInTheDocument();
      const modal = screen.queryByTestId('opaque-secret-modal');
      fireEvent.click(modal.querySelector('#secret-name-toggle-select-typeahead'));
    });

    await waitFor(() => {
      Object.values(supportedPartnerTasksSecrets).map((partnerSecret) => {
        expect(screen.getByText(partnerSecret.name));
      });
    });
  });

  it('should not show the secrets in the select dropdown if it is already existing', async () => {
    const onClose = jest.fn();
    render(
      <OpaqueSecretForm
        existingSecrets={['snyk-secret']}
        onSubmit={jest.fn()}
        modalProps={{ isOpen: true, onClose }}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('opaque-secret-modal')).toBeInTheDocument();
      const modal = screen.queryByTestId('opaque-secret-modal');
      fireEvent.click(modal.querySelector('#secret-name-toggle-select-typeahead'));
    });
    expect(screen.queryByText('snyk-secret')).not.toBeInTheDocument();
  });

  it('should remove the selected value with clearn button is clicked', async () => {
    const onSubmit = jest.fn();
    render(
      <OpaqueSecretForm
        existingSecrets={[]}
        onSubmit={onSubmit}
        modalProps={{ isOpen: true, onClose: onSubmit }}
      />,
    );

    const secretModal = screen.queryByTestId('opaque-secret-modal');

    act(() => {
      expect(secretModal).toBeInTheDocument();
      fireEvent.click(secretModal.querySelector('#secret-name-toggle-select-typeahead'));
    });

    act(() => {
      fireEvent.click(screen.queryByText('snyk-secret'));
      expect(screen.queryByText('snyk-secret')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(secretModal.querySelector('.pf-c-select__toggle-clear'));
      expect(screen.queryByText('snyk-secret')).not.toBeInTheDocument();
    });
  });

  it('should call onSubmit handler with newly added secret', async () => {
    const onSubmit = jest.fn();
    render(
      <OpaqueSecretForm
        existingSecrets={[]}
        onSubmit={onSubmit}
        modalProps={{ isOpen: true, onClose: onSubmit }}
      />,
    );

    act(() => {
      expect(screen.queryByTestId('opaque-secret-modal')).toBeInTheDocument();
      const modal = screen.queryByTestId('opaque-secret-modal');
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
