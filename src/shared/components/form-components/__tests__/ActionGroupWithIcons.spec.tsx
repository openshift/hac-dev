import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { configure, fireEvent, render, screen } from '@testing-library/react';
import ActionGroupWithIcons from '../ActionGroupWithIcons';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

const onSubmit = jest.fn();
const onClose = jest.fn();
const mockUseTranslation = useTranslation as jest.Mock;

configure({ testIdAttribute: 'data-test' });

beforeEach(() => {
  mockUseTranslation.mockImplementation(() => ({ t: (x) => x }));
});

afterEach(jest.resetAllMocks);

describe('ActionGroupWithIcons', () => {
  it('renders submit and close buttons', () => {
    render(<ActionGroupWithIcons onSubmit={onSubmit} onClose={onClose} />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('renders close but not submit button if onSubmit is not defined', () => {
    render(<ActionGroupWithIcons onSubmit={undefined} onClose={onClose} />);
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('renders a disabled submit button if isDisabled is true', () => {
    render(<ActionGroupWithIcons onSubmit={onSubmit} onClose={onClose} isDisabled />);
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    const submitBtn = screen.getByTestId('check-icon');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('fires onSubmit callback on submit button click', () => {
    render(<ActionGroupWithIcons onSubmit={onSubmit} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('check-icon'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('fires onClose callback on close button click', () => {
    render(<ActionGroupWithIcons onSubmit={onSubmit} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(onClose).toHaveBeenCalled();
  });
});
