import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikHelpers } from 'formik';
import { FormikWizard } from 'formik-pf';
import { createResources } from '../../../components/ImportForm/utils/submit-utils';
import { useImportSteps } from '../../../components/ImportForm/utils/useImportSteps';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { FormValues } from './types';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const navigate = useNavigate();
  const namespace = useNamespace();

  const initialValues: FormValues = {
    application: applicationName || 'My Application',
    inAppContext: applicationName ? true : false,
    components: [],
    git: {
      context: '',
      ref: '',
    },
    namespace,
    secret: '',
    source: '',
    integrationTest: {
      name: '',
      bundle: '',
      pipeline: '',
      optional: false,
    },
  };

  const steps = useImportSteps(applicationName);

  const handleSubmit = React.useCallback(
    (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
      return createResources(values)
        .then((appName) => {
          navigate(`/stonesoup/applications/${appName}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          formikHelpers.setSubmitting(false);
          formikHelpers.setStatus({ submitError: error.message });
        });
    },
    [navigate],
  );

  const handleReset = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <PageSection isFilled type={PageSectionTypes.wizard} variant={PageSectionVariants.light}>
      <FormikWizard
        onSubmit={handleSubmit}
        onReset={handleReset}
        initialValues={initialValues}
        steps={steps}
        cancelButtonText={'Cancel'}
      />
    </PageSection>
  );
};

export default ImportForm;
