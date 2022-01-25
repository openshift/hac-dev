import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useField } from 'formik';
import { createComponentDetectionQuery } from '../../../utils/create-utils';
import { SourceField } from '../SourceField';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

jest.mock('../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
}));

jest.mock('../../../shared/hooks', () => ({
  useFormikValidationFix: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;
const createComponentMock = createComponentDetectionQuery as jest.Mock;

afterEach(jest.resetAllMocks);

describe('SourceField', () => {
  it('renders input field and sample button', () => {
    useFieldMock.mockReturnValue([
      { value: '' },
      { value: '', touched: false, error: null },
      { setValue: jest.fn() },
    ]);

    render(<SourceField onSamplesClick={jest.fn()} />);
    expect(screen.getByPlaceholderText('Enter your source')).toBeInTheDocument();
    expect(screen.getByText('Start with a sample')).toBeInTheDocument();
  });

  it('fires callback on sample button click', () => {
    const onClick = jest.fn();
    useFieldMock.mockReturnValue([
      { value: '' },
      { value: '', touched: false, error: null },
      { setValue: jest.fn() },
    ]);

    render(<SourceField onSamplesClick={onClick} />);
    fireEvent.click(screen.getByText('Start with a sample'));
    expect(onClick).toHaveBeenCalled();
  });

  it('creates component detection query on input', async () => {
    const onClick = jest.fn();
    useFieldMock.mockReturnValue([
      { value: '', onChange: jest.fn() },
      { value: 'https://github.com/example/repo', touched: false, error: null },
      { setValue: jest.fn() },
    ]);
    createComponentMock.mockReturnValue({ then: () => ({ catch: () => ({ finally: () => {} }) }) });

    render(<SourceField onSamplesClick={onClick} />);
    fireEvent.input(screen.getByPlaceholderText('Enter your source'), {
      target: { value: 'https://github.com/example/repo' },
    });
    await waitFor(() => expect(createComponentMock).toHaveBeenCalled());
  });
});
