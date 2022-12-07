import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { useNamespace } from '../../utils/namespace-context-utils';
import { createResources } from './utils/submit-utils';
import { ImportFormValues } from './utils/types';
import { useImportSteps } from './utils/useImportSteps';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const navigate = useNavigate();
  const namespace = useNamespace();

  const initialValues: ImportFormValues = {
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
  };

  const steps = useImportSteps(applicationName);

  const handleSubmit = React.useCallback(
    (values, formikHelpers) => {
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

  const handleReset = () => {
    navigate(-1);
  };

  return (
    <PageSection isFilled type={PageSectionTypes.wizard} variant={PageSectionVariants.light}>
      <FormikWizard
        onSubmit={handleSubmit}
        onReset={handleReset}
        initialValues={initialValues}
        steps={steps}
      />
    </PageSection>
  );
};

export default ImportForm;
