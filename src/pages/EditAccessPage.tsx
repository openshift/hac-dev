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
import { WorkspaceContext } from '../utils/workspace-context-utils';

const EditAccessPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { name } = useParams();
  const { workspace, workspaceResource } = React.useContext(WorkspaceContext);
  const binding = workspaceResource.status?.bindings?.find(
    (b) => b.masterUserRecord === name,
  )?.bindingRequest;

  const accessReviewResources: AccessReviewResources = binding
    ? [{ model: SpaceBindingRequestModel, verb: 'update' }]
    : [{ model: SpaceBindingRequestModel, verb: 'create' }];

  const [existingSBR, loaded, loadErr] = useK8sWatchResource<SpaceBindingRequest>(
    binding
      ? {
          groupVersionKind: SpaceBindingRequestGroupVersionKind,
          isList: false,
          name: binding.name,
          namespace: binding.namespace,
        }
      : null,
  );

  if (binding && loadErr) {
    const httpError = HttpError.fromCode((loadErr as any).code);
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode((loadErr as any).code)}
        title={`Unable to load space binding request ${binding.name}`}
        body={httpError.message}
      />
    );
  }

  if (binding && !loaded) {
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
        <UserAccessFormPage existingSbr={existingSBR} username={name} edit />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default EditAccessPage;
