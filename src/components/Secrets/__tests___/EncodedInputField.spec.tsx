import * as React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { Base64 } from 'js-base64';
import { formikRenderer } from '../../../utils/test-utils';
import EncodedInputField from '../SecretsForm/EncodedInputField';

describe('EncodedInputField', () => {
  it('should show decoded value for encoded formik data', () => {
    formikRenderer(<EncodedInputField name="test" />, { test: Base64.encode('test') });
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('test');
  });
});
