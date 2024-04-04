import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { ReleasePlanKind } from '../../../../types/coreBuildService';
import { useTrackEvent, TrackEvents } from '../../../../utils/analytics';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import { TriggerReleaseFormValues, createRelease, triggerReleaseFormSchema } from './form-utils';
import { TriggerReleaseForm } from './TriggerReleaseForm';

type Props = {
  releasePlan?: ReleasePlanKind;
};

export const TriggerReleaseFormPage: React.FC<Props> = ({ releasePlan }) => {
  const navigate = useNavigate();
  const track = useTrackEvent();
  const { namespace, workspace } = useWorkspaceInfo();

  const applicationName = releasePlan?.spec?.application;

  const handleSubmit = async (
    values: TriggerReleaseFormValues,
    { setSubmitting, setStatus }: FormikHelpers<TriggerReleaseFormValues>,
  ) => {
    track(TrackEvents.ButtonClicked, {
      link_name: 'trigger-release-plan-submit',
      workspace,
    });

    try {
      const newRelease = await createRelease(values, namespace, releasePlan);
      track('Release plan triggered', {
        // eslint-disable-next-line camelcase
        release_plan_name: newRelease.metadata.name,
        // eslint-disable-next-line camelcase
        target_snapshot: newRelease.spec.snapshot,
        releasePlan: newRelease.spec.releasePlan,
        workspace,
      });
      navigate(
        `/application-pipeline/workspaces/${workspace}/applications/${releasePlan?.spec?.application}/releases/${newRelease.metadata?.name}`,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error while submitting integration test:', e);
      setSubmitting(false);
      setStatus({ submitError: e.message });
    }
  };

  const handleReset = () => {
    track(TrackEvents.ButtonClicked, {
      link_name: 'trigger-release-plan-leave',
      workspace,
    });

    navigate('/application-pipeline/release');
  };

  const initialValues: TriggerReleaseFormValues = {
    releasePlan: releasePlan?.metadata?.name ?? '',
    snapshot: '',
    synopsis: '',
    description: '',
    topic: '',
    references: '',
    labels: releasePlan?.metadata?.labels
      ? Object.entries(releasePlan?.metadata?.labels).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }],
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={handleReset}
      validationSchema={triggerReleaseFormSchema}
      initialValues={initialValues}
    >
      {(props) => <TriggerReleaseForm {...props} applicationName={applicationName} />}
    </Formik>
  );
};
