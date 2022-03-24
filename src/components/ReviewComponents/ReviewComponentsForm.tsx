import * as React from 'react';
import { Form, FormSection, PageSection } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { useFormValues } from '../form-context';
import PageLayout from '../layout/PageLayout';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewSampleComponentCard } from './ReviewSampleComponentCard';
import { ReviewSourceComponentCard } from './ReviewSourceComponentCard';

type ReviewComponentsFormProps = FormikProps<{}>;

export const ReviewComponentsForm: React.FC<ReviewComponentsFormProps> = ({
  handleSubmit,
  handleReset,
  isSubmitting,
  errors,
}) => {
  const [formState, setFormState] = useFormValues();
  const { handleReset: wizardHandleReset } = useWizardContext();
  const isSample = formState.components[0].type === 'sample';

  const footer = (
    <FormFooter
      submitLabel="Create"
      resetLabel="Back"
      handleReset={handleReset}
      handleCancel={() => {
        wizardHandleReset();
        setFormState({});
      }}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={!isEmpty(errors) || isSubmitting}
      errorMessage={undefined}
    />
  );

  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      title="Review your new components"
      description="Review your selections for the application."
      footer={footer}
    >
      <PageSection isFilled>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            {isSample ? (
              <ReviewSampleComponentCard component={formState.components[0]} />
            ) : (
              <>
                {formState.components.map((component) => (
                  <ReviewSourceComponentCard
                    key={component.name}
                    component={{
                      name: component.name,
                      source: component.data.source,
                      envs: component.data.env,
                    }}
                  />
                ))}
              </>
            )}
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};
