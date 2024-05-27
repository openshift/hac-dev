import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import { Formik } from 'formik';
import { isEmpty } from 'lodash-es';
import FormFooter from '../../../shared/components/form-components/FormFooter';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { AddSecretFormValues, SecretFor, SecretTypeDropdownLabel } from '../../../types';
import { addSecret } from '../../../utils/create-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import PageLayout from '../../PageLayout/PageLayout';
import { getAddSecretBreadcrumbs } from '../utils/secret-utils';
import { secretFormValidationSchema } from '../utils/secret-validation';
import { SecretTypeSubForm } from './SecretTypeSubForm';

const AddSecretForm = () => {
  const { namespace, workspace } = useWorkspaceInfo();
  const navigate = useNavigate();
  const initialValues: AddSecretFormValues = {
    type: SecretTypeDropdownLabel.opaque,
    name: '',
    secretFor: SecretFor.Build,
    opaque: {
      keyValues: [{ key: '', value: '' }],
    },
    image: {
      authType: 'Image registry credentials',
      registryCreds: [
        {
          registry: '',
          username: '',
          password: '',
          email: '',
        },
      ],
    },
    source: {
      authType: 'Basic authentication',
    },
  };
  return (
    <Formik
      initialValues={initialValues}
      onReset={() => {
        navigate(-1);
      }}
      onSubmit={(values, actions) => {
        addSecret(values, workspace, namespace)
          .then(() => {
            navigate(`/application-pipeline/secrets`);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.warn('Error while submitting secret form:', error);
            actions.setSubmitting(false);
            actions.setStatus({ submitError: error.message });
          });
      }}
      validationSchema={secretFormValidationSchema}
    >
      {({ status, isSubmitting, handleReset, dirty, errors, handleSubmit }) => (
        <PageLayout
          breadcrumbs={getAddSecretBreadcrumbs()}
          title="Add secret"
          description={
            <>
              Add a secret that will be stored using AWS Secret Manager to keep your data private.
              <ExternalLink
                href="https://konflux-ci.dev/docs/how-tos/configuring/creating-secrets/"
                isInline={false}
                hideIcon
              >
                Learn more <OpenDrawerRightIcon />
              </ExternalLink>
            </>
          }
          footer={
            <FormFooter
              submitLabel="Add secret"
              handleSubmit={handleSubmit}
              errorMessage={status && status.submitError}
              handleCancel={handleReset}
              isSubmitting={isSubmitting}
              disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
            />
          }
        >
          <PageSection variant={PageSectionVariants.light} isFilled isWidthLimited>
            <Form style={{ maxWidth: '70%' }}>
              <SecretTypeSubForm />
            </Form>
          </PageSection>
        </PageLayout>
      )}
    </Formik>
  );
};
export default AddSecretForm;
