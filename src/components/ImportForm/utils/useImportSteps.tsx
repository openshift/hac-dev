import React, { useState, useMemo } from 'react';
import { FormikWizardStep } from 'formik-pf';
import ApplicationSection from '../ApplicationSection/ApplicationSection';
import ReviewSection from '../ReviewSection/ReviewSection';
import SampleSection from '../SampleSection/SampleSection';
import { SourceSection } from '../SourceSection/SourceSection';
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
              name: 'Create Application',
              component: <ApplicationSection />,
              validationSchema: applicationValidationSchema,
            },
          ]),
      ...(strategy === ImportStrategy.GIT
        ? [
            {
              id: 'source',
              name: 'Select Source',
              component: <SourceSection onStrategyChange={setStrategy} />,
              validationSchema: sourceValidationSchema,
            },
            {
              id: 'review',
              name: 'Review Components',
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
              name: 'Select Sample',
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
