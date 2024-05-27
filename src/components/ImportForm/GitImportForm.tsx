import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, PageSection } from '@patternfly/react-core';
import { Formik } from 'formik';
import { TrackEvents, useTrackEvent } from '../../utils/analytics';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import ApplicationSection from './ApplicationSection/ApplicationSection';
import { ComponentSection } from './ComponentSection/ComponentSection';
import GitImportActions from './GitImportActions';
import { PipelineSection } from './PipelineSection/PipelineSection';
import SecretSection from './SecretSection/SecretSection';
import { createResources } from './submit-utils';
import { ImportFormValues } from './type';
import { formValidationSchema } from './validation.utils';

import './GitImportForm.scss';

export const GitImportForm: React.FC<{ applicationName: string }> = ({ applicationName }) => {
  const track = useTrackEvent();
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const initialValues: ImportFormValues = {
    application: applicationName || '',
    inAppContext: !!applicationName,
    showComponent: !!applicationName,
    componentName: '',
    isPrivateRepo: false,
    source: {
      git: {
        url: '',
      },
    },
    pipeline: '',
    importSecrets: [],
    newSecrets: [],
  };

  const handleSubmit = React.useCallback(
    (values: ImportFormValues, formikHelpers: any) => {
      track(TrackEvents.ButtonClicked, { link_name: 'import-submit', workspace });

      createResources(values, namespace, workspace)
        .then(({ applicationName: appName, application, component }) => {
          if (application) {
            track('Application Create', {
              app_name: appName,
              app_id: application.metadata.uid,
              id: workspace,
            });
          }

          if (values.showComponent) {
            track('Component Create', {
              component_name: component.metadata.name,
              component_id: component.metadata.uid,
              workspace,
              git_url: component.spec.source.git.url,
              git_reference: component.spec.source.git.revision,
              context_dir: component.spec.source.git.context,
            });
          }

          navigate(`/application-pipeline/workspaces/${workspace}/applications/${appName}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          track('Git import failed', error);
          formikHelpers.setSubmitting(false);
          formikHelpers.setStatus({ submitError: error.message });
        });
    },
    [namespace, navigate, track, workspace],
  );

  const handleReset = React.useCallback(() => {
    track(TrackEvents.ButtonClicked, { link_name: 'import-leave', workspace });
    navigate(-1);
  }, [navigate, track, workspace]);

  return (
    <Formik<ImportFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onReset={handleReset}
      validationSchema={formValidationSchema}
    >
      {(formikProps) => {
        return (
          <Form onSubmit={formikProps.handleSubmit} onReset={formikProps.handleReset}>
            <PageSection className="git-import-form">
              <ApplicationSection />
              {formikProps.values.showComponent ? (
                <>
                  <ComponentSection />
                  <PipelineSection />
                  <SecretSection />
                </>
              ) : null}
            </PageSection>
            <GitImportActions />
          </Form>
        );
      }}
    </Formik>
  );
};
