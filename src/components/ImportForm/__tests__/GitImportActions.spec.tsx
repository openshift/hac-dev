import React from 'react';
import { render, waitFor, screen, configure } from '@testing-library/react';
import { useFormikContext } from 'formik';
import GitImportActions from '../GitImportActions';
import '@testing-library/jest-dom';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

const useFormikContextMock = useFormikContext as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const handleBack = jest.fn() as jest.Mock;

describe('GitImportActions', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render only Import code action if not in review mode', () => {
    useFormikContextMock.mockReturnValue({ values: { inAppContext: false } });

    render(<GitImportActions reviewMode={false} onBack={handleBack} />);

    screen.getByRole('button', { name: 'Import code' });
  });

  it('should render all the actions if in review mode', () => {
    useFormikContextMock.mockReturnValue({ values: { inAppContext: false } });

    render(<GitImportActions reviewMode={true} onBack={handleBack} />);

    screen.getByRole('button', { name: 'Create application' });
    screen.getByRole('button', { name: 'Back' });
    screen.getByRole('button', { name: 'Cancel' });
  });

  it('should render Add Component button', () => {
    useFormikContextMock.mockReturnValue({ values: { inAppContext: true } });

    render(<GitImportActions reviewMode={true} onBack={handleBack} />);

    screen.getByRole('button', { name: 'Add component' });
    screen.getByRole('button', { name: 'Cancel' });
  });

  it('should render disabled actions if form is not valid', () => {
    useFormikContextMock.mockReturnValue({ values: { inAppContext: false }, isValid: false });

    render(<GitImportActions reviewMode={false} onBack={handleBack} />);

    expect(screen.getByRole('button', { name: 'Import code' })).toBeDisabled();
  });

  it('should render disabled action with spinner if form is submitting', () => {
    useFormikContextMock.mockReturnValue({ values: { inAppContext: false }, isSubmitting: true });

    render(<GitImportActions reviewMode={true} onBack={handleBack} />);

    screen.getByRole('progressbar');
    expect(screen.getByRole('button', { name: 'Loading... Create application' })).toBeDisabled();
  });

  it('should call handleBack function when back button is clicked', async () => {
    useFormikContextMock.mockReturnValue({ values: { inAppContext: false }, setErrors: jest.fn() });

    render(<GitImportActions reviewMode={true} onBack={handleBack} />);

    const backButton = screen.getByRole('button', { name: 'Back' });
    await waitFor(() => backButton.click());

    expect(handleBack).toHaveBeenCalled();
  });
});
