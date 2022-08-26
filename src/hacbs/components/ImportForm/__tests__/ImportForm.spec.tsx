import React from 'react';
import { useNavigate } from 'react-router-dom';
import { render } from '@testing-library/react';
import { FormikWizard } from 'formik-pf';
import { act } from 'react-dom/test-utils';
import ImportForm from '../ImportForm';
import { useImportSteps } from '../useImportSteps';

jest.mock('../../../../components/NamespacedPage/NamespacedPage', () => ({
  useNamespace: jest.fn(() => 'test'),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('formik-pf', () => ({
  FormikWizard: jest.fn(() => null),
}));

jest.mock('../useImportSteps', () => ({
  useImportSteps: jest.fn(),
}));

const useNavigateMock = useNavigate as jest.Mock;
const FormikWizardMock = FormikWizard as jest.Mock;
const useImportStepsMock = useImportSteps as jest.Mock;

describe('ImportForm', () => {
  it('should handle form reset', () => {
    const navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    render(<ImportForm />);
    const wizardProps = FormikWizardMock.mock.calls[0][0] as React.ComponentProps<
      typeof FormikWizard
    >;

    expect(wizardProps.onReset).not.toBeNull();

    // navigate back in history when no application has been created
    wizardProps.onReset({}, {} as any);
    expect(navigateMock).toHaveBeenCalledWith(-1);

    navigateMock.mockReset();

    // navigate to application page when an application has been created
    expect(useImportStepsMock).toHaveBeenCalledTimes(1);
    const { onApplicationCreated } = useImportStepsMock.mock.calls[0][1];
    act(() => {
      onApplicationCreated({
        metadata: {
          name: 'my-app',
        },
      });
    });
    wizardProps.onReset({}, {} as any);
    expect(navigateMock).toHaveBeenCalledWith('/app-studio/applications/my-app');
  });
});
