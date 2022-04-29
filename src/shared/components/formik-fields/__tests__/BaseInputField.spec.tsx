import * as React from 'react';
import { TextInput, ValidatedOptions } from '@patternfly/react-core';
import { render, screen } from '@testing-library/react';
import { useField } from 'formik';
import BaseInputField from '../BaseInputField';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;

describe('BaseInputField', () => {
  afterEach(jest.resetAllMocks);

  it('renders FormGroup', () => {
    useFieldMock.mockReturnValue([{ value: '' }, { touched: false, error: null }]);
    render(
      <BaseInputField name="name" label="label" helpText="helpText">
        {(props) => <TextInput {...props} />}
      </BaseInputField>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('helpText')).toBeInTheDocument();
  });

  it('renders FormGroup with error message if field is invalid and helpTextInvalid is not provided', () => {
    useFieldMock.mockReturnValue([{ value: '' }, { touched: true, error: 'formikError' }]);
    render(
      <BaseInputField name="name" label="label" helpText="helpText">
        {(props) => <TextInput {...props} />}
      </BaseInputField>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('formikError')).toBeInTheDocument();
  });

  it('renders FormGroup with helpTextInvalid if field is invalid but formik error is null and helpTextInvalid is provided', () => {
    useFieldMock.mockReturnValue([{ value: '' }, { touched: true, error: null }]);
    render(
      <BaseInputField
        name="name"
        label="label"
        helpText="helpText"
        helpTextInvalid="helpTextInvalid"
        validated={ValidatedOptions.error}
      >
        {(props) => <TextInput {...props} />}
      </BaseInputField>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('helpTextInvalid')).toBeInTheDocument();
  });
});
