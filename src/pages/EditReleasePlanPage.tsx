import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { ReleasePlanFormPage } from '../components/ReleaseService/ReleasePlan/ReleasePlanForm/ReleasePlanFormPage';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { ReleasePlanGroupVersionKind, ReleasePlanModel } from '../models';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';
import { ReleasePlanKind } from '../types/coreBuildService';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const EditReleasePlanPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { name } = useParams();
  const { namespace } = useWorkspaceInfo();

  const [releasePlan, loaded, loadErr] = useK8sWatchResource<ReleasePlanKind>({
    groupVersionKind: ReleasePlanGroupVersionKind,
    isList: false,
    name,
    namespace,
  });

  if (loadErr) {
    const httpError = HttpError.fromCode((loadErr as any).code);
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode((loadErr as any).code)}
        title={`Unable to load release plan ${name}`}
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
          Edit release plan ${name} | ${FULL_APPLICATION_TITLE}
        </title>
      </Helmet>
      <PageAccessCheck accessReviewResources={[{ model: ReleasePlanModel, verb: 'update' }]}>
        <ReleasePlanFormPage releasePlan={releasePlan} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default EditReleasePlanPage;
