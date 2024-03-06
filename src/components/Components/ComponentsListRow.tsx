import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { PACState } from '../../hooks/usePACState';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import CommitLabel from '../../shared/components/commit-label/CommitLabel';
import ExternalLink from '../../shared/components/links/ExternalLink';
import PipelineRunStatus from '../../shared/components/pipeline-run-status/PipelineRunStatus';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { ComponentKind, PipelineRunKind } from '../../types';
import { getCommitsFromPLRs } from '../../utils/commits-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { useComponentActions } from '../ApplicationDetails/component-actions';
import { ComponentRelationStatusIcon } from '../ComponentRelation/details-page/ComponentRelationStatusIcon';
import GitRepoLink from '../GitLink/GitRepoLink';
import { useBuildLogViewerModal } from '../LogViewer/BuildLogViewer';
import ComponentBuildTrigger from './ComponentBuildTrigger';
import ComponentPACStateLabel from './ComponentPACStateLabel';
import { componentsTableColumnClasses } from './ComponentsListHeader';

type ComponentWithLatestBuildPipeline = ComponentKind & {
  latestBuildPipelineRun?: PipelineRunKind;
};

export const getContainerImageLink = (url: string) => {
  const imageUrl = url.includes('@sha') ? url.split('@sha')[0] : url;
  return imageUrl.startsWith('http') ? imageUrl : `https://${imageUrl}`;
};

const ComponentsListRow: React.FC<RowFunctionArgs<ComponentWithLatestBuildPipeline>> = ({
  obj: component,
  customData,
}) => {
  const { workspace } = useWorkspaceInfo();
  const applicationName = component.spec.application;
  const name = component.metadata.name;
  const actions = useComponentActions(component, name);
  const { componentPACStates } = customData;
  const buildLogsModal = useBuildLogViewerModal(component);
  const pacState = componentPACStates[name] ?? PACState.loading;

  const commit = React.useMemo(
    () =>
      ((component.latestBuildPipelineRun &&
        getCommitsFromPLRs([component.latestBuildPipelineRun], 1)) ||
        [])[0],
    [component.latestBuildPipelineRun],
  );

  return (
    <>
      <TableData
        className={componentsTableColumnClasses.component}
        data-testId="component-list-item"
      >
        <Flex direction={{ default: 'column' }}>
          <FlexItem data-testid="component-list-item-name" style={{ minWidth: '30%' }}>
            <Link
              to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components/${name}`}
            >
              <b>{name}</b>{' '}
              <ComponentRelationStatusIcon
                component={component}
                style={{ height: '10px', maxWidth: '25px' }}
              />
            </Link>
          </FlexItem>
          {component.spec.source?.git && (
            <FlexItem>
              <GitRepoLink
                url={component.spec.source?.git?.url}
                revision={component.spec.source?.git?.revision}
                context={component.spec.source?.git?.context}
              />
            </FlexItem>
          )}
          {component.spec.containerImage && (
            <FlexItem>
              <ExternalLink
                /** by default patternfly button disable text selection on Button component
                    this enables it on <a /> tag */
                style={{ userSelect: 'auto' }}
                href={getContainerImageLink(component.spec.containerImage)}
                text={component.spec.containerImage}
              />
            </FlexItem>
          )}
        </Flex>
      </TableData>
      <TableData className={componentsTableColumnClasses.buildPipeline}>
        <ComponentPACStateLabel component={component} pacState={pacState} enableAction />
      </TableData>
      <TableData className={componentsTableColumnClasses.buildTrigger}>
        <ComponentBuildTrigger pacState={pacState} />
      </TableData>
      <TableData className={componentsTableColumnClasses.latestBuild}>
        <div className="component-list-view__build-completion">
          <PipelineRunStatus pipelineRun={component.latestBuildPipelineRun} />
          <div>
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
            ) : null}
          </div>
        </div>
      </TableData>
      <TableData className={componentsTableColumnClasses.kebab}>
        <div className="component-list-view__row-actions">
          <Button
            onClick={buildLogsModal}
            variant="link"
            data-testid={`view-build-logs-${component.metadata.name}`}
            isInline
          >
            View build logs
          </Button>
          <ActionMenu actions={actions} />
        </div>
      </TableData>
    </>
  );
};

export default ComponentsListRow;
