import * as React from 'react';
import {
  Form,
  FormSection,
  PageSection,
  PageSectionVariants,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { isEmpty } from 'lodash-es';
import { DropdownField, FormFooter, InputField } from '../../../shared';
import PageLayout from '../../PageLayout/PageLayout';
import {
  clusterTypeItems,
  EnvironmentDeploymentStrategy,
  EnvironmentType,
  environmentTypeItems,
} from '../environment-utils';
import './CreateEnvironmentForm.scss';
import KubeconfigUploadField from './KubeconfigUploadField';

export type CreateEnvironmentFormValues = {
  name: string;
  deploymentStrategy: string;
  parentEnvironment?: string;
  clusterType: string;
  environmentType?: EnvironmentType;
  kubeconfig: string;
  targetNamespace: string;
};

type CreateEnvironmentFormProps = FormikProps<CreateEnvironmentFormValues>;

const deploymentStrategyItems = Object.entries(EnvironmentDeploymentStrategy).map(([key]) => ({
  key,
  value: key,
}));

const CreateEnvironmentForm: React.FC<CreateEnvironmentFormProps> = ({
  dirty,
  errors,
  status,
  isSubmitting,
  handleSubmit,
  handleReset,
}) => {
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
    <PageLayout
      title="Create environment"
      description="Bring your managed workload clusters to create environments and deploy applications created using Red Hat Trusted Application Pipeline."
      footer={footer}
    >
      <PageSection variant={PageSectionVariants.light} isFilled isWidthLimited>
        <Form onSubmit={handleSubmit} className="hacDev-create-environment-form">
          <FormSection>
            <InputField
              aria-label="Environment Name"
              label="Environment Name"
              name="name"
              required
            />
            <DropdownField
              label="Deployment strategy"
              name="deploymentStrategy"
              items={deploymentStrategyItems}
              helpText="Set whether application component updates will need to be manually or automatically promoted to this environment, and if changes will be manually or automatically deployed."
              validateOnChange
              isDisabled
            />
          </FormSection>

          <FormSection title="Cluster information">
            <Text component={TextVariants.small}>
              What cluster would you like to use for creating this environment?
            </Text>
            <DropdownField
              label="Select Cluster"
              name="environmentType"
              items={environmentTypeItems}
              placeholder="Select"
              validateOnChange
              required
            />
            <DropdownField
              label="Cluster type"
              name="clusterType"
              items={clusterTypeItems}
              placeholder="Select"
              validateOnChange
              required
            />
            <KubeconfigUploadField name="kubeconfig" />
            <InputField
              label="Target namespace on the selected cluster"
              aria-label="Target namespace on the selected cluster"
              name="targetNamespace"
              helpText="Enter the namespace name on this cluster that you would like to use to deploy your workloads. Each namespace can be associated with a unique environment in Red Hat Trusted Application Pipeline."
              required
            />
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default CreateEnvironmentForm;
