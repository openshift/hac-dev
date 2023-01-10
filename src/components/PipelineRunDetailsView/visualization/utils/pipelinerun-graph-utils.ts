import {
  DEFAULT_LAYERS,
  getEdgesFromNodes,
  getSpacerNodes,
  ModelKind,
  RunStatus,
  WhenStatus,
} from '@patternfly/react-topology';
import { uniq } from 'lodash-es';
import find from 'lodash/find';
import merge from 'lodash/merge';
import minBy from 'lodash/minBy';
import { pipelineRunStatus } from '../../../../shared';
import { formatPrometheusDuration } from '../../../../shared/components/timestamp/datetime';
import { PipelineKind, PipelineTask } from '../../../../types/pipeline';
import { PipelineRunKind } from '../../../../types/pipeline-run';
import {
  NODE_ICON_WIDTH,
  NODE_PADDING,
} from '../../../ApplicationDetails/tabs/overview/visualization/const';
import {
  PipelineEdgeModel,
  PipelineMixedNodeModel,
} from '../../../ApplicationDetails/tabs/overview/visualization/types';
import {
  createSpacerNode,
  getTextWidth,
} from '../../../ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import { DEFAULT_FINALLLY_GROUP_PADDING, DEFAULT_NODE_HEIGHT } from '../../../topology/const';
import { DAG, Vertex } from '../../../topology/dag';
import { PipelineLayout } from '../../../topology/factories';
import { createGenericNode } from '../../../topology/utils/create-utils';
import {
  PipelineRunNode,
  PipelineRunNodeData,
  PipelineRunNodeType,
  PipelineTaskWithStatus,
} from '../types';

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
export const appendStatus = (
  pipeline,
  pipelineRun,
  isFinallyTasks = false,
): PipelineTaskWithStatus[] => {
  const tasks = (isFinallyTasks ? pipeline.spec.finally : pipeline.spec.tasks) || [];
  const overallPipelineRunStatus = pipelineRunStatus(pipelineRun);
  return tasks.map((task) => {
    if (!pipelineRun?.status) {
      return task;
    }
    if (!pipelineRun?.status?.taskRuns) {
      return merge(task, { status: { reason: overallPipelineRunStatus } });
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
      mTask.status = { reason: RunStatus.Idle };
    } else if (mTask.status && mTask.status.conditions) {
      mTask.status.reason = pipelineRunStatus(mTask) || RunStatus.Idle;
    } else if (mTask.status && !mTask.status.reason) {
      mTask.status.reason = RunStatus.Idle;
    }
    return mTask;
  });
};

export const taskHasWhenExpression = (task: PipelineTask): boolean => task?.when?.length > 0;

export const nodesHasWhenExpression = (nodes: PipelineMixedNodeModel[]): boolean =>
  nodes.some((n) => taskHasWhenExpression(n.data.task));

export const getWhenStatus = (status: RunStatus): string => {
  switch (status) {
    case RunStatus.Succeeded:
    case RunStatus.Failed:
      return WhenStatus.Met;
    case RunStatus.Skipped:
    case RunStatus.InProgress:
    case RunStatus.Idle:
      return WhenStatus.Unmet;
    default:
      return '';
  }
};

const createPipelineRunNode: PipelineRunNode = (
  type: PipelineRunNodeType,
  data: PipelineRunNodeData,
) => createGenericNode(type, data.width, data.height)(data.id, data);

export const taskWhenStatus = (task: PipelineTaskWithStatus) => {
  if (!task.when) {
    return undefined;
  }
  return getWhenStatus(task.status?.reason);
};

