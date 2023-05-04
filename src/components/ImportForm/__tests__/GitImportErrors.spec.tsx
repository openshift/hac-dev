import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import { useFormikContext } from 'formik';
import GitImportErrors from '../GitImportErrors';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

const useFormikContextMock = useFormikContext as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('GitImportActions', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render error from formikContext', () => {
    useFormikContextMock.mockReturnValue({ status: { submitError: 'Some error' } });

    render(<GitImportErrors />);

    screen.getByText('Some error');
  });
});
