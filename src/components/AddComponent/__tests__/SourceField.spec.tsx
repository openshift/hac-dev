import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useField } from 'formik';
import { SourceField } from '../SourceField';
import { useComponentDetection } from '../utils';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useField: jest.fn(),
  useFormikContext: () => ({
    setFieldValue: jest.fn(),
  }),
}));

jest.mock('../utils', () => ({
  useComponentDetection: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;
const useComponentDetectionMock = useComponentDetection as jest.Mock;

afterEach(jest.resetAllMocks);

describe('SourceField', () => {
  it('renders input field and sample button', () => {
    useFieldMock.mockReturnValue([{ value: '' }, { value: '' }]);
    useComponentDetectionMock.mockReturnValue([null, null]);

    render(<SourceField onSamplesClick={jest.fn()} />);
    expect(screen.getByPlaceholderText('Enter your source')).toBeInTheDocument();
    expect(screen.getByText('Start with a sample.')).toBeInTheDocument();
  });

  it('fires callback on sample button click', () => {
    const onClick = jest.fn();
    useFieldMock.mockReturnValue([{ value: '' }, { value: '' }]);
    useComponentDetectionMock.mockReturnValue([null, null]);

    render(<SourceField onSamplesClick={onClick} />);
    fireEvent.click(screen.getByText('Start with a sample.'));
    expect(onClick).toHaveBeenCalled();
  });

  it('displays error when components cannot be detected', async () => {
    const onClick = jest.fn();
    useFieldMock.mockReturnValue([{ value: '' }, { value: '' }]);
    useComponentDetectionMock.mockReturnValue([null, 'Error']);

    render(<SourceField onSamplesClick={onClick} />);
    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(screen.getByText('Unable to detect components')).toBeVisible();
  });

  it('validates input field when components are detected', async () => {
    const onClick = jest.fn();
    useFieldMock.mockReturnValue([{ value: '' }, { value: '' }]);
    useComponentDetectionMock.mockReturnValue([
      { comp: { componentStub: { componentName: 'test' } } },
      null,
    ]);

    render(<SourceField onSamplesClick={onClick} />);
    expect(screen.getByPlaceholderText('Enter your source')).toBeValid();
    expect(screen.getByText('Validated')).toBeVisible();
  });
});
