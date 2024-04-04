import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { TriggerReleaseFormPage } from '../components/ReleaseService/ReleasePlan/TriggerRelease/TriggerReleaseFormPage';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { ReleaseModel, ReleasePlanGroupVersionKind } from '../models';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';
import { AccessReviewResources } from '../types';
import { ReleasePlanKind } from '../types/coreBuildService';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const TriggerReleasePlanPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { name } = useParams();
  const { namespace } = useWorkspaceInfo();

  const [releasePlan, loaded, loadErr] = useK8sWatchResource<ReleasePlanKind>({
    groupVersionKind: ReleasePlanGroupVersionKind,
    isList: false,
    name,
    namespace,
  });

  const accessReviewResources: AccessReviewResources = [{ model: ReleaseModel, verb: 'create' }];

  if (!name) {
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode((loadErr as any).code)}
        title="No release plan found"
        body="You must first select a release plan."
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

  return (
    <NamespacedPage>
      <Helmet>Trigger release plan | ${FULL_APPLICATION_TITLE}</Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <TriggerReleaseFormPage releasePlan={releasePlan} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default TriggerReleasePlanPage;
