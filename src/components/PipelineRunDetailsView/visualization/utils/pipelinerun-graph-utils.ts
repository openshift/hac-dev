import {
  DEFAULT_LAYERS,
  ElementModel,
  getEdgesFromNodes,
  getSpacerNodes,
  GraphElement,
  ModelKind,
  Node,
  WhenStatus,
} from '@patternfly/react-topology';
import { uniq } from 'lodash-es';
import find from 'lodash/find';
import merge from 'lodash/merge';
import minBy from 'lodash/minBy';
import { formatPrometheusDuration } from '../../../../shared/components/timestamp/datetime';
import {
  TaskRunKind,
  TaskRunStatus,
  TektonResourceLabel,
  PipelineKind,
  PipelineTask,
  PipelineRunKind,
  PLRTaskRunStep,
} from '../../../../types';
import {
  calculateDuration,
  conditionsRunStatus,
  pipelineRunStatus,
  runStatus,
} from '../../../../utils/pipeline-utils';
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
import {
  PipelineRunNodeData,
  PipelineRunNodeModel,
  PipelineRunNodeType,
  PipelineTaskStatus,
  PipelineTaskWithStatus,
  StepStatus,
} from '../types';

enum TerminatedReasons {
  Completed = 'Completed',
}

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

const getMatchingStep = (stepName: string, status: PipelineTaskStatus): PLRTaskRunStep => {
  const statusSteps: PLRTaskRunStep[] = status.steps || [];
  return statusSteps.find((statusStep) => {
    // In rare occasions the status step name is prefixed with `step-`
    // This is likely a bug but this workaround will be temporary as it's investigated separately
    return statusStep.name === stepName || statusStep.name === `step-${stepName}`;
  });
};

