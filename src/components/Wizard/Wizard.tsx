import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export type WizardContextType = {
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
  increaseStepBy: (increaseBy: number) => void;
  decreaseStepBy: (decreaseBy: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
};

const WizardContext = React.createContext<WizardContextType>(undefined);

export const useWizardContext = () => React.useContext(WizardContext);

export const Wizard: React.FC = ({ children }) => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const navigate = useNavigate();

  const [activeStepContent, childrenLength] = React.useMemo(() => {
    const step = React.Children.toArray(children).filter((_, i) => i === currentStep);
    const length = React.Children.count(children) - 1;
    return [step, length];
  }, [currentStep, children]);

  const handleReset = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNext = React.useCallback(() => {
    setCurrentStep((prevStep) => (prevStep === childrenLength ? prevStep : prevStep + 1));
  }, [childrenLength]);

  const handleBack = React.useCallback(() => {
    setCurrentStep((prevStep) => (prevStep === 0 ? 0 : prevStep - 1));
  }, []);

  const increaseStepBy = React.useCallback((increaseBy: number) => {
    setCurrentStep((prevStep) => prevStep + increaseBy);
  }, []);

  const decreaseStepBy = React.useCallback((decreaseBy: number) => {
    setCurrentStep((prevStep) => prevStep - decreaseBy);
  }, []);

  const stepProps: WizardContextType = {
    handleReset,
    handleNext,
    handleBack,
    increaseStepBy,
    decreaseStepBy,
    currentStep,
    isLastStep: currentStep === childrenLength,
    isFirstStep: currentStep === 0,
  };

  return <WizardContext.Provider value={stepProps}>{activeStepContent}</WizardContext.Provider>;
};
