import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, configure, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { mockLimitRange } from '../../../hooks/__data__/mock-data';
import { createApplication } from '../../../utils/create-utils';
import GitImportForm from '../GitImportForm';

jest.mock('../../../utils/analytics');

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('formik', () => ({
  Formik: jest.fn(() => null),
}));

jest.mock('../../../utils/create-utils', () => ({
  createApplication: jest.fn(),
}));

jest.mock('../../IntegrationTest/IntegrationTestForm/utils/create-utils', () => ({
  createIntegrationTest: jest.fn(),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../SourceSection/SourceSection', () => () => {
  return <div data-test="source-section" />;
});

jest.mock('../ReviewSection/ReviewSection', () => () => {
  return <div data-test="review-section" />;
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const useNavigateMock = useNavigate as jest.Mock;
const FormikMock = Formik as jest.Mock;
const createApplicationMock = createApplication as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('GitImportForm actions', () => {
  let navigateMock;
  let setReviewModeMock;

  beforeEach(() => {
    setReviewModeMock = jest.fn();
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    watchResourceMock.mockReturnValue([[mockLimitRange], true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not set inAppContext if application name is not passed', () => {
    render(
      <GitImportForm applicationName="" reviewMode={true} setReviewMode={setReviewModeMock} />,
    );
    const formikProps = FormikMock.mock.calls[0][0] as React.ComponentProps<typeof Formik>;

    expect(formikProps.initialValues.inAppContext).toBe(false);
    expect(formikProps.initialValues.application).toBe('');
  });

  it('should set inAppContext if application name is passed', () => {
    render(
      <GitImportForm
        applicationName="my-app"
        reviewMode={true}
        setReviewMode={setReviewModeMock}
      />,
    );
    const formikProps = FormikMock.mock.calls[0][0] as React.ComponentProps<typeof Formik>;

    expect(formikProps.initialValues.inAppContext).toBe(true);
    expect(formikProps.initialValues.application).toBe('my-app');
  });

  it('should navigate to application page on form submit', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'my-app' } });
    render(
      <GitImportForm
        applicationName="my-app"
        reviewMode={true}
        setReviewMode={setReviewModeMock}
      />,
    );
    const formikProps = FormikMock.mock.calls[0][0] as React.ComponentProps<typeof Formik>;

    // navigate to application page when an application has been created
    await waitFor(() => {
      formikProps.onSubmit({ ...formikProps.initialValues, application: 'my-app' }, {} as any);
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
    render(
      <GitImportForm applicationName="" reviewMode={true} setReviewMode={setReviewModeMock} />,
    );
    const formikProps = FormikMock.mock.calls[0][0] as React.ComponentProps<typeof Formik>;

    await waitFor(() => {
      formikProps.onSubmit({ ...formikProps.initialValues, application: 'my-app' }, helpers as any);
    });
    expect(helpers.setSubmitting).toHaveBeenCalledWith(false);
    expect(helpers.setStatus).toHaveBeenCalledWith({
      submitError: 'App already exist!',
    });
  });
});
