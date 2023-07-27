import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Bullseye,
  Title,
  Form,
  Divider,
} from '@patternfly/react-core';
import { Formik } from 'formik';
import applicationIcon from '../../imgs/Application.svg';
import integrationIcon from '../../imgs/Integration-test.svg';
import { ComponentKind } from '../../types';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { createCloseImportFormModal } from './CloseImportFormModal';
import GitImportActions from './GitImportActions';
import ReviewSection from './ReviewSection/ReviewSection';
import SourceSection from './SourceSection/SourceSection';
import { createResources } from './utils/submit-utils';
import { ImportFormValues, ImportStrategy } from './utils/types';
import { reviewValidationSchema, sourceValidationSchema } from './utils/validation-utils';

type GitImportFormProps = {
  applicationName: string;
  reviewMode: boolean;
  setReviewMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const GitImportForm: React.FunctionComponent<GitImportFormProps> = ({
  applicationName,
  reviewMode,
  setReviewMode,
}) => {
  const track = useTrackEvent();
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();

  const initialValues: ImportFormValues = {
    application: applicationName || '',
    inAppContext: applicationName ? true : false,
    components: [],
    source: {
      git: {
        url: '',
        context: '',
        revision: '',
      },
    },
    namespace,
    secret: '',
    importSecrets: [],
    newSecrets: [],
  };

  const showModal = useModalLauncher();

  const handleSubmit = React.useCallback(
    (values: ImportFormValues, formikHelpers) => {
      track(TrackEvents.ButtonClicked, { link_name: 'import-submit', workspace });
      return createResources(values, ImportStrategy.GIT, workspace)
        .then(({ applicationName: appName, application, components, componentNames }) => {
          if (application) {
            track('Application Create', {
              app_name: appName,
              app_id: application.metadata.uid,
              id: workspace,
            });
          }

          const pacComponentNames = values.components
            .filter(
              (c) =>
                c.defaultBuildPipeline === false &&
                componentNames.includes(c.componentStub.componentName),
            )
            .map((c) => c.componentStub.componentName);

          components.forEach((c: ComponentKind, i) => {
            track('Component Create', {
              component_name: c.metadata.name,
              component_id: c.metadata.uid,
              workspace,
              git_url: c.spec.source.git.url,
              git_reference: c.spec.source.git.revision,
              context_dir: c.spec.source.git.context,
              build_pipeline: pacComponentNames.includes(c.metadata.name) ? 'custom' : 'default',
              dev_file_url: c.spec.source.git.devfileUrl,
              dockerfile_url: c.spec.source.git.dockerfileUrl,
              detected_runtime: values.detectedComponents?.[i].projectType,
              chosen_runtime: values.components[i].projectType,
              used_detected_runtime:
                values.components[i].projectType === values.detectedComponents?.[i].projectType ||
                false,
            });
          });

          const doNavigate = () =>
            navigate(`/application-pipeline/workspaces/${workspace}/applications/${appName}`);

          if (pacComponentNames.length > 0) {
            showModal(
              createCustomizeAllPipelinesModalLauncher(
                appName,
                namespace,
                (c) => pacComponentNames.includes(c.metadata.name),
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
          track('Git import failed', error);
          formikHelpers.setSubmitting(false);
          formikHelpers.setStatus({ submitError: error.message });
        });
    },
    [track, workspace, navigate, showModal, namespace],
  );

  const handleReset = (openModal: boolean) => () => {
    track(TrackEvents.ButtonClicked, { link_name: 'import-leave', workspace });
    openModal
      ? showModal<{ leave: boolean }>(createCloseImportFormModal()).closed.then(({ leave }) => {
          if (leave) {
            navigate(-1);
          }
        })
      : navigate(-1);
  };

  const handleNext = async () => {
    track(TrackEvents.ButtonClicked, {
      link_name: 'import-next',
      workspace,
      // eslint-disable-next-line camelcase
      step_name: 'source-step',
    });
    setReviewMode(true);
  };

  const handleBack = (openModal: boolean) => () => {
    track(TrackEvents.ButtonClicked, {
      link_name: 'import-back',
      workspace,
      // eslint-disable-next-line camelcase
      step_name: 'review-step',
    });
    openModal
      ? showModal<{ leave: boolean }>(createCloseImportFormModal()).closed.then(({ leave }) => {
          if (leave) {
            setReviewMode(false);
          }
        })
      : setReviewMode(false);
  };

  return (
    <Formik
      onSubmit={reviewMode ? handleSubmit : handleNext}
      initialValues={initialValues}
      validationSchema={reviewMode ? reviewValidationSchema : sourceValidationSchema}
    >
      {(formikProps) => (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <Stack>
              <StackItem className="pf-u-pt-lg">
                <Bullseye>
                  <img
                    src={reviewMode ? integrationIcon : applicationIcon}
                    height="72px"
                    width="72px"
                    alt="Bring in your own code"
                  />
                </Bullseye>
                <Bullseye>
                  <Title size="lg" headingLevel="h2" className="pf-u-mt-lg pf-u-mb-lg">
                    {reviewMode ? 'Review and configure for deployment' : 'Bring in your own code'}
                  </Title>
                </Bullseye>
              </StackItem>
            </Stack>
          </PageSection>
          {reviewMode && <Divider className="import-form__divider" />}
          <PageSection variant={PageSectionVariants.light}>
            <Form
              onSubmit={formikProps.handleSubmit}
              onReset={formikProps.dirty ? handleReset(true) : handleReset(false)}
            >
              {reviewMode ? <ReviewSection /> : <SourceSection />}
            </Form>
          </PageSection>
          <GitImportActions
            reviewMode={reviewMode}
            onBack={formikProps.dirty ? handleBack(true) : handleBack(false)}
            onCancel={formikProps.dirty ? handleReset(true) : handleReset(false)}
            sticky={reviewMode}
          />
        </>
      )}
    </Formik>
  );
};

export default GitImportForm;
