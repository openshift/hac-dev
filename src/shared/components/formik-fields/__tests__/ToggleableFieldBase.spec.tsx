import * as React from 'react';
import { Checkbox } from '@patternfly/react-core';
import { render, screen } from '@testing-library/react';
import { useField } from 'formik';
import ToggleableFieldBase from '../ToggleableFieldBase';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;

afterEach(jest.resetAllMocks);

describe('ToggleableFieldBase', () => {
  it('renders FormGroup', () => {
    useFieldMock.mockReturnValue([{ value: '' }, { touched: false, error: null }]);
    render(
      <ToggleableFieldBase name="name" label="label" helpText="helpText">
        {(props) => <Checkbox {...props} />}
      </ToggleableFieldBase>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('helpText')).toBeInTheDocument();
  });

  it('renders FormGroup with error message if field is invalid', () => {
    useFieldMock.mockReturnValue([{ value: '' }, { touched: true, error: 'formikError' }]);
    render(
      <ToggleableFieldBase name="name" label="label" helpText="helpText">
        {(props) => <Checkbox {...props} />}
      </ToggleableFieldBase>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('formikError')).toBeInTheDocument();
  });
});
