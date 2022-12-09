import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import {
  createCommitObjectFromPLR,
  getCommitShortName,
  statuses,
} from '../../hacbs/utils/commits-utils';
import { PipelineRunGroupVersionKind } from '../../models';
import { pipelineRunFilterReducer } from '../../shared';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { StatusIconWithText } from '../../shared/components/pipeline-run-logs/StatusIcon';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import DetailsPage from '../ApplicationDetails/DetailsPage';
import CommitsGettingStartedModal from './CommitsGettingStartedModal';
import CommitSidePanel from './CommitSidePanel';
import { SortedPLRList } from './CommitSidePanelHeader';
import CommitsOverviewTab from './tabs/CommitsOverviewTab';
import CommitsPipelineRunTab from './tabs/CommitsPipelineRunTab';

import './CommitDetailsView.scss';

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

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [isFull, setIsFull] = React.useState<boolean>(false);
  const [selectedPipelineRun, setSelectedPipelineRun] = React.useState<PipelineRunKind>(null);
  const drawerRef = React.useRef<HTMLDivElement>();

  // const onPanelExpand = () => {
  //   drawerRef.current && drawerRef.current.focus();
  // };

  const onStatusClick = () => {
    setIsExpanded(!isExpanded);
  };

  const onPanelCloseClick = () => {
    setIsExpanded(false);
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

  const sortedPLRList: SortedPLRList = React.useMemo(() => {
    if (!loaded || loadErr) {
      return null;
    }

    const runs = {};
    pipelineruns.forEach((plr) => {
      // sort plr into respective status array
      const plrStatus = pipelineRunFilterReducer(plr);
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
        runs[status].sort((a, b) => parseInt(a.startTime, 10) - parseInt(b.startTime, 10));
      }
    });

    return runs;
  }, [pipelineruns, loaded, loadErr]);

  const commitStatus = React.useMemo(() => {
    if (sortedPLRList) {
      for (const s in sortedPLRList) {
        if (sortedPLRList[s]?.length > 0) {
          setSelectedPipelineRun(sortedPLRList[s][0]);
          return s;
        }
      }
    }
    return '-';
  }, [sortedPLRList]);

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
            <CommitsGettingStartedModal
              shown={showGettingStarted}
              onHide={() => setGettingStartedShown(false)}
            />
            <DetailsPage
              breadcrumbs={[
                { path: '/stonesoup/applications', name: 'Applications' },
                {
                  path: `/stonesoup/applications/${applicationName}`,
                  name: applicationName,
                },
                {
                  path: `/stonesoup/applications/${applicationName}?activeTab=commits`,
                  name: 'commits',
                },
                {
                  path: `/stonesoup/applications/${applicationName}/commit/${commitName}`,
                  name: commitDisplayName,
                },
              ]}
              title={
                <Text component={TextVariants.h2}>
                  <span className="pf-u-mr-sm">
                    <b>{commitDisplayName}</b>
                  </span>
                  <Button
                    className="pf-u-pl-xs"
                    aria-expanded={isExpanded}
                    variant="plain"
                    onClick={onStatusClick}
                  >
                    <StatusIconWithText status={commitStatus} />
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
                  <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                    Branch:{' '}
                    {commit.gitProvider === 'github' && commit.repoOrg ? (
                      <ExternalLink
                        href={`https://github.com/${commit.repoOrg}/${commit.repoURL}/tree/${commit.branch}`}
                        text={`${commit.branch}`}
                      />
                    ) : (
                      `${commit.branch}`
                    )}
                  </Text>
                  <Text component="p" className="pf-u-mt-xs pf-u-mb-xs">
                    <span className="pf-u-color-200">
                      By {commit.user} at <Timestamp timestamp={commit.creationTime} />
                    </span>
                  </Text>
                  {commit.shaTitle && commit.shaTitle.length > 75 ? (
                    <p className="pf-u-mt-xs pf-u-mb-xs">
                      {`"${isFull ? commit.shaTitle : commit.shaTitle.slice(0, 75)}"`}
                      <Button
                        className="pf-u-pl-xs"
                        variant="link"
                        onClick={() => setIsFull(!isFull)}
                      >
                        {isFull ? 'read less' : 'read more'}
                      </Button>
                    </p>
                  ) : (
                    <p className="pf-u-mt-xs pf-u-mb-xs">{`"${commit.shaTitle}"`}</p>
                  )}
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
              tabs={[
                {
                  key: 'overview',
                  label: 'Overview',
                  isFilled: true,
                  component: (
                    <CommitsOverviewTab
                      commit={commit}
                      selectedPipelineRun={selectedPipelineRun}
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
