import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner, Text, TextVariants } from '@patternfly/react-core';
import { ReleaseGroupVersionKind } from '../../models';
import { HttpError } from '../../shared/utils/error/http-error';
import { ReleaseKind } from '../../types';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import ReleaseOverviewTab from './ReleaseOverviewTab';

type ReleaseDetailsViewProps = {
  applicationName: string;
  releaseName: string;
};

const ReleaseDetailsView: React.FC<ReleaseDetailsViewProps> = ({
  applicationName,
  releaseName,
}) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const applicationBreadcrumbs = useApplicationBreadcrumbs();

  const [release, loaded, error] = useK8sWatchResource<ReleaseKind>({
    groupVersionKind: ReleaseGroupVersionKind,
    name: releaseName,
    namespace,
  });

  if (error) {
    const httpError = HttpError.fromCode((error as any).code);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title={`Unable to load release ${releaseName}`}
        body={(error as any).message}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <DetailsPage
      headTitle={release.metadata.name}
      breadcrumbs={[
        ...applicationBreadcrumbs,
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/releases`,
          name: 'Releases',
        },
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/releases/${releaseName}`,
          name: release.metadata.name,
        },
      ]}
      title={
        <Text component={TextVariants.h2}>
          <b data-test="release-name">{release.metadata.name}</b>
        </Text>
      }
      baseURL={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/releases/${releaseName}`}
      tabs={[
        {
          key: 'overview',
          label: 'Overview',
          isFilled: true,
          component: <ReleaseOverviewTab release={release} />,
        },
      ]}
    />
  );
};

export default ReleaseDetailsView;
