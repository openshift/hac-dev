import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { ApplicationKind } from '../../../types';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { FormValues } from './types';
import { useImportSteps } from './useImportSteps';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const navigate = useNavigate();
  const namespace = useNamespace();

  const [applicationData, setApplicationData] = React.useState<ApplicationKind>();
  const [componentsCreated, setComponentsCreated] = React.useState(false);

  // use a refs because formik doesn't update the `onReset` function
  const applicationDataRef = React.useRef(applicationData);
  applicationDataRef.current = applicationData;

  const goToApplicationRef = React.useRef(false);
  goToApplicationRef.current = !!applicationData || componentsCreated;

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

  const steps = useImportSteps(applicationName, {
    onApplicationCreated: setApplicationData,
    onComponentsCreated: () => setComponentsCreated(true),
  });

  const handleSubmit = React.useCallback(
    ({ application, inAppContext }: FormValues) => {
      const appName = inAppContext ? application : applicationDataRef.current?.metadata?.name;
      navigate(`/stonesoup/applications/${appName}`);
    },
    [navigate],
  );

  const handleReset = React.useCallback(
    (values: FormValues) => {
      const { inAppContext } = values;
      if (inAppContext || goToApplicationRef.current) {
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
        cancelButtonText={goToApplicationRef.current ? 'Go to application' : 'Cancel'}
      />
    </PageSection>
  );
};

export default ImportForm;
