import React from 'react';
import { render } from '@testing-library/react';
import { useField } from 'formik';
import { useValidApplicationName } from '../../utils/useValidApplicationName';
import ApplicationSection from '../ApplicationSection';

jest.mock('../../utils/useValidApplicationName', () => ({
  useValidApplicationName: jest.fn(),
}));

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;
const useValidAppNameMock = useValidApplicationName as jest.Mock;

describe('ApplicationSection', () => {
  it('should set input field if it is not touched', () => {
    const setValue = jest.fn();
    const setTouched = jest.fn();
    useFieldMock.mockReturnValue([{}, { value: '', touched: false }, { setValue, setTouched }]);
    useValidAppNameMock.mockReturnValue(['my-first-app', true]);
    render(<ApplicationSection />);
    expect(setValue).toHaveBeenCalledWith('my-first-app');
  });

  it('should not set input field if it is touched', () => {
    const setValue = jest.fn();
    const setTouched = jest.fn();
    useFieldMock.mockReturnValue([
      {},
      { value: 'my-app', touched: true },
      { setValue, setTouched },
    ]);
    useValidAppNameMock.mockReturnValue(['my-first-app', true]);
    render(<ApplicationSection />);
    expect(setValue).not.toHaveBeenCalled();
    expect(setTouched).not.toHaveBeenCalled();
  });

  it('should not set field if valid name is not fetched', () => {
    const setValue = jest.fn();
    const setTouched = jest.fn();
    useFieldMock.mockReturnValue([{}, { value: '', touched: false }, { setValue, setTouched }]);
    useValidAppNameMock.mockReturnValue([null, false]);
    render(<ApplicationSection />);
    expect(setValue).not.toHaveBeenCalled();
    expect(setTouched).not.toHaveBeenCalled();
  });
});
