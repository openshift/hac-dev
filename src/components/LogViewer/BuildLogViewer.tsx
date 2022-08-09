import * as React from 'react';
import { ModalVariant, Stack, StackItem } from '@patternfly/react-core';
import dayjs from 'dayjs';
import { useComponentPipelineRun } from '../../hooks';
import PipelineRunLogs from '../../shared/components/pipeline-run-logs/PipelineRunLogs';
import { EmptyBox, LoadingBox } from '../../shared/components/status-box/StatusBox';
import { ComponentKind } from '../../types';
import { ComponentProps, createModalLauncher } from '../modal/createModalLauncher';
import './BuildLogViewer.scss';
import { useModalLauncher } from '../modal/ModalProvider';

type BuildLogViewerProps = ComponentProps & {
  component: ComponentKind;
};

export const BuildLogViewer: React.FC<BuildLogViewerProps> = ({ component }) => {
  const { pipelineRun, loaded } = useComponentPipelineRun(
    component.metadata.name,
    component.spec.application,
    component.metadata.namespace,
  );

  if (loaded && !pipelineRun) {
    return <EmptyBox label="pipeline runs" />;
  }

  return (
    <Stack>
      <StackItem>
        <span style={{ marginRight: 'var(--pf-global--spacer--xl)' }}>
          {' '}
          Component: {component.metadata.name}
        </span>
        {pipelineRun && loaded && (
          <span>
            {' '}
            Build start date:{' '}
            {dayjs(new Date(pipelineRun.metadata.creationTimestamp)).format(
              'MMMM DD, YYYY, h:mm A',
            )}
          </span>
        )}
      </StackItem>
      <StackItem isFilled>
        {pipelineRun ? <PipelineRunLogs obj={pipelineRun} /> : <LoadingBox />}
      </StackItem>
    </Stack>
  );
};

export const buildLogViewerLauncher = createModalLauncher(BuildLogViewer, {
  className: 'build-log-viewer',
  'data-testid': 'view-build-logs-modal',
  variant: ModalVariant.large,
  title: 'View logs',
});

export const useBuildLogViewerModal = (component: ComponentKind) => {
  const showModal = useModalLauncher();
  return React.useCallback(
    () => showModal(buildLogViewerLauncher({ component })),
    [component, showModal],
  );
};
