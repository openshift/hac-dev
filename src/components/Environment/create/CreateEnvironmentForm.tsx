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
import IngressDomainField from './IngressDomainField';
import KubeconfigUploadField from './KubeconfigUploadField';

export type CreateEnvironmentFormValues = {
  name: string;
  deploymentStrategy: string;
  parentEnvironment?: string;
  clusterType: string;
  environmentType?: EnvironmentType;
  kubeconfig: string;
  targetNamespace: string;
  ingressDomain: string;
};

type CreateEnvironmentFormProps = FormikProps<CreateEnvironmentFormValues>;

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
const deploymentStrategyItems = Object.entries(EnvironmentDeploymentStrategy).map(([key]) => ({
  key,
  value: key,
}));

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
const CreateEnvironmentForm: React.FC<React.PropsWithChildren<CreateEnvironmentFormProps>> = ({
  dirty,
  errors,
  status,
  isSubmitting,
  handleSubmit,
  handleReset,
  values,
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
      description="Bring your managed workload Kubernetes clusters to create environments and deploy applications created using Red Hat Trusted Application Pipeline."
      footer={footer}
    >
      <PageSection variant={PageSectionVariants.light} isFilled isWidthLimited>
        <Form onSubmit={handleSubmit} className="hacDev-create-environment-form">
          <FormSection>
            <InputField
              aria-label="Environment name"
              label="Environment name"
              name="name"
              required
            />
            <DropdownField
              label="Deployment strategy"
              name="deploymentStrategy"
              items={deploymentStrategyItems}
              helpText="For now, all applications, their components, and any future changes will be automatically deployed to this environment. Manual deployment strategy is coming soon."
              validateOnChange
              isDisabled
            />
          </FormSection>

          <FormSection title="Cluster information">
            <Text component={TextVariants.small}>
              What cluster would you like to use for creating this environment?
            </Text>
            <DropdownField
              label="Select cluster"
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
            <IngressDomainField clusterType={values.clusterType} />
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
