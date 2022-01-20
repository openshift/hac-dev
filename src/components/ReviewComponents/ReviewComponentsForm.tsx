import * as React from 'react';
import { Form, FormSection, PageSection } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { FormFooter, RadioGroupField } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewSampleComponentCard } from './ReviewSampleComponentCard';
import { ReviewSourceComponentCard } from './ReviewSourceComponentCard';
import { DeployMethod } from './types';
import './ReviewComponentsForm.scss';

type ReviewComponentsFormProps = FormikProps<{}>;

export const ReviewComponentsForm: React.FC<ReviewComponentsFormProps> = ({
  handleSubmit,
  handleReset,
  isSubmitting,
}) => {
  const [formState, setFormState] = useFormValues();
  const { handleReset: wizardHandleReset } = useWizardContext();
  const isSample = formState.components[0].type === 'sample';

  return (
    <Form onSubmit={handleSubmit}>
      {!isSample && (
        <RadioGroupField
          isInline
          name="deployMethod"
          options={[
            { label: 'Automatically deploy', value: DeployMethod.AutomaticDeploy },
            { label: 'Manually deploy', value: DeployMethod.ManualDeploy },
          ]}
        />
      )}
      <PageSection className="hacDev-review-form__components-section">
        <FormSection>
          {isSample ? (
            <ReviewSampleComponentCard component={formState.components[0]} />
          ) : (
            <>
              {formState.components.map((component) => (
                <ReviewSourceComponentCard
                  key={component.name}
                  component={{ ...component, source: component.data.source }}
                />
              ))}
            </>
          )}
        </FormSection>
      </PageSection>
      <FormFooter
        submitLabel="Create"
        resetLabel="Back"
        handleReset={handleReset}
        handleCancel={() => {
          wizardHandleReset();
          setFormState({});
        }}
        handleSubmit={handleSubmit}
        isSubmitting={false}
        disableSubmit={isSubmitting}
        errorMessage={undefined}
      />
    </Form>
  );
};
