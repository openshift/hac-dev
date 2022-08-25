import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Text,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
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
import { getCommitByName } from '../../utils/commits-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import CommitsOverviewTab from './tabs/CommitsOverviewTab';
import CommitsPLRTab from './tabs/CommitsPLRTab';

type HacbsApplicationDetailsProps = {
  applicationName: string;
  commitName: string;
};

const HacbsApplicationDetails: React.FC<HacbsApplicationDetailsProps> = ({
  commitName,
  applicationName,
}) => {
  const namespace = useNamespace();
  const navigate = useNavigate();

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
    () => loaded && Array.isArray(pipelineruns) && getCommitByName(pipelineruns, commitName),
    [loaded, pipelineruns, commitName],
  );

  const status = React.useMemo(
    () =>
      loaded &&
      Array.isArray(pipelineruns) &&
      pipelineruns.length > 0 &&
      pipelineRunFilterReducer(pipelineruns[pipelineruns.length - 1]),
    [loaded, pipelineruns],
  );

  const commitDisplayName = commitName.slice(0, 7);

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
          title={commitDisplayName}
          description={
            <>
              <Text component="p" className="pf-u-mt-lg pf-u-mb-xs">
                <span className="pf-u-mr-sm">Commit ID:</span>
                <ExternalLink href={commit.shaURL}>
                  {commitName}
                  <span className="pf-u-mr-sm pf-u-ml-sm">
                    <GithubIcon />
                  </span>
                </ExternalLink>
                <StatusIconWithText status={status} />
              </Text>
              <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                Branch:{' '}
                {commit.branch.length > 0
                  ? commit.branch.map((branch, index) => {
                      return (
                        <>
                          {commit.gitProvider === 'github' && commit.repoOrg ? (
                            <ExternalLink
                              href={`https://github.com/${commit.repoOrg}/${commit.repoURL}/tree/${branch}`}
                              text={`${branch}`}
                            />
                          ) : (
                            `${branch}`
                          )}
                          {index < commit.branch.length - 1 && `,`}
                        </>
                      );
                    })
                  : '-'}
              </Text>
              <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                <span className="pf-u-color-200">
                  By {commit.user} at <Timestamp timestamp={commit.creationTime} />
                </span>
              </Text>
              {commit.shaTitle && <p className="pf-u-mt-xs pf-u-mb-xs">{`"${commit.shaTitle}"`}</p>}
              <Text component="p" className="pf-u-mt-sm pf-u-mb-sm">
                Component:{' '}
                {commit.components.map((component, index) => {
                  return (
                    <>
                      {component}
                      {index < commit.components.length - 1 && ','}
                    </>
                  );
                })}
              </Text>
            </>
          }
          actions={[
            {
              key: 'go-to-source',
              label: 'go to source',
              onClick: () => {
                navigate(`/app-studio/import?application=${applicationName}`);
              },
            },
          ]}
          tabs={[
            {
              key: 'overview',
              label: 'Overview',
              isFilled: true,
              component: <CommitsOverviewTab commit={commit} />,
            },
            {
              key: 'pipelineruns',
              label: 'Pipeline runs',
              component: <CommitsPLRTab commit={commit} />,
            },
            {
              key: 'events',
              label: 'Events',
              component: <CommitsPLRTab commit={commit} />,
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

export default HacbsApplicationDetails;
