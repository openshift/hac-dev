import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Spinner,
  Text,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { pipelineRunFilterReducer } from '../../../shared';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { StatusIconWithText } from '../../../shared/components/pipeline-run-logs/StatusIcon';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models/';
import { PipelineRunKind } from '../../types';
import { createCommitObjectFromPLR, getCommitShortName } from '../../utils/commits-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import CommitsGettingStartedModal from './CommitsGettingStartedModal';
import CommitsOverviewTab from './tabs/CommitsOverviewTab';
import CommitsPipelineRunTab from './tabs/CommitsPipelineRunTab';

type CommitDetailsViewProps = {
  applicationName: string;
  commitName: string;
};

export const COMMITS_GS_LOCAL_STORAGE_KEY = 'hacbs/commits-getting-started-modal';

const CommitDetailsView: React.FC<CommitDetailsViewProps> = ({ commitName, applicationName }) => {
  const namespace = useNamespace();
  const [showGettingStarted, setShowGettingStarted] = React.useState<boolean>(
    !window.localStorage.getItem(COMMITS_GS_LOCAL_STORAGE_KEY),
  );

  const setGettingStartedShown = (shown: boolean) => {
    if (!shown) {
      window.localStorage.setItem(COMMITS_GS_LOCAL_STORAGE_KEY, 'true');
    }
    setShowGettingStarted(shown);
  };

  const [pipelineruns, loaded, loadErr] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    name: applicationName,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
        [PipelineRunLabel.COMMIT_LABEL]: commitName,
      },
    },
  });

  const commit = React.useMemo(
    () =>
      loaded &&
      Array.isArray(pipelineruns) &&
      pipelineruns.length > 0 &&
      createCommitObjectFromPLR(pipelineruns[0]),
    [loaded, pipelineruns],
  );

  const status = React.useMemo(
    () =>
      loaded &&
      Array.isArray(pipelineruns) &&
      pipelineruns.length > 0 &&
      pipelineRunFilterReducer(
        pipelineruns.sort(
          (a, b) =>
            parseInt(a.metadata.creationTimestamp, 10) - parseInt(b.metadata.creationTimestamp, 10),
        )[pipelineruns.length - 1],
      ),
    [loaded, pipelineruns],
  );

  const commitDisplayName = getCommitShortName(commitName);

  if (loadErr || (loaded && !commit)) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon
            style={{ color: 'var(--pf-global--danger-color--100)' }}
            icon={loadErr ? ExclamationCircleIcon : SearchIcon}
          />
          <Title size="lg" headingLevel="h4">
            {loadErr ? `Could not load ${PipelineRunGroupVersionKind.kind}` : 'Commit not found'}
          </Title>
          <EmptyStateBody>{loadErr ? 'Not found' : 'No such commit'}</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  if (commit) {
    return (
      <React.Fragment>
        <CommitsGettingStartedModal
          shown={showGettingStarted}
          onHide={() => setGettingStartedShown(false)}
        />
        <DetailsPage
          breadcrumbs={[
            { path: '/app-studio/applications', name: 'Applications' },
            {
              path: `/app-studio/applications/${applicationName}`,
              name: applicationName,
            },
            {
              path: `/app-studio/applications/${applicationName}?activeTab=commits`,
              name: 'commits',
            },
            {
              path: `/app-studio/applications/${applicationName}/commit/${commitName}`,
              name: commitDisplayName,
            },
          ]}
          title={
            <Flex spaceItems={{ default: 'spaceItemsXs' }} className="pf-u-mt-sm pf-u-mb-lg">
              <FlexItem>
                <Text component="h1" data-test="details__title">
                  {commitDisplayName}
                </Text>
              </FlexItem>
              {commit.gitProvider === 'github' && (
                <FlexItem>
                  <Text component="small">
                    <ExternalLink href={commit.shaURL}>
                      <span className="pf-u-mr-sm pf-u-ml-sm">
                        <GithubIcon />
                      </span>
                    </ExternalLink>
                  </Text>
                </FlexItem>
              )}
              <FlexItem>
                <StatusIconWithText status={status} />
              </FlexItem>
            </Flex>
          }
          description={
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
              <span>
                Branch:{' '}
                {commit.gitProvider === 'github' && commit.repoOrg ? (
                  <ExternalLink
                    href={`https://github.com/${commit.repoOrg}/${commit.repoURL}/tree/${commit.branch}`}
                    text={`${commit.branch}`}
                  />
                ) : (
                  `${commit.branch}`
                )}
              </span>
              <span className="pf-u-color-200">
                By {commit.user} at <Timestamp timestamp={commit.creationTime} />
              </span>
              {commit.shaTitle && <span>{`"${commit.shaTitle}"`}</span>}
              <span>Component: {`${commit.components.join(', ')}`}</span>
            </Flex>
          }
          actions={[
            {
              key: 'view-commit',
              href: commit.shaURL,
              label: (
                <ExternalLink
                  href={commit.shaURL}
                  text={
                    <>
                      View commit on Github <ExternalLinkAltIcon />
                    </>
                  }
                />
              ),
            },
          ]}
          tabs={[
            {
              key: 'overview',
              label: 'Overview',
              isFilled: true,
              component: (
                <CommitsOverviewTab
                  commit={commit}
                  onLearnMore={() => setGettingStartedShown(true)}
                />
              ),
            },
            {
              key: 'pipelineruns',
              label: 'Pipeline runs',

              component: (
                <CommitsPipelineRunTab
                  pipelineRuns={pipelineruns}
                  applicationName={applicationName}
                />
              ),
            },
          ]}
        />
      </React.Fragment>
    );
  }

  return (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  );
};

export default CommitDetailsView;
