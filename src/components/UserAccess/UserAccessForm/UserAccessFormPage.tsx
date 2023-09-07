import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { SpaceBindingRequest } from '../../../types';
import { TrackEvents, useTrackEvent } from '../../../utils/analytics';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { createSBRs, editSBR, userAccessFormSchema, UserAccessFormValues } from './form-utils';
import { UserAccessForm } from './UserAccessForm';

type Props = {
  sbr?: SpaceBindingRequest;
};

export const UserAccessFormPage: React.FC<Props> = ({ sbr }) => {
  const track = useTrackEvent();
  const navigate = useNavigate();
  const { workspace, namespace } = useWorkspaceInfo();

  const handleSubmit = async (
    values: UserAccessFormValues,
    actions: FormikHelpers<UserAccessFormValues>,
  ) => {
    if (sbr) {
      track(TrackEvents.ButtonClicked, {
        link_name: 'edit-access-submit',
        // eslint-disable-next-line camelcase
        sbr_name: sbr.metadata.name,
        workspace,
      });
    } else {
      track(TrackEvents.ButtonClicked, {
        link_name: 'grant-access-submit',
        workspace,
      });
    }
    try {
      await (sbr ? editSBR(values, sbr, true) : createSBRs(values, namespace, true));
      const sbrs = await (sbr ? editSBR(values, sbr) : createSBRs(values, namespace));
      track(sbr ? 'Access Edited' : 'Access Created', {
        // eslint-disable-next-line camelcase
        sbr_names: sbrs.map((obj) => obj.metadata.name),
        workspace,
      });
      navigate('/application-pipeline/access');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error while submitting access form:', error);
      actions.setSubmitting(false);
      actions.setStatus({ submitError: error.message });
    }
  };

  const handleReset = () => {
    if (sbr) {
      track(TrackEvents.ButtonClicked, {
        link_name: 'edit-access-leave',
        // eslint-disable-next-line camelcase
        sbr_name: sbr.metadata.name,
        workspace,
      });
    } else {
      track(TrackEvents.ButtonClicked, {
        link_name: 'grant-access-leave',
        workspace,
      });
    }
    navigate('/application-pipeline/access');
  };

  const initialValues: UserAccessFormValues = {
    usernames: sbr ? [sbr.spec.masterUserRecord] : [],
    role: sbr?.spec?.spaceRole,
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={handleReset}
      initialValues={initialValues}
      validationSchema={userAccessFormSchema}
    >
      {(props) => <UserAccessForm {...props} edit={!!sbr} />}
    </Formik>
  );
};
