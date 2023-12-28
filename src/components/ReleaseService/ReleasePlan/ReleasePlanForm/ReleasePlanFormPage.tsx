import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { ResolverRefParams } from '../../../../components/IntegrationTest/IntegrationTestForm/utils/create-utils';
import { ReleasePlanKind, ReleasePlanLabel } from '../../../../types/coreBuildService';
import { useTrackEvent, TrackEvents } from '../../../../utils/analytics';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import {
  ReleasePlanFormValues,
  createReleasePlan,
  editReleasePlan,
  ReleasePipelineLocation,
  releasePlanFormParams,
  releasePlanFormSchema,
} from './form-utils';
import { ReleasePlanForm } from './ReleasePlanForm';

type Props = {
  releasePlan?: ReleasePlanKind;
};

export const ReleasePlanFormPage: React.FC<Props> = ({ releasePlan }) => {
  const navigate = useNavigate();
  const track = useTrackEvent();
  const { namespace, workspace } = useWorkspaceInfo();
  const edit = !!releasePlan;

  const handleSubmit = async (
    values: ReleasePlanFormValues,
    { setSubmitting, setStatus }: FormikHelpers<ReleasePlanFormValues>,
  ) => {
    if (edit) {
      track(TrackEvents.ButtonClicked, {
        link_name: 'edit-release-plan-submit',
        // eslint-disable-next-line camelcase
        release_plan_name: releasePlan.metadata.name,
        // eslint-disable-next-line camelcase
        target_workspace: releasePlan.spec.target,
        app_name: releasePlan.spec.application,
        workspace,
      });
    } else {
      track(TrackEvents.ButtonClicked, {
        link_name: 'add-release-plan-submit',
        workspace,
      });
    }
    try {
      edit
        ? await editReleasePlan(releasePlan, values, workspace, true)
        : await createReleasePlan(values, namespace, workspace, true);
      const newReleasePlan = edit
        ? await editReleasePlan(releasePlan, values, workspace)
        : await createReleasePlan(values, namespace, workspace);
      track(edit ? 'Release plan edited' : 'Release plan created', {
        // eslint-disable-next-line camelcase
        release_plan_name: newReleasePlan.metadata.name,
        // eslint-disable-next-line camelcase
        target_workspace: newReleasePlan.spec.target,
        app_name: newReleasePlan.spec.application,
        workspace,
      });
      navigate('/application-pipeline/release');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error while submitting integration test:', e);
      setSubmitting(false);
      setStatus({ submitError: e.message });
    }
  };

  const handleReset = () => {
    if (edit) {
      track(TrackEvents.ButtonClicked, {
        link_name: 'edit-release-plan-leave',
        // eslint-disable-next-line camelcase
        release_plan_name: releasePlan.metadata.name,
        // eslint-disable-next-line camelcase
        target_workspace: releasePlan.spec.target,
        app_name: releasePlan.spec.application,
        workspace,
      });
    } else {
      track(TrackEvents.ButtonClicked, {
        link_name: 'add-release-plan-leave',
        workspace,
      });
    }
    navigate('/application-pipeline/release');
  };

  const initialValues: ReleasePlanFormValues = {
    name: releasePlan?.metadata?.name ?? '',
    application: releasePlan?.spec?.application ?? '',
    autoRelease: releasePlan?.metadata?.labels?.[ReleasePlanLabel.AUTO_RELEASE] === 'true' ?? false,
    standingAttribution:
      releasePlan?.metadata?.labels?.[ReleasePlanLabel.STANDING_ATTRIBUTION] === 'true' ?? false,
    releasePipelineLocation: releasePlan?.spec?.target
      ? releasePlan.spec.target === workspace
        ? ReleasePipelineLocation.current
        : ReleasePipelineLocation.target
      : undefined,
    serviceAccount: releasePlan?.spec?.serviceAccount ?? '',
    target: releasePlan?.spec?.target ?? '',
    data: releasePlan?.spec?.data ?? '',
    params: releasePlanFormParams(releasePlan),
    labels: releasePlan?.metadata?.labels
      ? Object.entries(releasePlan?.metadata?.labels).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }],
    git: {
      url:
        releasePlan?.spec?.pipelineRef?.params?.find((p) => p.name === ResolverRefParams.URL)
          ?.value ?? '',
      revision:
        releasePlan?.spec?.pipelineRef?.params?.find((p) => p.name === ResolverRefParams.REVISION)
          ?.value ?? '',
      path:
        releasePlan?.spec?.pipelineRef?.params?.find((p) => p.name === ResolverRefParams.PATH)
          ?.value ?? '',
    },
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={handleReset}
      initialValues={initialValues}
      validationSchema={releasePlanFormSchema}
    >
      {(props) => <ReleasePlanForm {...props} edit={edit} />}
    </Formik>
  );
};
