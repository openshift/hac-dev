import React from 'react';
import {
  Bullseye,
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Spinner,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { PipelineRunLabel, PipelineRunType } from '../../consts/pipelinerun';
import { useCommitPipelineruns } from '../../hooks/useCommitPipelineruns';
import { PipelineRunGroupVersionKind } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { HttpError } from '../../shared/utils/error/http-error';
import { PipelineRunKind } from '../../types';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import {
  createCommitObjectFromPLR,
  createRepoBranchURL,
  createRepoPullRequestURL,
  getCommitShortName,
  statuses,
} from '../../utils/commits-utils';
import { pipelineRunStatus, runStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import { getLatestResource } from '../ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import ErrorEmptyState from '../EmptyState/ErrorEmptyState';
import { StatusIconWithTextLabel } from '../topology/StatusIcon';
import { useCommitStatus } from './commit-status';
import { CommitIcon } from './CommitIcon';
import CommitSidePanel from './CommitSidePanel';
import { SortedPLRList } from './CommitSidePanelHeader';
import CommitsOverviewTab from './tabs/CommitsOverviewTab';
import CommitsPipelineRunTab from './tabs/CommitsPipelineRunTab';

import './CommitDetailsView.scss';

type CommitDetailsViewProps = {
  applicationName: string;
  commitName: string;
};

export const COMMITS_GS_LOCAL_STORAGE_KEY = 'commits-getting-started-modal';

const CommitDetailsView: React.FC<CommitDetailsViewProps> = ({ commitName, applicationName }) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [selectedPipelineRun, setSelectedPipelineRun] = React.useState<PipelineRunKind>(null);
  const drawerRef = React.useRef<HTMLDivElement>();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  // const onPanelExpand = () => {
  //   drawerRef.current && drawerRef.current.focus();
  // };

  const onStatusClick = () => {
    setIsExpanded(!isExpanded);
  };

  const onPanelCloseClick = () => {
    setIsExpanded(false);
  };

  const [pipelineruns, loaded, loadErr] = useCommitPipelineruns(
    applicationName,
    namespace,
    commitName,
  );

  const commit = React.useMemo(
    () =>
      loaded &&
      Array.isArray(pipelineruns) &&
      pipelineruns.length > 0 &&
      createCommitObjectFromPLR(
        getLatestResource(
          pipelineruns?.filter(
            (plr) =>
              plr.metadata?.labels?.[PipelineRunLabel.COMMIT_TYPE_LABEL] === PipelineRunType.BUILD,
          ),
        ),
      ),
    [loaded, pipelineruns],
  );

  const sortedPLRList: SortedPLRList = React.useMemo(() => {
    if (!loaded || loadErr) {
      return null;
    }

    const runs: SortedPLRList = {};
    pipelineruns.forEach((plr) => {
      // sort plr into respective status array
      const plrStatus = pipelineRunStatus(plr);
      // put task in correct status array
      statuses.forEach((status) => {
        if (plrStatus === status) {
          if (!runs[status]) {
            runs[status] = [];
          }
          runs[status].push(plr);
        }
      });
    });

    // sort each status array
    statuses.forEach((status) => {
      if (runs[status] && Array.isArray(runs[status])) {
        runs[status].sort(
          (a, b) => parseInt(a.status?.startTime, 10) - parseInt(b.status?.startTime, 10),
        );
      }
    });

    return runs;
  }, [pipelineruns, loaded, loadErr]);

  React.useEffect(() => {
    if (sortedPLRList) {
      Object.values(sortedPLRList).some((s) => {
        if (s?.length > 0) {
          setSelectedPipelineRun(s[0]);
          return true;
        }
      });
    }
  }, [sortedPLRList]);

  const [commitStatus] = useCommitStatus(applicationName, commitName);

  const commitDisplayName = getCommitShortName(commitName);

  if (loadErr || (loaded && !commit)) {
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode(loadErr ? (loadErr as any).code : 404)}
        title={`Could not load ${PipelineRunGroupVersionKind.kind}`}
        body={(loadErr as any)?.message ?? 'Not found'}
      />
    );
  }

  if (commit) {
    return (
      <Drawer isExpanded={isExpanded}>
        <DrawerContent
          panelContent={
            sortedPLRList ? (
              <CommitSidePanel
                drawerRef={drawerRef}
                isExpanded={isExpanded}
                onPanelCloseClick={onPanelCloseClick}
                sortedPLRList={sortedPLRList}
                selectedPipelineRun={selectedPipelineRun}
                setSelectedPipelineRun={setSelectedPipelineRun}
                commitStatus={commitStatus}
              />
            ) : (
              <>not found</>
            )
          }
        >
          <DrawerContentBody className="commit-details__content">
            <DetailsPage
              headTitle={commitDisplayName}
              breadcrumbs={[
                ...applicationBreadcrumbs,
                {
                  path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/activity/latest-commits`,
                  name: 'commits',
                },
                {
                  path: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/commit/${commitName}`,
                  name: commitDisplayName,
                },
              ]}
              title={
                <Text component={TextVariants.h2}>
                  <span className="pf-u-mr-sm">
                    <CommitIcon
                      isPR={commit.isPullRequest}
                      className="commit-details__title-icon"
                    />{' '}
                    <b>{commit.shaTitle}</b>
                  </span>
                  <Button
                    className="pf-u-pl-xs"
                    aria-expanded={isExpanded}
                    variant="plain"
                    onClick={onStatusClick}
                  >
                    <StatusIconWithTextLabel status={commitStatus as runStatus} />
                  </Button>
                </Text>
              }
              description={
                <>
                  <Text component="p" className="pf-u-mt-lg pf-u-mb-xs">
                    <span className="pf-u-mr-sm">Commit ID:</span>
                    <ExternalLink href={commit.shaURL}>
                      {commitName}
                      {commit.gitProvider === 'github' && (
                        <span className="pf-u-ml-sm">
                          <GithubIcon />
                        </span>
                      )}
                    </ExternalLink>
                  </Text>
                  {commit.isPullRequest ? (
                    <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                      Pull request:{' '}
                      {createRepoPullRequestURL(commit) ? (
                        <ExternalLink
                          href={createRepoPullRequestURL(commit)}
                          text={`${commit.pullRequestNumber}`}
                        />
                      ) : (
                        commit.pullRequestNumber
                      )}
                    </Text>
                  ) : null}
                  <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                    Branch:{' '}
                    {createRepoBranchURL(commit) ? (
                      <ExternalLink href={createRepoBranchURL(commit)} text={`${commit.branch}`} />
                    ) : (
                      `${commit.branch}`
                    )}
                  </Text>
                  <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                    <span className="pf-u-color-200">
                      By {commit.user} at <Timestamp timestamp={commit.creationTime} />
                    </span>
                  </Text>
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
                  label: 'Go to source',
                  onClick: () => window.open(commit.shaURL),
                },
              ]}
              baseURL={`/stonesoup/workspaces/${workspace}/applications/${applicationName}/commit/${commitName}`}
              tabs={[
                {
                  key: 'overview',
                  label: 'Overview',
                  isFilled: true,
                  component: (
                    <CommitsOverviewTab commit={commit} selectedPipelineRun={selectedPipelineRun} />
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
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Bullseye>
      <Spinner data-test="spinner" />
    </Bullseye>
  );
};

export default CommitDetailsView;
