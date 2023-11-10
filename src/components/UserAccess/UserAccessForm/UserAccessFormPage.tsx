import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { SpaceBindingRequest } from '../../../types';
import { TrackEvents, useTrackEvent } from '../../../utils/analytics';
import { WorkspaceContext } from '../../../utils/workspace-context-utils';
import { createSBRs, editSBR, userAccessFormSchema, UserAccessFormValues } from './form-utils';
import { UserAccessForm } from './UserAccessForm';

type Props = {
  existingSbr?: SpaceBindingRequest;
  username?: string;
  edit?: boolean;
};

export const UserAccessFormPage: React.FC<React.PropsWithChildren<Props>> = ({
  existingSbr,
  edit,
  username,
}) => {
  const { workspace, namespace, updateWorkspace } = React.useContext(WorkspaceContext);
  const track = useTrackEvent();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: UserAccessFormValues,
    actions: FormikHelpers<UserAccessFormValues>,
  ) => {
    track(TrackEvents.ButtonClicked, {
      ...(edit
        ? {
            link_name: 'edit-access-submit',
            username,
          }
        : {
            link_name: 'grant-access-submit',
          }),
      workspace,
    });
    try {
      await (existingSbr
        ? editSBR(values, existingSbr, true)
        : createSBRs(values, namespace, true));
      await (existingSbr ? editSBR(values, existingSbr) : createSBRs(values, namespace));
      track(edit ? 'Access Edited' : 'Access Created', {
        usernames: values.usernames,
        workspace,
      });
      updateWorkspace();
      navigate('/application-pipeline/access');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error while submitting access form:', error);
      actions.setSubmitting(false);
      actions.setStatus({ submitError: error.message });
    }
  };

  const handleReset = () => {
    track(TrackEvents.ButtonClicked, {
      ...(edit
        ? {
            link_name: 'edit-access-leave',
            username,
          }
        : {
            link_name: 'grant-access-leave',
          }),
      workspace,
    });
    navigate('/application-pipeline/access');
  };

  const initialValues: UserAccessFormValues = {
    usernames: existingSbr ? [existingSbr.spec.masterUserRecord] : edit ? [username] : [],
    role: existingSbr?.spec?.spaceRole,
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={handleReset}
      initialValues={initialValues}
      validationSchema={userAccessFormSchema}
    >
      {(props) => <UserAccessForm {...props} edit={edit} />}
    </Formik>
  );
};
