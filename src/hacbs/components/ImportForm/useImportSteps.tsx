import React, { useMemo } from 'react';
import { FormikWizardStep } from 'formik-pf';
import ApplicationSection from '../../../components/ImportForm/ApplicationSection/ApplicationSection';
import ReviewSection from '../../../components/ImportForm/ReviewSection/ReviewSection';
import { SourceSection } from '../../../components/ImportForm/SourceSection/SourceSection';
import {
  reviewValidationSchema,
  gitSourceValidationSchema,
  applicationValidationSchema,
} from '../../../components/ImportForm/utils/validation-utils';
import BuildSection from './BuildSection';
import { createAppIntegrationTest } from './create-utils';
import IntegrationTestSection from './IntegrationTestSection';
import { onApplicationSubmit, onComponentsSubmit } from './utils/submit-utils';
import { integrationTestValidationSchema } from './utils/validation-utils';

export const applicationStep = (): FormikWizardStep => ({
  id: 'application',
  name: 'Create application',
  component: <ApplicationSection />,
  validationSchema: applicationValidationSchema,
  nextButtonText: 'Create application & continue',
  onSubmit: onApplicationSubmit,
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
  onSubmit: onComponentsSubmit,
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
  nextButtonText: 'Done! Go to app',
  validationSchema: integrationTestValidationSchema,
  cancelButtonText: 'Go to application',
  onSubmit: createAppIntegrationTest,
});

export const useImportSteps = (applicationName: string): FormikWizardStep[] => {
  const steps = useMemo(
    () => [
      ...(applicationName ? [] : [applicationStep()]),
      componentStep(),
      reviewStep(),
      buildStep(),
      integrationTestStep(),
    ],
    [applicationName],
  );

  return steps;
};
