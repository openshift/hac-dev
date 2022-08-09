import React from 'react';
import { useNavigate } from 'react-router-dom';
import { render } from '@testing-library/react';
import { FormikWizard } from 'formik-pf';
import ImportForm from '../ImportForm';

jest.mock('../../../../components/NamespacedPage/NamespacedPage', () => ({
  useNamespace: jest.fn(() => 'test'),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('formik-pf', () => ({
  FormikWizard: jest.fn(() => null),
}));

const useNavigateMock = useNavigate as jest.Mock;
const FormikWizardMock = FormikWizard as jest.Mock;

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

    // navigate to application page when an application has been created
    navigateMock.mockReset();
    wizardProps.onReset(
      {
        applicationData: {
          metadata: {
            name: 'my-app',
          },
        },
      },
      {} as any,
    );
    expect(navigateMock).toHaveBeenCalledWith('/app-studio/applications?name=my-app');
  });
});