const getStepDuration = (matchingStep?: PLRTaskRunStep) => {
  if (!matchingStep) return '';

  if (matchingStep.terminated) {
    return calculateDuration(matchingStep.terminated.startedAt, matchingStep.terminated.finishedAt);
  }

  if (matchingStep.running) {
    return calculateDuration(matchingStep.running.startedAt);
  }

  return '';
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

export const createStepStatus = (stepName: string, status: PipelineTaskStatus): StepStatus => {
  let stepRunStatus: runStatus = runStatus.Pending;
  let duration: string = null;

  const matchingStep: PLRTaskRunStep = getMatchingStep(stepName, status);
  if (!status || !status.reason) {
    stepRunStatus = runStatus.Cancelled;
  } else {
    if (!matchingStep) {
      stepRunStatus = runStatus.Pending;
    } else if (matchingStep.terminated) {
      stepRunStatus =
        matchingStep.terminated.reason === TerminatedReasons.Completed
          ? runStatus.Succeeded
          : runStatus.Failed;
      duration = getStepDuration(matchingStep) || status.duration;
    } else if (matchingStep.running) {
      stepRunStatus = runStatus.Running;
      duration = getStepDuration(matchingStep);
    } else if (matchingStep.waiting) {
      stepRunStatus = runStatus.Pending;
    }
  }

  return {
    duration,
    name: stepName,
    status: stepRunStatus,
  };
};

/**
 * Appends the pipeline run status to each tasks in the pipeline.
 * @param pipeline
 * @param pipelineRun
 * @param isFinallyTasks
 */
export const appendStatus = (
  pipeline: PipelineKind,
  pipelineRun: PipelineRunKind,
  taskRuns: TaskRunKind[],
  isFinallyTasks = false,
): PipelineTaskWithStatus[] => {
  const tasks = (isFinallyTasks ? pipeline.spec.finally : pipeline.spec.tasks) || [];
  const overallPipelineRunStatus = pipelineRunStatus(pipelineRun);

  return tasks.map((task) => {
    if (!pipelineRun?.status) {
      return merge(task, { status: { reason: runStatus.Pending } });
    }
    if (!taskRuns || taskRuns.length === 0) {
      return merge({}, task, { status: { reason: overallPipelineRunStatus } });
    }

    const taskRun = find(
      taskRuns,
      (tr) => tr.metadata.labels[TektonResourceLabel.pipelineTask] === task.name,
    );
    const taskStatus: TaskRunStatus = taskRun?.status;

    const mTask: PipelineTaskWithStatus = merge(task, {
      status: { ...taskStatus, reason: runStatus.Pending },
    });

    // append task duration
    if (mTask.status.completionTime && mTask.status.startTime) {
      const date =
        new Date(mTask.status.completionTime).getTime() -
        new Date(mTask.status.startTime).getTime();
      mTask.status.duration = formatPrometheusDuration(date);
    }
    // append task status
    if (!taskStatus) {
      const isSkipped = !!pipelineRun.status.skippedTasks?.find((t) => t.name === task.name);
      if (isSkipped) {
        mTask.status.reason = runStatus.Skipped;
      } else {
        mTask.status.reason = runStatus.Idle;
      }
    } else if (mTask.status.conditions) {
      mTask.status.reason = conditionsRunStatus(mTask.status.conditions);
    }

    // Determine any task test status
    if (taskRun?.status?.taskResults) {
      const testOutput = taskRun?.status?.taskResults.find(
        (result) => result.name === 'HACBS_TEST_OUTPUT',
      );
      if (testOutput) {
        try {
          const outputValues = JSON.parse(testOutput.value);
          mTask.status.testFailCount = parseInt(outputValues.failures, 10);
          mTask.status.testWarnCount = parseInt(outputValues.warnings, 10);
          if (mTask.status.reason === runStatus.Succeeded) {
            switch (outputValues.result) {
              case 'FAILURE':
              case 'ERROR':
                mTask.status.reason = runStatus.Failed;
                break;
              case 'WARNING':
                mTask.status.reason = runStatus.Cancelled;
                break;
              case 'SKIPPED':
                mTask.status.reason = runStatus.Skipped;
                break;
              default:
                break;
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }
    // Get the steps status
    const stepList = taskStatus?.steps || mTask?.steps || mTask?.taskSpec?.steps || [];
    mTask.steps = stepList.map((step) => createStepStatus(step.name, mTask.status));

    return mTask;
  });
};

export const taskHasWhenExpression = (task: PipelineTask): boolean => task?.when?.length > 0;

export const nodesHasWhenExpression = (nodes: PipelineMixedNodeModel[]): boolean =>
  nodes.some((n) => taskHasWhenExpression(n.data?.task));

export const getWhenStatus = (status: runStatus): WhenStatus => {
  switch (status) {
    case runStatus.Succeeded:
    case runStatus.Failed:
      return WhenStatus.Met;
    case runStatus.Skipped:
    case runStatus['In Progress']:
    case runStatus.Idle:
      return WhenStatus.Unmet;
    default:
      return undefined;
  }
};

export const taskWhenStatus = (task: PipelineTaskWithStatus): WhenStatus | undefined => {
  if (!task.when) {
    return undefined;
  }

  return getWhenStatus(task.status?.reason);
};

const getBadgeWidth = (data: PipelineRunNodeData, font: string = '0.875rem RedHatText'): number => {
  const BADGE_PADDING = 24; // 8 before the badge and 8 on each side of the text inside the badge
  if (!data.testFailCount && !data.testWarnCount) {
    return 0;
  }
  return BADGE_PADDING + getTextWidth(`${data.testFailCount || data.testWarnCount}`, font);
};

const getGraphDataModel = (
  pipeline: PipelineKind,
  pipelineRun?: PipelineRunKind,
  taskRuns?: TaskRunKind[],
) => {
  const taskList = appendStatus(pipeline, pipelineRun, taskRuns);

  const dag = new DAG();
  taskList?.forEach((task: PipelineTask) => {
    dag.addEdges(task.name, task, '', task.runAfter || []);
  });

  const nodes = [];
  const maxWidthForLevel = {};
  dag.topologicalSort((v: Vertex) => {
    if (!maxWidthForLevel[v.level]) {
      maxWidthForLevel[v.level] = getTextWidth(v.name) + getBadgeWidth(v.data);
    } else {
      maxWidthForLevel[v.level] = Math.max(
        maxWidthForLevel[v.level],
        getTextWidth(v.name) + getBadgeWidth(v.data),
      );
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

    const node: PipelineRunNodeModel<PipelineRunNodeData, PipelineRunNodeType> = {
      id: vertex.name,
      type: PipelineRunNodeType.TASK_NODE,
      label: vertex.name,
      runAfterTasks,
      width: maxWidthForLevel[vertex.level] + NODE_PADDING * 2 + NODE_ICON_WIDTH,
      height: DEFAULT_NODE_HEIGHT,
      data: {
        namespace: pipelineRun.metadata.namespace,
        status: vertex.data.status?.reason,
        testFailCount: vertex.data.status.testFailCount,
        testWarnCount: vertex.data.status.testWarnCount,
        whenStatus: taskWhenStatus(vertex.data),
        task: vertex.data,
        steps: vertex.data.steps,
        taskRun: taskRuns.find(
          (tr) => tr.metadata.labels[TektonResourceLabel.pipelineTask] === vertex.data.name,
        ),
      },
    };
    nodes.push(node);
  });

  const finallyTaskList = appendStatus(pipeline, pipelineRun, taskRuns, true);

  const maxFinallyNodeName =
    finallyTaskList.sort((a, b) => b.name.length - a.name.length)[0]?.name || '';
  const finallyNodes = finallyTaskList.map((fTask) => ({
    type: PipelineRunNodeType.FINALLY_NODE,
    id: fTask.name,
    label: fTask.name,
    runAfterTasks: [],
    width: getTextWidth(maxFinallyNodeName) + NODE_PADDING * 2 + DEFAULT_FINALLLY_GROUP_PADDING * 2,
    height: DEFAULT_NODE_HEIGHT,
    data: {
      namespace: pipelineRun.metadata.namespace,
      status: fTask.status.reason,
      whenStatus: taskWhenStatus(fTask),
      task: fTask,
      taskRun: taskRuns.find(
        (tr) => tr.metadata.labels[TektonResourceLabel.pipelineTask] === fTask.name,
      ),
    },
  }));
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
      y: finallyGroup.length ? 50 : 40,
      x: 15,
    },
    nodes: allNodes,
    edges,
  };
};

export const getPipelineRunDataModel = (pipelineRun: PipelineRunKind, taskRuns: TaskRunKind[]) => {
  if (!pipelineRun?.status?.pipelineSpec) {
    return null;
  }
  return getGraphDataModel(getPipelineFromPipelineRun(pipelineRun), pipelineRun, taskRuns);
};

export const isTaskNode = (e?: GraphElement): e is Node<ElementModel, PipelineRunNodeData> =>
  e?.getType() === PipelineRunNodeType.TASK_NODE ||
  e?.getType() === PipelineRunNodeType.FINALLY_NODE;

export const scrollNodeIntoView = (node: Node, scrollPane: HTMLElement) => {
  const targetNode = scrollPane.querySelector(`[data-id=${node.getId()}]`);
  if (targetNode) {
    if (scrollPane.ownerDocument.defaultView.navigator.userAgent.search('Firefox') !== -1) {
      // Fix for firefox which does not take into consideration the full SVG node size with #scrollIntoView
      let left: number = null;
      const nodeBounds = node.getBounds();
      const scrollLeftEdge = nodeBounds.x;
      const scrollRightEdge = nodeBounds.x + nodeBounds.width - scrollPane.offsetWidth;
      if (scrollPane.scrollLeft < scrollRightEdge) {
        left = scrollRightEdge;
      } else if (scrollPane.scrollLeft > scrollLeftEdge) {
        left = scrollLeftEdge;
      }
      if (left != null) {
        scrollPane.scrollTo({ left, behavior: 'smooth' });
      }
    } else {
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }
};
