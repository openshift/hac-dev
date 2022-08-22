import React, { useMemo } from 'react';
import { FormikHelpers } from 'formik';
import { FormikWizardStep } from 'formik-pf';
import ApplicationSection from '../../../components/ImportForm/ApplicationSection/ApplicationSection';
import ReviewSection from '../../../components/ImportForm/ReviewSection/ReviewSection';
import { SourceSection } from '../../../components/ImportForm/SourceSection/SourceSection';
import { ImportFormValues } from '../../../components/ImportForm/utils/types';
import {
  reviewValidationSchema,
  gitSourceValidationSchema,
  applicationValidationSchema,
} from '../../../components/ImportForm/utils/validation-utils';
import { ApplicationKind } from '../../../types';
import BuildSection from './BuildSection';
import { createAppIntegrationTest } from './create-utils';
import IntegrationTestSection from './IntegrationTestSection';
import { FormValues } from './types';
import { onApplicationSubmit, onComponentsSubmit } from './utils/submit-utils';
import { integrationTestValidationSchema } from './utils/validation-utils';

export const applicationStep = (
  onApplicationCreated?: (app: ApplicationKind) => void,
): FormikWizardStep => ({
  id: 'application',
  name: 'Create application',
  component: <ApplicationSection />,
  validationSchema: applicationValidationSchema,
  nextButtonText: 'Create application & continue',
  onSubmit: async (formValues: FormValues, formikBag: FormikHelpers<ImportFormValues>) =>
    onApplicationCreated?.(await onApplicationSubmit(formValues, formikBag)),
  canJumpTo: false,
});

export const componentStep = (): FormikWizardStep => ({
  id: 'component',
  name: 'Add component',
  component: <SourceSection gitOnly />,
  validationSchema: gitSourceValidationSchema,
  canJumpTo: false,
  disableBack: true,
});

export const reviewStep = (onComponentsCreated?: () => void): FormikWizardStep => ({
  id: 'review',
  name: 'Review components',
  component: <ReviewSection />,
  nextButtonText: 'Create components & continue',
  canJumpTo: false,
  hasNoBodyPadding: true,
  validationSchema: reviewValidationSchema,
  onSubmit: async (formValues: FormValues, formikBag: FormikHelpers<ImportFormValues>) => {
    await onComponentsSubmit(formValues, formikBag);
    onComponentsCreated?.();
  },
});

export const buildStep = (): FormikWizardStep => ({
  id: 'build',
  name: 'Create build',
  component: <BuildSection />,
  canJumpTo: false,
  disableBack: true,
  nextButtonText: 'Next',
});

export const integrationTestStep = (): FormikWizardStep => ({
  id: 'integraiontest',
  name: 'Add integration test',
  component: <IntegrationTestSection />,
  canJumpTo: false,
  nextButtonText: 'Done! Go to app',
  validationSchema: integrationTestValidationSchema,
  onSubmit: createAppIntegrationTest,
});

export const useImportSteps = (
  applicationName: string,
  options?: {
    onApplicationCreated?: (app: ApplicationKind) => void;
    onComponentsCreated?: () => void;
  },
): FormikWizardStep[] => {
  const steps = useMemo(
    () => [
      ...(applicationName ? [] : [applicationStep(options?.onApplicationCreated)]),
      componentStep(),
      reviewStep(options?.onComponentsCreated),
      buildStep(),
      integrationTestStep(),
    ],
    [applicationName, options?.onApplicationCreated, options?.onComponentsCreated],
  );

  return steps;
};
