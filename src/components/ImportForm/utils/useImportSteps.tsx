import React, { useMemo } from 'react';
import { FormikWizardStep } from 'formik-pf';
import ApplicationSection from '../ApplicationSection/ApplicationSection';
import ReviewSection from '../ReviewSection/ReviewSection';
import SampleSection from '../SampleSection/SampleSection';
import { SourceSection } from '../SourceSection/SourceSection';
import { checkApplicationName } from './submit-utils';
import { ImportStrategy } from './types';
import {
  applicationValidationSchema,
  reviewValidationSchema,
  sampleValidationSchema,
  sourceValidationSchema,
} from './validation-utils';

export const useImportSteps = (
  applicationName: string,
  strategy: ImportStrategy,
  changeStrategy: (newStrategy: ImportStrategy) => void,
): FormikWizardStep[] => {
  const steps = useMemo(
    () => [
      ...(applicationName
        ? []
        : [
            {
              id: 'application',
              name: 'Name application',
              component: <ApplicationSection />,
              validationSchema: applicationValidationSchema,
              onSubmit: checkApplicationName,
            },
          ]),
      ...(strategy === ImportStrategy.GIT
        ? [
            {
              id: 'source',
              name: 'Add components',
              component: <SourceSection onStrategyChange={changeStrategy} />,
              validationSchema: sourceValidationSchema,
            },
            {
              id: 'review',
              name: 'Configure components',
              component: <ReviewSection />,
              nextButtonText: 'Create',
              canJumpTo: false,
              validationSchema: reviewValidationSchema,
            },
          ]
        : []),
      ...(strategy === ImportStrategy.SAMPLE
        ? [
            {
              id: 'sample',
              name: 'Select sample',
              component: <SampleSection onStrategyChange={changeStrategy} />,
              hasNoBodyPadding: true,
              nextButtonText: 'Create',
              validationSchema: sampleValidationSchema,
            },
          ]
        : []),
    ],
    [applicationName, strategy, changeStrategy],
  );

  return steps;
};
