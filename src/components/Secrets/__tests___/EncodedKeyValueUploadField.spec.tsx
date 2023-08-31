import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { Base64 } from 'js-base64';
import { formikRenderer } from '../../../utils/test-utils';
import EncodedKeyValueUploadField from '../utils/EncodedKeyValueUploadField';

describe('EncodedKeyValueUploadField', () => {
  it('should render key value field pair', () => {
    formikRenderer(<EncodedKeyValueUploadField name="keyValues" />, {
      keyValues: [{ key: 'test', value: '' }],
    });
    expect(screen.getByText('Key/value 1')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Key' })).toHaveValue('test');
    expect(screen.getByRole('textbox', { name: 'File upload' })).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Key/value 1 Details' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add another key/value' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Remove key/value 1' })).not.toBeInTheDocument();
  });

  it('should show remove button when there are multiple pairs', () => {
    formikRenderer(<EncodedKeyValueUploadField name="keyValues" />, {
      keyValues: [
        { key: 'test1', value: '' },
        { key: 'test2', value: '' },
      ],
    });
    expect(screen.getByRole('button', { name: 'Key/value 1 Details' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Key/value 2 Details' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove key/value 1' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove key/value 2' })).toBeVisible();
  });

  it('should remove pair on click', async () => {
    formikRenderer(<EncodedKeyValueUploadField name="keyValues" />, {
      keyValues: [
        { key: 'key1', value: '' },
        { key: 'key2', value: '' },
      ],
    });
    expect(screen.getAllByRole('textbox', { name: 'Key' }).length).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: 'Remove key/value 1' }));
    expect(screen.getAllByRole('textbox', { name: 'Key' }).length).toBe(1);
    expect(screen.getAllByRole('textbox', { name: 'Key' })[0]).toHaveValue('key2');
    expect(screen.queryByRole('button', { name: 'Remove key/value 1' })).not.toBeInTheDocument();
  });

  it('should disable key for readonly secrets', () => {
    formikRenderer(<EncodedKeyValueUploadField name="keyValues" />, {
      keyValues: [{ key: 'key1', value: '', readOnlyKey: true }],
    });
    expect(screen.getByRole('textbox', { name: 'Key' })).toHaveValue('key1');
    expect(screen.getByRole('textbox', { name: 'Key' })).toBeDisabled();
  });

  it('should decode formik value', () => {
    formikRenderer(<EncodedKeyValueUploadField name="keyValues" />, {
      keyValues: [{ key: 'key1', value: Base64.encode('test') }],
    });
    expect(screen.getByRole('textbox', { name: 'File upload' })).toHaveValue('test');
  });
});
