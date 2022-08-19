import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { reviewValidationSchema } from '../../../components/ImportForm/utils/validation-utils';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { createIntegrationTest } from '../ImportForm/create-utils';
import IntegrationTestForm from './IntegrationTestForm';

type IntegrationTestViewProps = {
  applicationName: string;
  integrationTestName?: string;
};

const IntegrationTestView: React.FunctionComponent<IntegrationTestViewProps> = ({
  applicationName,
}) => {
  const navigate = useNavigate();
  const namespace = useNamespace();

  const initialValues = {
    integrationTest: {
      name: '',
      bundle: '',
      pipeline: '',
      optional: false,
    },
    isDetected: true,
  };

  const handleSubmit = (values, actions) => {
    return createIntegrationTest(values.integrationTest, applicationName, namespace)
      .then(() => {
        navigate(`/app-studio/applications?name=${applicationName}&activeTab=integrationtests`);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Error while submitting integration test:', error);
        actions.setSubmitting(false);
        actions.setStatus({ submitError: error.message });
      });
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={() => navigate(-1)}
      initialValues={initialValues}
      validationSchema={reviewValidationSchema}
    >
      {(props) => <IntegrationTestForm applicationName={applicationName} {...props} />}
    </Formik>
  );
};

export default IntegrationTestView;