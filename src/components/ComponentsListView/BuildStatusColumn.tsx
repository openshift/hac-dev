import * as React from 'react';
import { Button, DataListCell, Flex, FlexItem } from '@patternfly/react-core';
import { useLatestPipelineRunForComponent } from '../../hooks/usePipelineRunsForApplication';
import { pipelineRunFilterReducer } from '../../shared';
import { ComponentKind } from '../../types';
import { getBuildStatusIcon } from '../../utils/gitops-utils';
import { useBuildLogViewerModal } from '../LogViewer/BuildLogViewer';

export type BuildStatusColumnProps = {
  component: ComponentKind;
};

const BuildStatusColumn: React.FC<BuildStatusColumnProps> = ({ component }) => {
  const pipelineRun = useLatestPipelineRunForComponent(component);
  const status = pipelineRunFilterReducer(pipelineRun);
  const buildLogsModal = useBuildLogViewerModal(component);
  const isContainerImage = !component.spec.source?.git?.url;

  return (
    <DataListCell alignRight>
      <Flex direction={{ default: 'column' }}>
        {pipelineRun && (
          <FlexItem align={{ default: 'alignRight' }}>
            {getBuildStatusIcon(status)} Build {status}
          </FlexItem>
        )}
        {!isContainerImage && (
          <FlexItem align={{ default: 'alignRight' }}>
            <Button
              onClick={buildLogsModal}
              variant="link"
              data-testid={`view-build-logs-${component.metadata.name}`}
              isInline
            >
              View logs
            </Button>
          </FlexItem>
        )}
      </Flex>
    </DataListCell>
  );
};

export default BuildStatusColumn;
