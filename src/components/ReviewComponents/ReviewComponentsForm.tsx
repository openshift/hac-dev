import * as React from 'react';
import { Bullseye, Form, FormSection, PageSection, Spinner } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { DetectedComponentData, useFormValues } from '../form-context';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';
import PageLayout from '../PageLayout/PageLayout';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewSourceComponentCard } from './ReviewSourceComponentCard';

type ReviewComponentsFormProps = FormikProps<{}> & {
  detectedComponents: DetectedComponentData[];
  detectedComponentsLoaded: boolean;
};

export const ReviewComponentsForm: React.FC<ReviewComponentsFormProps> = ({
  handleSubmit,
  isSubmitting,
  status,
  errors,
  detectedComponents,
  detectedComponentsLoaded,
}) => {
  const [, setFormState] = useFormValues();
  const { handleReset: wizardHandleReset, decreaseStepBy } = useWizardContext();

  const footer = (
    <FormFooter
      submitLabel="Create"
      resetLabel="Back"
      handleReset={() => {
        decreaseStepBy(2);
      }}
      handleCancel={() => {
        wizardHandleReset();
        setFormState({});
      }}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={!detectedComponentsLoaded || !isEmpty(errors) || isSubmitting}
      errorMessage={status?.submitError}
    />
  );

  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      title="Review your new components"
      description={
        <>
          Review your selections for the application.{' '}
          <HelpTopicLink topicId="create-app">Learn more</HelpTopicLink>
        </>
      }
      footer={footer}
    >
      <PageSection isFilled>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            {detectedComponentsLoaded ? (
              detectedComponents.map((component) => (
                <ReviewSourceComponentCard
                  key={component.name}
                  component={{
                    name: component.name,
                    source: component.data.source,
                    envs: component.data.env,
                  }}
                  isExpanded={detectedComponents.length === 1}
                />
              ))
            ) : (
              <Bullseye>
                <Spinner size="lg" />
              </Bullseye>
            )}
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};
