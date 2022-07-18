import find from 'lodash/find';
import merge from 'lodash/merge';
import { SucceedConditionReason, runStatus, pipelineRunStatus } from '../../../shared';
import {
  PipelineKind,
  PipelineRunKind,
  PipelineTask,
} from '../../../shared/components/pipeline-run-logs/types';
import { formatPrometheusDuration } from '../../../shared/components/timestamp/datetime';
import { DAG } from './dag';

export const extractDepsFromContextVariables = (contextVariable: string) => {
  const regex = /(?:(?:\$\(tasks.))([a-z0-9_-]+)(?:.results+)(?:[.^\w]+\))/g;
  let matches;
  const deps = [];
  while ((matches = regex.exec(contextVariable)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    if (matches) {
      if (!deps.includes(matches[1])) {
        deps.push(matches[1]);
      }
    }
  }
  return deps;
};

export const getPipelineFromPipelineRun = (pipelineRun: PipelineRunKind): PipelineKind => {
  const PIPELINE_LABEL = 'tekton.dev/pipeline';
  const pipelineName =
    pipelineRun?.metadata?.labels?.[PIPELINE_LABEL] || pipelineRun?.metadata?.name;
  const pipelineSpec = pipelineRun?.status?.pipelineSpec || pipelineRun?.spec?.pipelineSpec;
  if (!pipelineName || !pipelineSpec) {
    return null;
  }
  return {
    apiVersion: pipelineRun.apiVersion,
    kind: 'Pipeline',
    metadata: {
      name: pipelineName,
      namespace: pipelineRun.metadata.namespace,
    },
    spec: pipelineSpec,
  };
};

/**
 * Appends the pipeline run status to each tasks in the pipeline.
 * @param pipeline
 * @param pipelineRun
 * @param isFinallyTasks
 */
export const appendStatus = (pipeline, pipelineRun, isFinallyTasks = false) => {
  const tasks = (isFinallyTasks ? pipeline.spec.finally : pipeline.spec.tasks) || [];

  return tasks.map((task) => {
    if (!pipelineRun?.status) {
      return task;
    }
    if (!pipelineRun?.status?.taskRuns) {
      if (pipelineRun.spec.status === SucceedConditionReason.PipelineRunCancelled) {
        return merge(task, { status: { reason: runStatus.Cancelled } });
      }
      if (pipelineRun.spec.status === SucceedConditionReason.PipelineRunPending) {
        return merge(task, { status: { reason: runStatus.Idle } });
      }
      return merge(task, { status: { reason: runStatus.Failed } });
    }
    const mTask = merge(task, {
      status: find(pipelineRun.status.taskRuns, { pipelineTaskName: task.name })?.status,
    });
    // append task duration
    if (mTask.status && mTask.status.completionTime && mTask.status.startTime) {
      const date =
        new Date(mTask.status.completionTime).getTime() -
        new Date(mTask.status.startTime).getTime();
      mTask.status.duration = formatPrometheusDuration(date);
    }
    // append task status
    if (!mTask.status) {
      mTask.status = { reason: runStatus.Idle };
    } else if (mTask.status && mTask.status.conditions) {
      mTask.status.reason = pipelineRunStatus(mTask) || runStatus.Idle;
    } else if (mTask.status && !mTask.status.reason) {
      mTask.status.reason = runStatus.Idle;
    }
    return mTask;
  });
};

const getGraphDataModel = (pipeline: PipelineKind, pipelineRun?: PipelineRunKind) => {
  const taskList = appendStatus(pipeline, pipelineRun);

  const dag = new DAG();
  taskList?.forEach((task: PipelineTask) => {
    const from = [];
    if (task.params) {
      task.params.map((p) => {
        if (Array.isArray(p.value)) {
          p.value.forEach((paramValue) => {
            from.push(...extractDepsFromContextVariables(paramValue));
          });
        } else {
          from.push(...extractDepsFromContextVariables(p.value));
        }
      });
    }
    if (task?.when) {
      task.when.map(({ input, values }) => {
        from.push(...extractDepsFromContextVariables(input));
        values.forEach((whenValue) => {
          from.push(...extractDepsFromContextVariables(whenValue));
        });
      });
    }
    const runAfters = from.length ? [...(task.runAfter || []), ...from] : task.runAfter;

    dag.addEdges(task.name, task, '', runAfters);
  });

  const nodes = [];
  dag.topologicalSort((vertex: any) => {
    const runAfterTasks = [];
    if (vertex.dependancyNames) {
      vertex.dependancyNames.forEach((dep) => {
        const depObj = dag.vertices.get(dep);
        if (depObj.level - vertex.level <= 1) {
          runAfterTasks.push(dep);
        }
      });
    }
    nodes.push({
      id: vertex.name,
      label: vertex.name,
      level: vertex,
      status: vertex.data?.status?.reason,
      runAfterTasks,
      data: {
        ...vertex.data,
      },
    });
  });
  // Todo: the edges forming logic should be replaced by pf pipeline framework's edge forming method.
  const edges = nodes.reduce((acc, node) => {
    if (node.runAfterTasks) {
      node.runAfterTasks.forEach((dep) => {
        acc.push({
          id: `${dep}-${node.id}`,
          source: dep,
          target: node.id,
        });
      });
    }
    return acc;
  }, []);

  return { nodes, edges };
};

export const getPipelineRunDataModel = (pipelineRun: PipelineRunKind) => {
  if (!pipelineRun?.status?.pipelineSpec) {
    return null;
  }
  return getGraphDataModel(getPipelineFromPipelineRun(pipelineRun), pipelineRun);
};

export const getPipelineDataModel = (pipeline: PipelineKind) => {
  if (!pipeline) {
    return null;
  }
  return getGraphDataModel(pipeline);
};
