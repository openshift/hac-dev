import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useWizardContext, Wizard } from '../Wizard';

const mockGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ goBack: mockGoBack })),
}));

const DummyComponent = () => {
  const { handleNext, handleBack, handleReset, currentStep } = useWizardContext();

  return (
    <>
      <button data-testid="next" onClick={handleNext}>
        Next
      </button>
      <button data-testid="back" onClick={handleBack}>
        Back
      </button>
      <button data-testid="reset" onClick={handleReset}>
        Reset
      </button>
      <p data-testid="current-step">{currentStep}</p>
    </>
  );
};

const WrapperComponent = () => (
  <Wizard>
    <DummyComponent />
    <DummyComponent />
    <DummyComponent />
  </Wizard>
);

describe('Wizard', () => {
  it('should have current step 0 on initial render', () => {
    render(<WrapperComponent />);
    expect(screen.getByTestId('current-step').textContent).toBe('0');
  });

  it('currentStep should not go below 0', () => {
    render(<WrapperComponent />);
    fireEvent.click(screen.getByTestId('back'));
    expect(screen.getByTestId('current-step').textContent).toBe('0');
  });

  it('currentStep should not go above total length i.e. 2', () => {
    render(<WrapperComponent />);
    fireEvent.click(screen.getByTestId('next')); // 1
    fireEvent.click(screen.getByTestId('next')); // 2
    fireEvent.click(screen.getByTestId('next')); // 3
    expect(screen.getByTestId('current-step').textContent).toBe('2');
  });

  it('should reset current step to 0', () => {
    render(<WrapperComponent />);
    fireEvent.click(screen.getByTestId('next')); // 1
    fireEvent.click(screen.getByTestId('next')); // 2
    fireEvent.click(screen.getByTestId('reset')); // 0
    expect(mockGoBack).toHaveBeenCalled();
  });
});
