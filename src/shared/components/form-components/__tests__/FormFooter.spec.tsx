import * as React from 'react';
import { configure, fireEvent, render, screen } from '@testing-library/react';
import FormFooter from '../FormFooter';
import '@testing-library/jest-dom';

const handleSubmit = jest.fn();
const handleReset = jest.fn();
const handleCancel = jest.fn();
const handleDownload = jest.fn();
const submitLabel = 'submit label';
const defaultSubmitLabel = 'Save';
const resetLabel = 'reset label';
const defaultResetLabel = 'Reload';
const cancelLabel = 'cancel label';
const defaultCancelLabel = 'Cancel';
const downloadLabel = 'Download';
const errorMessage = 'error message';
const successMessage = 'success message';
const infoMessage = 'info message';
const defaultInfoMessage = 'Click {{submit}} to save changes or {{reset}} to cancel changes.';
const infoTitle = 'info title';
const defaultInfoTitle = 'You made changes to this page.';

const props = {
  disableSubmit: false,
  isSubmitting: false,
  handleSubmit,
  handleReset,
  handleCancel,
  handleDownload,
  errorMessage: null,
  showAlert: true,
};

jest.mock('../../../hooks/useScrollContainer', () => ({
  useScrollContainer: jest.fn().mockReturnValue([null, jest.fn()]),
}));

