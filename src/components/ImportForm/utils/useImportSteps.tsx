import React, { useState, useMemo } from 'react';
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
  sourceValidationSchema,
} from './validation-utils';

export const useImportSteps = (applicationName: string): FormikWizardStep[] => {
  const [strategy, setStrategy] = useState(ImportStrategy.GIT);

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
              name: 'Select source',
              component: <SourceSection onStrategyChange={setStrategy} />,
              validationSchema: sourceValidationSchema,
            },
            {
              id: 'review',
              name: 'Review components',
              component: <ReviewSection />,
              nextButtonText: 'Create',
              canJumpTo: false,
              hasNoBodyPadding: true,
              validationSchema: reviewValidationSchema,
            },
          ]
        : []),
      ...(strategy === ImportStrategy.SAMPLE
        ? [
            {
              id: 'sample',
              name: 'Select sample',
              component: <SampleSection onStrategyChange={setStrategy} />,
              hasNoBodyPadding: true,
              nextButtonText: 'Create',
              validationSchema: sourceValidationSchema,
            },
          ]
        : []),
    ],
    [applicationName, strategy],
  );

  return steps;
};
