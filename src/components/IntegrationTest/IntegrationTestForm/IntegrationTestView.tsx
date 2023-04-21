import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import IntegrationTestForm from './IntegrationTestForm';
import { IntegrationTestLabels } from './types';
import { editIntegrationTest, createIntegrationTest } from './utils/create-utils';
import { integrationTestValidationSchema } from './utils/validation-utils';

type IntegrationTestViewProps = {
  applicationName: string;
  integrationTest?: IntegrationTestScenarioKind;
};

const IntegrationTestView: React.FunctionComponent<IntegrationTestViewProps> = ({
  applicationName,
  integrationTest,
}) => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();

  const initialValues = {
    integrationTest: {
      name: integrationTest?.metadata.name ?? '',
      bundle: integrationTest?.spec.bundle ?? '',
      pipeline: integrationTest?.spec.pipeline ?? '',
      optional:
        integrationTest?.metadata.labels?.[IntegrationTestLabels.OPTIONAL] === 'true' ?? false,
    },
    isDetected: true,
  };

  const handleSubmit = (values, actions) => {
    return (
      integrationTest
        ? editIntegrationTest(integrationTest, values.integrationTest)
        : createIntegrationTest(values.integrationTest, applicationName, namespace)
    )
      .then(() => {
        if (integrationTest) {
          if (window.history.state && window.history.state.idx > 0) {
            // go back to the page where the edit was launched
            navigate(-1);
          } else {
            navigate(
              `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests/${integrationTest.metadata.name}`,
            );
          }
        } else {
          navigate(
            `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests`,
          );
        }
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
      validationSchema={integrationTestValidationSchema}
    >
      {(props) => (
        <IntegrationTestForm
          {...props}
          applicationName={applicationName}
          edit={!!integrationTest}
        />
      )}
    </Formik>
  );
};

export default IntegrationTestView;
