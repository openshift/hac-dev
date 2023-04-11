import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { useTrackEvent, TrackEvents } from '../../../utils/analytics';
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
  const track = useTrackEvent();
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
    if (integrationTest) {
      track(TrackEvents.ButtonClicked, {
        link_name: 'edit-integration-test-submit',
        app_name: integrationTest.spec.application,
        integration_test_name: integrationTest.metadata.name,
        workspace,
      });
    } else {
      track(TrackEvents.ButtonClicked, {
        link_name: 'add-integration-test-submit',
        app_name: applicationName,
        workspace,
      });
    }
    return (
      integrationTest
        ? editIntegrationTest(integrationTest, values.integrationTest)
        : createIntegrationTest(values.integrationTest, applicationName, namespace)
    )
      .then((newIntegrationTest) => {
        track(integrationTest ? 'Integration Test Edited' : 'Integration Test Created', {
          app_name: newIntegrationTest.spec.application,
          integration_test_name: newIntegrationTest.metadata.name,
          bundle: newIntegrationTest.spec.bundle,
          pipeline: newIntegrationTest.spec.pipeline,
          workspace,
        });
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
      onReset={() => {
        if (integrationTest) {
          track(TrackEvents.ButtonClicked, {
            link_name: 'edit-integration-test-leave',
            app_name: integrationTest.spec.application,
            integration_test_name: integrationTest.metadata.name,
            workspace,
          });
        } else {
          track(TrackEvents.ButtonClicked, {
            link_name: 'add-integration-test-leave',
            app_name: applicationName,
            workspace,
          });
        }
        navigate(-1);
      }}
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
