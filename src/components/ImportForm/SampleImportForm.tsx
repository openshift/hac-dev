import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  Backdrop,
  Bullseye,
  Card,
  CardBody,
  HelperText,
  HelperTextItem,
  PageSection,
  PageSectionVariants,
  Spinner,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import gitUrlParse from 'git-url-parse';
import { useApplications } from '../../hooks/useApplications';
import { ComponentKind } from '../../types';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import SampleSection from './SampleSection/SampleSection';
import { createResources } from './utils/submit-utils';
import { ImportFormValues, ImportStrategy } from './utils/types';
import { incrementNameCount } from './utils/useValidApplicationName';

type SampleImportFormProps = {
  applicationName: string;
};

const SampleImportForm: React.FunctionComponent<React.PropsWithChildren<SampleImportFormProps>> = ({
  applicationName,
}) => {
  const navigate = useNavigate();
  const track = useTrackEvent();
  const { namespace, workspace } = useWorkspaceInfo();
  const [applications, appsLoaded] = useApplications(namespace);

  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const handleSampleImport = React.useCallback(
    (sourceUrl: string, sampleName: string) => {
      setSubmitting(true);
      track(TrackEvents.ButtonClicked, { link_name: 'import-submit', workspace });

      const validApplication =
        applicationName || incrementNameCount(applications, gitUrlParse(sourceUrl).name);
      const values: ImportFormValues = {
        application: validApplication,
        inAppContext: applicationName ? true : false,
        source: {
          git: {
            url: sourceUrl,
          },
        },
        namespace,
      };

      createResources(values, ImportStrategy.SAMPLE, workspace)
        .then(({ applicationName: appName, application, components }) => {
          if (application) {
            track('Application Create', {
              app_name: appName,
              app_id: application.metadata.uid,
              id: workspace,
            });
          }

          components.forEach((c: ComponentKind) => {
            track('Component Create', {
              component_name: c.metadata.name,
              component_id: c.metadata.uid,
              workspace,
              git_url: c.spec.source.git.url,
              git_reference: c.spec.source.git.revision,
              context_dir: c.spec.source.git.context,
              build_pipeline: 'default',
              dev_file_url: c.spec.source.git.devfileUrl,
              dockerfile_url: c.spec.source.git.dockerfileUrl,
              sample: sampleName,
            });
          });

          navigate(`/application-pipeline/workspaces/${workspace}/applications/${appName}`);
          setSubmitting(false);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          track('Sample import failed', error);
          setSubmitting(false);
          setSubmitError(error.message);
        });
    },
    [applicationName, namespace, navigate, applications, track, workspace],
  );

  if (!appsLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h2}>Start with a sample</Text>
        </TextContent>
      </PageSection>
      {submitting && (
        <Backdrop>
          <Bullseye>
            <Card isRounded isCompact>
              <CardBody>
                <Bullseye style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  <Spinner size="lg" />
                </Bullseye>
                <HelperText>
                  <HelperTextItem variant="indeterminate">Importing sample...</HelperTextItem>
                </HelperText>
              </CardBody>
            </Card>
          </Bullseye>
        </Backdrop>
      )}
      {submitError && (
        <PageSection>
          <Alert
            isInline
            variant="danger"
            title="An error occurred"
            actionClose={<AlertActionCloseButton onClose={() => setSubmitError('')} />}
          >
            {submitError}
          </Alert>
        </PageSection>
      )}
      <SampleSection onSampleImport={handleSampleImport} />
    </PageSection>
  );
};

export default SampleImportForm;
