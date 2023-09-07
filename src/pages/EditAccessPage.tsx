import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { UserAccessFormPage } from '../components/UserAccess/UserAccessForm/UserAccessFormPage';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { SpaceBindingRequestGroupVersionKind, SpaceBindingRequestModel } from '../models';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';
import { AccessReviewResources, SpaceBindingRequest } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const GrantAccessPage: React.FC = () => {
  const { name } = useParams();

  const { namespace, workspace } = useWorkspaceInfo();
  const accessReviewResources: AccessReviewResources = [
    { model: SpaceBindingRequestModel, verb: 'update' },
  ];

  const [sbr, loaded, loadErr] = useK8sWatchResource<SpaceBindingRequest>(
    namespace
      ? {
          groupVersionKind: SpaceBindingRequestGroupVersionKind,
          isList: false,
          name,
          namespace,
        }
      : null,
  );

  if (loadErr) {
    const httpError = HttpError.fromCode((loadErr as any).code);
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode((loadErr as any).code)}
        title={`Unable to load space binding request ${name}`}
        body={httpError.message}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner data-test="spinner" />
      </Bullseye>
    );
  }

  return (
    <NamespacedPage>
      <Helmet>
        <title>
          Edit access to workspace, ${workspace} | ${FULL_APPLICATION_TITLE}
        </title>
      </Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <UserAccessFormPage sbr={sbr} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default GrantAccessPage;
