import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
  ClipboardCopy,
  Spinner,
  Button,
} from '@patternfly/react-core';
import { useLatestSuccessfulBuildPipelineRunForComponent } from '../../../../hooks/usePipelineRuns';
import { useTaskRuns } from '../../../../hooks/useTaskRuns';
import CommitLabel from '../../../../shared/components/commit-label/CommitLabel';
import ErrorEmptyState from '../../../../shared/components/empty-state/ErrorEmptyState';
import { Timestamp } from '../../../../shared/components/timestamp/Timestamp';
import { HttpError } from '../../../../shared/utils/error/http-error';
import { ComponentKind } from '../../../../types';
import { getCommitsFromPLRs } from '../../../../utils/commits-utils';
import { getLastestImage } from '../../../../utils/component-utils';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import { useBuildLogViewerModal } from '../../../LogViewer/BuildLogViewer';
import ScanDescriptionListGroup from '../../../PipelineRunDetailsView/tabs/ScanDescriptionListGroup';

type ComponentLatestBuildProps = {
  component: ComponentKind;
};

const ComponentLatestBuild: React.FC<React.PropsWithChildren<ComponentLatestBuildProps>> = ({
  component,
}) => {
  const { namespace, workspace } = useWorkspaceInfo();
  const [pipelineRun, pipelineRunLoaded, error] = useLatestSuccessfulBuildPipelineRunForComponent(
    namespace,
    component.metadata.name,
  );
  const commit = React.useMemo(
    () => ((pipelineRunLoaded && pipelineRun && getCommitsFromPLRs([pipelineRun], 1)) || [])[0],
    [pipelineRunLoaded, pipelineRun],
  );
  const [taskRuns, taskRunsLoaded] = useTaskRuns(namespace, pipelineRun?.metadata?.name);
  const buildLogsModal = useBuildLogViewerModal(component);

  const containerImage = getLastestImage(component);

  if (error) {
    const httpError = HttpError.fromCode((error as any).code);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title={`Unable to load the latest build information.`}
        body={httpError.message}
      />
    );
  }

  if (!pipelineRunLoaded || !taskRunsLoaded) {
    return (
      <div className="pf-u-m-lg">
        <Spinner />
      </div>
    );
  }

  if (!pipelineRun) {
    return <Alert variant="danger" isInline title="No successful build pipeline available" />;
  }
  return (
    <Flex direction={{ default: 'row' }}>
      <FlexItem style={{ flex: 1 }}>
        <DescriptionList
          columnModifier={{
            default: '1Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Build pipeline run</DescriptionListTerm>
            <DescriptionListDescription>
              <div className="component-details__build-completion">
                <div className="component-details__build-completion--time">
                  <div>Completed at</div>
                  <Timestamp timestamp={pipelineRun?.status?.completionTime ?? '-'} />
                </div>
                <Button
                  onClick={buildLogsModal}
                  variant="link"
                  data-testid={`view-build-logs-${component.metadata.name}`}
                  isInline
                >
                  View build logs
                </Button>
              </div>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Triggered by</DescriptionListTerm>
            <DescriptionListDescription>
              {commit ? (
                <>
                  <Link
                    to={`/application-pipeline/workspaces/${workspace}/applications/${commit.application}/commit/${commit.sha}`}
                  >
                    {commit.isPullRequest ? `#${commit.pullRequestNumber}` : ''} {commit.shaTitle}
                  </Link>
                  {commit.shaURL && (
                    <>
                      {' '}
                      <CommitLabel
                        gitProvider={commit.gitProvider}
                        sha={commit.sha}
                        shaURL={commit.shaURL}
                      />
                    </>
                  )}
                </>
              ) : (
                '-'
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
      <FlexItem style={{ flex: 1 }}>
        <DescriptionList
          columnModifier={{
            default: '1Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>SBOM</DescriptionListTerm>
            <DescriptionListDescription>
              {containerImage ? (
                <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied" data-test="sbom-test">
                  {`cosign download sbom ${containerImage}`}
                </ClipboardCopy>
              ) : (
                '-'
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Build container image</DescriptionListTerm>
            <DescriptionListDescription>
              {containerImage ? (
                <ClipboardCopy
                  isReadOnly
                  hoverTip="Copy"
                  clickTip="Copied"
                  data-test="build-container-image-test"
                >
                  {containerImage}
                </ClipboardCopy>
              ) : (
                '-'
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <ScanDescriptionListGroup taskRuns={taskRuns} showLogsLink />
        </DescriptionList>
      </FlexItem>
    </Flex>
  );
};

export default React.memo(ComponentLatestBuild);
