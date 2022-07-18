import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { ImportFormValues } from '../../../components/ImportForm/utils/types';
import { useNamespace } from '../../../components/NamespacedPage/NamespacedPage';
import { useImportSteps } from './useImportSteps';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const navigate = useNavigate();
  const { namespace } = useNamespace();

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
    // TODO type
    (values) => {
      navigate(`/app-studio/applications?name=${values.application}`);
    },
    [navigate],
  );

  const handleReset = () => {
    // TODO
  };

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
