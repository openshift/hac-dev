import React, { useMemo } from 'react';
import { FormikWizardStep } from 'formik-pf';
import ApplicationSection from '../../../components/ImportForm/ApplicationSection/ApplicationSection';
import ReviewSection from '../../../components/ImportForm/ReviewSection/ReviewSection';
import { SourceSection } from '../../../components/ImportForm/SourceSection/SourceSection';
import { createComponents } from '../../../components/ImportForm/utils/submit-utils';
import {
  applicationValidationSchema,
  reviewValidationSchema,
  gitSourceValidationSchema,
} from '../../../components/ImportForm/utils/validation-utils';
import { createApplication } from '../../../utils/create-utils';
import BuildSection from './BuildSection';
import IntegrationTestSection from './IntegrationTestSection';
import { createAppIntegrationTest } from './submit-utils';
import { FormValues } from './types';
import { integrationTestValidationSchema } from './utils/validation-utils';

export const applicationStep = (): FormikWizardStep => ({
  id: 'application',
  name: 'Create application',
  component: <ApplicationSection />,
  validationSchema: applicationValidationSchema,
  nextButtonText: 'Create application & continue',
  validateOnChange: false,
  validateOnBlur: false,
  onSubmit: async ({ application, namespace }: FormValues, formikBag) => {
    const applicationData = await createApplication(application, namespace, false);
    formikBag.setFieldValue('applicationData', applicationData);
  },
  canJumpTo: false,
});

export const componentStep = (): FormikWizardStep => ({
  id: 'component',
  name: 'Add component',
  component: <SourceSection gitOnly />,
  validationSchema: gitSourceValidationSchema,
  canJumpTo: false,
  disableBack: true,
  cancelButtonText: 'Go to application',
});

export const reviewStep = (): FormikWizardStep => ({
  id: 'review',
  name: 'Review components',
  component: <ReviewSection />,
  nextButtonText: 'Create components & continue',
  canJumpTo: false,
  hasNoBodyPadding: true,
  validationSchema: reviewValidationSchema,
  onSubmit: ({ components, applicationData, namespace, secret }: FormValues) =>
    createComponents(components, applicationData.metadata.name, namespace, secret, false),
  cancelButtonText: 'Go to application',
});

export const buildStep = (): FormikWizardStep => ({
  id: 'build',
  name: 'Create build',
  component: <BuildSection />,
  canJumpTo: false,
  disableBack: true,
  cancelButtonText: 'Go to application',
  nextButtonText: 'Next',
});

export const integrationTestStep = (): FormikWizardStep => ({
  id: 'integraiontest',
  name: 'Add integration test',
  component: <IntegrationTestSection />,
  canJumpTo: false,
  nextButtonText: 'Next',
  validationSchema: integrationTestValidationSchema,
  cancelButtonText: 'Go to application',
  onSubmit: createAppIntegrationTest,
});

export const environmentStep = (): FormikWizardStep => ({
  id: 'environment',
  name: 'Manage Environment',
  component: <></>,
  canJumpTo: false,
  nextButtonText: 'Done! Go to app',
  cancelButtonText: 'Go to application',
});

export const useImportSteps = (applicationName: string): FormikWizardStep[] => {
  const steps = useMemo(
    () => [
      ...(applicationName ? [] : [applicationStep()]),
      componentStep(),
      reviewStep(),
      buildStep(),
      integrationTestStep(),
      environmentStep(),
    ],
    [applicationName],
  );

  return steps;
};