jest.mock('../../../hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));

configure({ testIdAttribute: 'data-test' });

describe('FormFooter', () => {
  it('should render buttons and alert info message', () => {
    render(<FormFooter {...props} />);
    expect(screen.getByTestId('form-footer')).toBeInTheDocument();
    expect(screen.getByText(defaultInfoTitle)).toBeInTheDocument();
    expect(screen.getByText(defaultInfoMessage)).toBeInTheDocument();
    const submitBtn = screen.getByTestId('submit-button');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent(defaultSubmitLabel);
    const resetBtn = screen.getByTestId('reset-button');
    expect(resetBtn).toBeInTheDocument();
    expect(resetBtn).toHaveTextContent(defaultResetLabel);
    const cancelBtn = screen.getByTestId('cancel-button');
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveTextContent(defaultCancelLabel);
    const downloadBtn = screen.getByTestId('download-button');
    expect(downloadBtn).toBeInTheDocument();
    expect(downloadBtn).toHaveTextContent(downloadLabel);
  });

  it('should render inline loading if form is submitting', () => {
    render(<FormFooter disableSubmit={false} errorMessage={null} isSubmitting />);
    expect(screen.getByTestId('form-footer')).toBeInTheDocument();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});

describe('FormFooter alert messages', () => {
  it('should show success message if it is defined', () => {
    render(<FormFooter {...props} successMessage={successMessage} />);
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it('should not show success message if it is not defined', () => {
    render(<FormFooter {...props} successMessage={null} />);
    expect(screen.queryByText(successMessage)).not.toBeInTheDocument();
  });

  it('should show error message if it is defined', () => {
    render(<FormFooter {...props} errorMessage={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not show error message if it is not defined', () => {
    render(<FormFooter {...props} />);
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it('should show alert with infoMessage and infoTitle if they are defined and showAlert is true', () => {
    render(<FormFooter {...props} infoMessage={infoMessage} infoTitle={infoTitle} />);
    expect(screen.getByText(infoTitle)).toBeInTheDocument();
    expect(screen.getByText(infoMessage)).toBeInTheDocument();
  });

  it('should show alert with default message and title if infoMessage and infoTitle are not defined and showAlert is true', () => {
    render(<FormFooter {...props} />);
    expect(screen.getByText(defaultInfoTitle)).toBeInTheDocument();
    expect(screen.getByText(defaultInfoMessage)).toBeInTheDocument();
  });

  it('should not show alert with info message if showAlert is false', () => {
    render(
      <FormFooter {...props} infoMessage={infoMessage} infoTitle={infoTitle} showAlert={false} />,
    );
    expect(screen.queryByText(infoTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(infoMessage)).not.toBeInTheDocument();
  });
});

describe('FormFooter buttons', () => {
  it('should show submit button with submitLabel if hideSubmit is false and submitLabel is defined', () => {
    render(<FormFooter {...props} submitLabel={submitLabel} />);
    const submitBtn = screen.getByTestId('submit-button');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent(submitLabel);
  });

  it('should show submit button with default label if hideSubmit is false and submitLabel is not defined', () => {
    render(<FormFooter {...props} submitLabel={null} />);
    const submitBtn = screen.getByTestId('submit-button');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent(defaultSubmitLabel);
  });

  it('should fire handleSubmit when submit button is clicked', () => {
    render(<FormFooter {...props} />);
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should show submit button in disabled state if hideSubmit is false but disableSubmit is true', () => {
    render(<FormFooter {...props} disableSubmit />);
    const submitBtn = screen.getByTestId('submit-button');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('should not show submit button if hideSubmit is true', () => {
    render(<FormFooter {...props} hideSubmit />);
    expect(screen.queryByTestId('submit-button')).not.toBeInTheDocument();
  });

  it('should render submit button with type button if hideSubmit is false and handleSubmit is defined', () => {
    render(<FormFooter {...props} />);
    expect(screen.getByTestId('submit-button')).toHaveAttribute('type', 'button');
  });

  it('should render submit button with type submit if hideSubmit is false and handleSubmit is not defined', () => {
    render(<FormFooter {...props} handleSubmit={undefined} />);
    expect(screen.getByTestId('submit-button')).toHaveAttribute('type', 'submit');
  });

  it('should show reset button with resetLabel if handleReset and resetLabel are defined', () => {
    render(<FormFooter {...props} resetLabel={resetLabel} />);
    const resetBtn = screen.getByTestId('reset-button');
    expect(resetBtn).toBeInTheDocument();
    expect(resetBtn).toHaveTextContent(resetLabel);
  });

  it('should show reset button with defaultLabel if handleReset is defined but resetLabel is not', () => {
    render(<FormFooter {...props} resetLabel={null} />);
    const resetBtn = screen.getByTestId('reset-button');
    expect(resetBtn).toBeInTheDocument();
    expect(resetBtn).toHaveTextContent(defaultResetLabel);
  });

  it('should fire handleReset when reset button is clicked', () => {
    render(<FormFooter {...props} />);
    fireEvent.click(screen.getByTestId('reset-button'));
    expect(handleReset).toHaveBeenCalled();
  });

  it('should not show reset button if handleReset is not defined', () => {
    render(<FormFooter {...props} handleReset={undefined} />);
    expect(screen.queryByTestId('reset-button')).not.toBeInTheDocument();
  });

  it('should show cancel button with cancelLabel if handleCancel and cancelLabel are defined', () => {
    render(<FormFooter {...props} cancelLabel={cancelLabel} />);
    const cancelBtn = screen.getByTestId('cancel-button');
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveTextContent(cancelLabel);
  });

  it('should show cancel button with default label if handleCancel is defined but cancelLabel is not', () => {
    render(<FormFooter {...props} cancelLabel={null} />);
    const cancelBtn = screen.getByTestId('cancel-button');
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveTextContent(defaultCancelLabel);
  });

  it('should fire handleCancel when cancel button is clicked', () => {
    render(<FormFooter {...props} />);
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(handleCancel).toHaveBeenCalled();
  });

  it('should not show cancel button if handleCancel is not defined', () => {
    render(<FormFooter {...props} handleCancel={undefined} />);
    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
  });

  it('should show download button if handleDownload is defined', () => {
    render(<FormFooter {...props} />);
    const cancelBtn = screen.getByTestId('download-button');
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveTextContent(downloadLabel);
  });

  it('should fire handleDownload when download button is clicked', () => {
    render(<FormFooter {...props} />);
    fireEvent.click(screen.getByTestId('download-button'));
    expect(handleDownload).toHaveBeenCalled();
  });

  it('should not show download button if handleDownload is not defined', () => {
    render(<FormFooter {...props} handleDownload={undefined} />);
    expect(screen.queryByTestId('download-button')).not.toBeInTheDocument();
  });
});
