import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { createResources } from './utils/submit-utils';
import { ImportFormValues, ImportStrategy } from './utils/types';
import { useImportSteps } from './utils/useImportSteps';

import './ImportForm.scss';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const track = useTrackEvent();
  const navigate = useNavigate();
  const { namespace } = useWorkspaceInfo();
  const [strategy, setStrategy] = React.useState(ImportStrategy.GIT);

  const initialValues: ImportFormValues = {
    application: applicationName || '',
    inAppContext: applicationName ? true : false,
    components: [],
    pipelinesascode: 'manual',
    source: {
      git: {
        url: '',
        context: '',
        revision: '',
      },
    },
    namespace,
    secret: '',
  };

  const steps = useImportSteps(applicationName, strategy, setStrategy);
  const showModal = useModalLauncher();
  const { workspace } = useWorkspaceInfo();

  const handleSubmit = React.useCallback(
    (values: ImportFormValues, formikHelpers) => {
      track(TrackEvents.ButtonClicked, { link_name: 'import-submit', workspace });
      return createResources(values, strategy)
        .then(({ applicationName: appName, application, components, componentNames }) => {
          if (application) {
            track('Application Create', {
              app_name: appName,
              app_id: application.metadata.uid,
              id: workspace,
            });
          }
          components.forEach((c, i) => {
            const isSample = strategy === ImportStrategy.SAMPLE;
            track('Component Create', {
              component_name: c.metadata.name,
              component_id: c.metadata.uid,
              workspace,
              git_url: c.spec.source.git.url,
              git_reference: c.spec.source.git.revision,
              context_dir: c.spec.source.git.context,
              build_pipeline: values.pipelinesascode === 'automatic' ? 'custom' : 'default',
              dev_file_url: c.spec.source.git.devfileUrl,
              dockerfile_url: c.spec.source.git.dockerfileUrl,
              ...(isSample
                ? { sample: values.sample }
                : {
                    detected_runtime: values.detectedComponents?.[i].projectType,
                    chosen_runtime: values.components[i].projectType,
                    used_detected_runtime:
                      values.components[i].projectType ===
                        values.detectedComponents?.[i].projectType || false,
                  }),
            });
          });
          const doNavigate = () =>
            navigate(`/application-pipeline/workspaces/${workspace}/applications/${appName}`);
          if (values.pipelinesascode === 'automatic') {
            showModal(
              createCustomizeAllPipelinesModalLauncher(
                appName,
                namespace,
                (c) => componentNames.includes(c.metadata.name),
                () => {
                  setTimeout(() => doNavigate(), 0);
                },
              ),
            );
          } else {
            doNavigate();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          formikHelpers.setSubmitting(false);
          formikHelpers.setStatus({ submitError: error.message });
        });
    },
    [navigate, strategy, showModal, namespace, workspace, track],
  );

  const handleReset = () => {
    track(TrackEvents.ButtonClicked, { link_name: 'import-leave', workspace });
    navigate(-1);
  };

  return (
    <PageSection
      isFilled
      type={PageSectionTypes.wizard}
      variant={PageSectionVariants.light}
      className="import-form"
    >
      <FormikWizard
        onSubmit={handleSubmit}
        onReset={handleReset}
        initialValues={initialValues}
        steps={steps}
        onNext={(_, stepIndex) =>
          track(TrackEvents.ButtonClicked, {
            link_name: 'import-next',
            workspace,
            // eslint-disable-next-line camelcase
            step_name:
              typeof steps[stepIndex].name === 'string' ? (steps[stepIndex].name as string) : '',
          })
        }
        onBack={(_, stepIndex) =>
          track(TrackEvents.ButtonClicked, {
            link_name: 'import-back',
            workspace,
            // eslint-disable-next-line camelcase
            step_name:
              typeof steps[stepIndex].name === 'string' ? (steps[stepIndex].name as string) : '',
          })
        }
      />
    </PageSection>
  );
};

export default ImportForm;
