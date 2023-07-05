import * as React from 'react';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { useLatestBuildPipelineRunForComponent } from '../../hooks/usePipelineRuns';
import { ComponentKind } from '../../types';
import { getBuildStatusIcon } from '../../utils/gitops-utils';
import { pipelineRunStatus, runStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { useBuildLogViewerModal } from '../LogViewer/BuildLogViewer';

type BuildStatusComponentProps = {
  component: ComponentKind;
};

const BuildStatusColumn: React.FC<BuildStatusComponentProps> = ({ component }) => {
  const { namespace } = useWorkspaceInfo();
  const [pipelineRun, pipelineRunLoaded] = useLatestBuildPipelineRunForComponent(
    namespace,
    component.metadata.name,
  );
  const status = pipelineRun ? pipelineRunStatus(pipelineRun) : runStatus.PipelineNotStarted;
  const buildLogsModal = useBuildLogViewerModal(component);
  const isContainerImage = !component.spec.source?.git?.url;

  return (
    <Flex direction={{ default: 'column' }}>
      {pipelineRunLoaded && (
        <FlexItem align={{ default: 'alignRight' }}>
          {getBuildStatusIcon(status)} Build {status}
        </FlexItem>
      )}
      {pipelineRun && !isContainerImage && (
        <FlexItem align={{ default: 'alignRight' }}>
          <Button
            onClick={buildLogsModal}
            variant="link"
            data-testid={`view-build-logs-${component.metadata.name}`}
            isInline
          >
            View details
          </Button>
        </FlexItem>
      )}
    </Flex>
  );
};

export default BuildStatusColumn;
