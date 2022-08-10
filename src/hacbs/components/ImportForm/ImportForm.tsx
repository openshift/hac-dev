import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { FormValues } from './types';
import { useImportSteps } from './useImportSteps';

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
  };

  const steps = useImportSteps(applicationName);

  const handleSubmit = React.useCallback(
    (values: FormValues) => {
      navigate(`/app-studio/applications?name=${values.applicationData.metadata.name}`);
    },
    [navigate],
  );

  const handleReset = React.useCallback(
    (values: FormValues) => {
      const appName = values.applicationData?.metadata.name;
      if (appName) {
        handleSubmit(values);
      } else {
        navigate(-1);
      }
    },
    [navigate, handleSubmit],
  );

  return (
    <PageSection isFilled type={PageSectionTypes.wizard} variant={PageSectionVariants.light}>
      <FormikWizard
        onSubmit={handleSubmit}
        onReset={handleReset}
        initialValues={initialValues}
        steps={steps}
        cancelButtonText="Cancel"
      />
    </PageSection>
  );
};

export default ImportForm;
