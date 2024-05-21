import React from 'react';
import { render, screen } from '@testing-library/react';
import { useField, useFormikContext } from 'formik';
import ApplicationSection from '../ApplicationSection';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
  useField: jest.fn(),
}));

const useFormikContextMock = useFormikContext as jest.Mock;
const useFieldMock = useField as jest.Mock;

describe('ApplicationSection', () => {
  it('should disable input field if in app context', () => {
    const setValue = jest.fn();
    const setTouched = jest.fn();
    useFieldMock.mockReturnValue([{}, { value: '', touched: false }, { setValue, setTouched }]);

    useFormikContextMock.mockReturnValue({ values: { inAppContext: true } });
    render(<ApplicationSection />);
    screen.getByText('Application name');
    expect(screen.getByPlaceholderText('Enter name')).toBeDisabled();
  });
});
