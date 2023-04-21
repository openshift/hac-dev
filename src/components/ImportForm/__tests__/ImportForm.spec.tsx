import React from 'react';
import { useNavigate } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { FormikWizard } from 'formik-pf';
import { createApplication } from '../../../utils/create-utils';
import ImportForm from '../ImportForm';
import { useImportSteps } from '../utils/useImportSteps';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('formik-pf', () => ({
  FormikWizard: jest.fn(() => null),
}));

jest.mock('../utils/useImportSteps', () => ({
  useImportSteps: jest.fn(),
}));

jest.mock('../../../utils/create-utils', () => ({
  createApplication: jest.fn(),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useNavigateMock = useNavigate as jest.Mock;
const FormikWizardMock = FormikWizard as jest.Mock;
const useImportStepsMock = useImportSteps as jest.Mock;
const createApplicationMock = createApplication as jest.Mock;

describe('ImportForm', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle form reset', () => {
    render(<ImportForm />);
    const wizardProps = FormikWizardMock.mock.calls[0][0] as React.ComponentProps<
      typeof FormikWizard
    >;

    expect(wizardProps.onReset).not.toBeNull();

    // navigate back in history when reset is clicked
    wizardProps.onReset({}, {} as any);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it('should not set inAppContext if application name is not passed', () => {
    render(<ImportForm />);
    const wizardProps = FormikWizardMock.mock.calls[0][0] as React.ComponentProps<
      typeof FormikWizard
    >;
    expect(wizardProps.initialValues.inAppContext).toBe(false);
  });

  it('should set inAppContext if application name is passed', () => {
    render(<ImportForm applicationName="new-app" />);
    const wizardProps = FormikWizardMock.mock.calls[0][0] as React.ComponentProps<
      typeof FormikWizard
    >;
    expect(wizardProps.initialValues.inAppContext).toBe(true);
  });

  it('should navigate to application page on form submit', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'my-app' } });
    render(<ImportForm />);
    const wizardProps = FormikWizardMock.mock.calls[0][0] as React.ComponentProps<
      typeof FormikWizard
    >;
    // navigate to application page when an application has been created
    expect(useImportStepsMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      wizardProps.onSubmit({ ...wizardProps.initialValues, application: 'my-app' }, {} as any);
    });
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/my-app',
    );
  });

  it('should warn the users about the errors on form submit', async () => {
    const helpers = {
      setSubmitting: jest.fn(),
      setStatus: jest.fn(),
    };
    createApplicationMock.mockRejectedValue({ code: 409, message: 'App already exist!' });
    render(<ImportForm />);
    const wizardProps = FormikWizardMock.mock.calls[0][0] as React.ComponentProps<
      typeof FormikWizard
    >;
    expect(useImportStepsMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      wizardProps.onSubmit({ ...wizardProps.initialValues, application: 'my-app' }, helpers as any);
    });
    expect(helpers.setSubmitting).toHaveBeenCalledWith(false);
    expect(helpers.setStatus).toHaveBeenCalledWith({
      submitError: 'App already exist!',
    });
  });
});