const getGraphDataModel = (pipeline: PipelineKind, pipelineRun?: PipelineRunKind) => {
  const taskList = appendStatus(pipeline, pipelineRun);

  const dag = new DAG();
  taskList?.forEach((task: PipelineTask) => {
    dag.addEdges(task.name, task, '', task.runAfter || []);
  });

  const nodes = [];
  const maxWidthForLevel = {};
  dag.topologicalSort((v: Vertex) => {
    if (!maxWidthForLevel[v.level]) {
      maxWidthForLevel[v.level] = getTextWidth(v.name);
    } else {
      maxWidthForLevel[v.level] = Math.max(maxWidthForLevel[v.level], getTextWidth(v.name));
    }
  });
  dag.topologicalSort((vertex: Vertex) => {
    const runAfterTasks = [];
    const task = vertex.data;
    const depsFromContextVariables = [];
    if (task.params) {
      task.params.map((p) => {
        if (Array.isArray(p.value)) {
          p.value.forEach((paramValue) => {
            depsFromContextVariables.push(...extractDepsFromContextVariables(paramValue));
          });
        } else {
          depsFromContextVariables.push(...extractDepsFromContextVariables(p.value));
        }
      });
    }
    if (task?.when) {
      task.when.map(({ input, values }) => {
        depsFromContextVariables.push(...extractDepsFromContextVariables(input));
        values.forEach((whenValue) => {
          depsFromContextVariables.push(...extractDepsFromContextVariables(whenValue));
        });
      });
    }
    const dependancies = uniq([...vertex.dependancyNames]);
    if (dependancies) {
      dependancies.forEach((dep) => {
        const depObj = dag.vertices.get(dep);
        if (depObj.level - vertex.level <= 1 || vertex.data.runAfter?.includes(depObj.name)) {
          runAfterTasks.push(dep);
        }
      });
    }
    if (depsFromContextVariables.length > 0) {
      const v = depsFromContextVariables.map((d) => {
        return dag.vertices.get(d);
      });
      const minLevelDep = minBy(v, (d) => d.level);
      const nearestDeps = v.filter((v1) => v1.level === minLevelDep.level);
      nearestDeps.forEach((nd) => {
        if (nd.level - vertex.level <= 1 || vertex.dependancyNames.length === 0) {
          runAfterTasks.push(nd.name);
        }
      });
    }

    nodes.push(
      createPipelineRunNode(PipelineRunNodeType.TASK_NODE, {
        id: vertex.name,
        label: vertex.name,
        width: maxWidthForLevel[vertex.level] + NODE_PADDING * 2 + NODE_ICON_WIDTH,
        height: DEFAULT_NODE_HEIGHT,
        runAfterTasks,
        status: vertex.data.status?.reason,
        whenStatus: taskWhenStatus(vertex.data),
        task: vertex.data,
      }),
    );
  });

  const finallyTaskList = appendStatus(pipeline, pipelineRun, true);

  const maxFinallyNodeName =
    finallyTaskList.sort((a, b) => b.name.length - a.name.length)[0]?.name || '';
  const finallyNodes = finallyTaskList.map((fTask) =>
    createPipelineRunNode(PipelineRunNodeType.FINALLY_NODE, {
      id: fTask.name,
      label: fTask.name,
      width:
        getTextWidth(maxFinallyNodeName) + NODE_PADDING * 2 + DEFAULT_FINALLLY_GROUP_PADDING * 2,
      height: DEFAULT_NODE_HEIGHT,
      runAfterTasks: [],
      status: fTask.status.reason,
      whenStatus: taskWhenStatus(fTask),
      task: fTask,
    }),
  );
  const finallyGroup = finallyNodes.length
    ? [
        {
          id: 'finally-group-id',
          type: PipelineRunNodeType.FINALLY_GROUP,
          children: finallyNodes.map((n) => n.id),
          group: true,
          style: { padding: DEFAULT_FINALLLY_GROUP_PADDING },
        },
      ]
    : [];
  const spacerNodes: PipelineMixedNodeModel[] = getSpacerNodes(
    [...nodes, ...finallyNodes],
    PipelineRunNodeType.SPACER_NODE,
    [PipelineRunNodeType.FINALLY_NODE],
  ).map(createSpacerNode);

  const edges: PipelineEdgeModel[] = getEdgesFromNodes(
    [...nodes, ...spacerNodes, ...finallyNodes],
    PipelineRunNodeType.SPACER_NODE,
    PipelineRunNodeType.EDGE,
    PipelineRunNodeType.EDGE,
    [PipelineRunNodeType.FINALLY_NODE],
    PipelineRunNodeType.EDGE,
  );
  const allNodes = [...nodes, ...spacerNodes, ...finallyNodes, ...finallyGroup];
  const hasWhenExpression = nodesHasWhenExpression(allNodes);

  return {
    graph: {
      id: 'g1',
      type: ModelKind.graph,
      layout: hasWhenExpression
        ? PipelineLayout.PIPELINERUN_VISUALIZATION_SPACED
        : PipelineLayout.PIPELINERUN_VISUALIZATION,
      layers: DEFAULT_LAYERS,
      y: 50,
      x: 15,
    },
    nodes: allNodes,
    edges,
  };
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
