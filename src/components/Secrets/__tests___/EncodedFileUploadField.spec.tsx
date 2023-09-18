import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { Base64 } from 'js-base64';
import { formikRenderer } from '../../../utils/test-utils';
import EncodedFileUploadField from '../SecretsForm/EncodedFileUploadField';

describe('EncodedFileUploadField', () => {
  it('should display decoded formik value', () => {
    formikRenderer(<EncodedFileUploadField id="test" name="test" label="Upload file" />, {
      test: Base64.encode('test'),
    });
    expect(screen.getByRole('button', { name: 'Upload' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Drag a file here or upload one' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'File upload' })).toHaveValue('test');
  });

  it('should clear field when button is clicked', () => {
    formikRenderer(<EncodedFileUploadField id="test" name="test" label="Upload file" />, {
      test: Base64.encode('test'),
    });
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox', { name: 'File upload' })).toHaveValue('');
  });

  it('should show helptext when provided', () => {
    formikRenderer(
      <EncodedFileUploadField
        id="test"
        name="test"
        label="Upload file"
        helpText="sample help text"
      />,
      {
        test: Base64.encode('test'),
      },
    );
    expect(screen.getByText('sample help text')).toBeVisible();
  });
});
