import * as React from 'react';
import { Form, FormSection, PageSection } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter, RadioGroupField } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { ReviewSampleComponentCard } from './ReviewSampleComponentCard';
import { ReviewSourceComponentCard } from './ReviewSourceComponentCard';
import { DeployMethod } from './types';

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

  return (
    <Form onSubmit={handleSubmit}>
      {!isSample && (
        <div className="hacDev-page__section">
          <RadioGroupField
            isInline
            name="deployMethod"
            options={[
              { label: 'Automatically deploy', value: DeployMethod.AutomaticDeploy },
              { label: 'Manually deploy', value: DeployMethod.ManualDeploy },
            ]}
          />
        </div>
      )}
      <PageSection>
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
      </PageSection>
      <div className="hacDev-page__section">
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
      </div>
    </Form>
  );
};
