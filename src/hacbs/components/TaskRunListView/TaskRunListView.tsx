import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { Table } from '../../../shared';
import { PipelineRunKind, TaskRunGroupVersionKind } from '../../types';
import { TaskRunListHeader } from './TaskRunListHeader';
import TaskRunListRow from './TaskRunListRow';

type Props = { pipelineName: string; namespace: string };

const TaskRunListView: React.FC<Props> = ({ pipelineName, namespace }) => {
  const [taskRuns, loaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: TaskRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        'tekton.dev/pipelineRun': pipelineName,
      },
    },
  });

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!taskRuns || taskRuns.length === 0) {
    return (
      <EmptyState data-test="taskrun-empty-state">
        <EmptyStateBody>No task runs found</EmptyStateBody>
      </EmptyState>
    );
  }

  taskRuns.sort(
    (a, b) => +new Date(a.metadata.creationTimestamp) - +new Date(b.metadata.creationTimestamp),
  );

  return (
    <Table
      data={taskRuns}
      aria-label="TaskRun List"
      Header={TaskRunListHeader}
      Row={TaskRunListRow}
      loaded={loaded}
    />
  );
};

export default TaskRunListView;
