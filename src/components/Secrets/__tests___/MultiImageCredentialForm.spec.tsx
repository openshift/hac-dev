import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../utils/test-utils';
import { MultiImageCredentialForm } from '../SecretsForm/MultiImageCredentialForm';

describe('MultiImageCredentialForm', () => {
  it('should not display remove button for one set', () => {
    formikRenderer(<MultiImageCredentialForm name="test" />, {
      test: [{}],
    });
    expect(screen.getByText('Credentials 1')).toBeVisible();
    expect(screen.getByText('Registry server address')).toBeVisible();
    expect(screen.getByText('Username')).toBeVisible();
    expect(screen.getByText('Password')).toBeVisible();
    expect(screen.getByText('Email')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add another credentials' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Remove credentials' })).not.toBeInTheDocument();
  });

  it('should display another set of fields on clicking add', () => {
    formikRenderer(<MultiImageCredentialForm name="test" />, {
      test: [{}],
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add another credentials' }));
    expect(screen.getByText('Credentials 1')).toBeVisible();
    expect(screen.getByText('Credentials 2')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove credentials 1' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove credentials 2' })).toBeVisible();
  });
});
