import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { useNamespace } from '../../utils/namespace-context-utils';
import { createResources } from './utils/submit-utils';
import { ImportFormValues, ImportStrategy } from './utils/types';
import { useImportSteps } from './utils/useImportSteps';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const navigate = useNavigate();
  const namespace = useNamespace();
  const [strategy, setStrategy] = React.useState(ImportStrategy.GIT);

  const initialValues: ImportFormValues = {
    application: applicationName || '',
    inAppContext: applicationName ? true : false,
    components: [],
    pipelinesascode: false,
    git: {
      context: '',
      ref: '',
    },
    namespace,
    secret: '',
    source: '',
  };

  const steps = useImportSteps(applicationName, strategy, setStrategy);

  const handleSubmit = React.useCallback(
    (values, formikHelpers) => {
      return createResources(values, strategy)
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
    [navigate, strategy],
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
