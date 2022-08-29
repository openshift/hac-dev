import * as React from 'react';
import {
  ExpandableSection,
  Form,
  FormSection,
  Label,
  LabelGroup,
  PageSection,
  PageSectionVariants,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { isEmpty } from 'lodash-es';
import { DropdownField, FormFooter, InputField } from '../../../shared';
import PageLayout from '../../PageLayout/PageLayout';
import { EnvironmentDeploymentStrategy, EnvironmentFormDropdownType } from '../environment-utils';
import { ParentEnvironmentField } from './ParentEnvironmentField';
import './CreateEnvironmentForm.scss';

export type CreateEnvironmentFormValues = {
  name: string;
  deploymentStrategy: string;
  parentEnvironment?: string;
  location: string;
  type: string;
};

type CreateEnvironmentFormProps = FormikProps<CreateEnvironmentFormValues>;

const CreateEnvironmentForm: React.FC<CreateEnvironmentFormProps> = ({
  dirty,
  errors,
  status,
  isSubmitting,
  handleSubmit,
  handleReset,
}) => {
  const dropdownItems = React.useMemo(
    () =>
      Object.entries(EnvironmentDeploymentStrategy).map(([key]) => ({
        key,
        value: key,
      })),
    [],
  );

  const typeDropdownItems = React.useMemo(
    () => Object.entries(EnvironmentFormDropdownType).map(([key]) => ({ key, value: key })),
    [],
  );
  const footer = (
    <FormFooter
      submitLabel="Create environment"
      handleSubmit={handleSubmit}
      errorMessage={status && status.submitError}
      handleCancel={handleReset}
      isSubmitting={isSubmitting}
      disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
    />
  );
  return (
    <PageLayout title="Create environment" footer={footer}>
      <PageSection variant={PageSectionVariants.light} isFilled isWidthLimited>
        <Form onSubmit={handleSubmit} className="hacDev-create-environment-form">
          <FormSection title="Define environment">
            <Text component={TextVariants.small}>
              This environment will be available only within thi workspace.
            </Text>
            <InputField
              aria-label="Environment Name"
              label="Environment Name"
              name="name"
              required
            />
            <DropdownField
              label="Deployment strategy"
              name="deploymentStrategy"
              items={dropdownItems}
              helpText="Set whether application component updates will need to be manually or automatically promoted to this environment, and if changes will be manually or automatically deployed."
            />
            <DropdownField
              label="Type"
              name="type"
              items={typeDropdownItems}
              placeholder="Select type..."
              required
              validateOnChange
            />
            <ParentEnvironmentField />
          </FormSection>

          <FormSection title="Select compute">
            <Text component={TextVariants.small}>
              Select a pool of compute where applications that reach this environment will run.
            </Text>
            <DropdownField
              label="Location"
              name="location"
              items={[{ key: 'developmentSandbox', value: 'Development Sandbox' }]}
              helpText="All public clouds, restricted quota, for testing purposes"
              disabled
            />
            <ExpandableSection toggleText="View location details" isIndented>
              <LabelGroup>
                <Label>country=usa</Label>
                <Label>cloud=aws</Label>
              </LabelGroup>
            </ExpandableSection>
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default CreateEnvironmentForm;
