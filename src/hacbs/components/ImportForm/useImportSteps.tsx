import React, { useMemo } from 'react';
import { FormikWizardStep } from 'formik-pf';
import ApplicationSection from '../../../components/ImportForm/ApplicationSection/ApplicationSection';
import ReviewSection from '../../../components/ImportForm/ReviewSection/ReviewSection';
import { SourceSection } from '../../../components/ImportForm/SourceSection/SourceSection';
import { createComponents } from '../../../components/ImportForm/utils/submit-utils';
import { ImportFormValues } from '../../../components/ImportForm/utils/types';
import {
  applicationValidationSchema,
  reviewValidationSchema,
  sourceValidationSchema,
} from '../../../components/ImportForm/utils/validation-utils';
import { createApplication, sanitizeName } from '../../../utils/create-utils';
import BuildSection from './BuildSection';

export const applicationStep = (): FormikWizardStep => ({
  id: 'application',
  name: 'Create application',
  component: <ApplicationSection />,
  validationSchema: applicationValidationSchema,
  nextButtonText: 'Create application & continue',
  validateOnChange: false,
  onSubmit: ({ application, namespace }: ImportFormValues) =>
    createApplication(application, namespace, false),
  canJumpTo: false,
});

export const componentStep = (): FormikWizardStep => ({
  id: 'component',
  name: 'Add component',
  component: <SourceSection />,
  validationSchema: sourceValidationSchema,
  canJumpTo: false,
});

export const reviewStep = (): FormikWizardStep => ({
  id: 'review',
  name: 'Review components',
  component: <ReviewSection />,
  nextButtonText: 'Create components & continue',
  canJumpTo: false,
  hasNoBodyPadding: true,
  validationSchema: reviewValidationSchema,
  onSubmit: ({ components, application, namespace, secret }: ImportFormValues) =>
    createComponents(components, sanitizeName(application), namespace, secret, false),
});

export const buildStep = (): FormikWizardStep => ({
  id: 'build',
  name: 'Create build',
  component: <BuildSection />,
  canJumpTo: false,
  validationSchema: reviewValidationSchema,
});

export const useImportSteps = (applicationName: string): FormikWizardStep[] => {
  const steps = useMemo(
    () => [
      ...(applicationName ? [] : [applicationStep()]),
      componentStep(),
      reviewStep(),
      buildStep(),
    ],
    [applicationName],
  );

  return steps;
};
