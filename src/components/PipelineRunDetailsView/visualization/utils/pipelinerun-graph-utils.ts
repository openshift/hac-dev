import {
  DEFAULT_LAYERS,
  ElementModel,
  getEdgesFromNodes,
  getSpacerNodes,
  GraphElement,
  GraphModel,
  ModelKind,
  Node,
  WhenStatus,
} from '@patternfly/react-topology';
import { PipelineNodeModel } from '@patternfly/react-topology/src/pipelines/types';
import { SCAN_RESULT } from '../../../../hooks/useClairScanResults';
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
import { pipelineRunStatus, runStatus, taskRunStatus } from '../../../../utils/pipeline-utils';
import { NodeType } from '../../../ApplicationDetails/tabs/overview/visualization/const';
import {
  PipelineEdgeModel,
  PipelineMixedNodeModel,
} from '../../../ApplicationDetails/tabs/overview/visualization/types';
import {
  getLabelWidth,
  getTextWidth,
} from '../../../ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import { DEFAULT_FINALLLY_GROUP_PADDING, DEFAULT_NODE_HEIGHT } from '../../../topology/const';
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

const getMatchingStep = (
  stepName: string,
  status: PipelineTaskStatus,
): [PLRTaskRunStep, PLRTaskRunStep] => {
  const statusSteps: PLRTaskRunStep[] = status?.steps || [];
  let prevStep: PLRTaskRunStep = null;
  const result = statusSteps.find((statusStep) => {
    // In rare occasions the status step name is prefixed with `step-`
    // This is likely a bug but this workaround will be temporary as it's investigated separately
    const found = statusStep.name === stepName || statusStep.name === `step-${stepName}`;
    if (!found) {
      prevStep = statusStep;
    }
    return found;
  });
  return [result, prevStep];
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
  let startTime: string;
  let endTime: string;

  const [matchingStep, prevStep] = getMatchingStep(stepName, status);
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
      startTime = matchingStep.terminated.startedAt;
      endTime = matchingStep.terminated.finishedAt;
    } else if (matchingStep.running) {
      if (!prevStep) {
        stepRunStatus = runStatus.Running;
        startTime = matchingStep.running.startedAt;
      } else if (prevStep.terminated) {
        stepRunStatus = runStatus.Running;
        startTime = prevStep.terminated.finishedAt;
      } else {
        stepRunStatus = runStatus.Pending;
      }
    } else if (matchingStep.waiting) {
      stepRunStatus = runStatus.Pending;
    }
  }

  return {
    startTime,
    endTime,
    name: stepName,
    status: stepRunStatus,
  };
};

/**
 * Appends the pipeline run status to each tasks in the pipeline.
 * @param pipeline
 * @param pipelineRun
 * @param taskRuns
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
      return { ...task, status: { reason: runStatus.Pending } };
    }
    if (!taskRuns || taskRuns.length === 0) {
      return { ...task, status: { reason: overallPipelineRunStatus } };
    }

    const taskRun = taskRuns.find(
      (tr) => tr.metadata.labels[TektonResourceLabel.pipelineTask] === task.name,
    );
    const taskStatus: TaskRunStatus = taskRun?.status;

    const mTask: PipelineTaskWithStatus = {
      ...task,
      status: { ...taskStatus, reason: runStatus.Pending },
    };

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
      mTask.status.reason = taskRunStatus(taskRun);
    }

    // Determine any task test status
    if (taskRun?.status?.taskResults) {
      const testOutput = taskRun?.status?.taskResults.find(
        (result) => result.name === 'HACBS_TEST_OUTPUT' || result.name === 'TEST_OUTPUT',
      );
      if (testOutput) {
        try {
          const outputValues = JSON.parse(testOutput.value);
          mTask.status.testFailCount = parseInt(outputValues.failures, 10);
          mTask.status.testWarnCount = parseInt(outputValues.warnings, 10);
        } catch (e) {
          // ignore
        }
      }
      const scanResult = taskRun?.status?.taskResults?.find(
        (result) => result.name === SCAN_RESULT,
      );

      if (scanResult) {
        try {
          mTask.status.scanResults = JSON.parse(scanResult.value);
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

export const getTaskBadgeCount = (data: PipelineRunNodeData): number =>
  (data.testFailCount ?? 0) + (data.testWarnCount ?? 0) ||
  (data.scanResults?.vulnerabilities?.critical ?? 0) +
    (data.scanResults?.vulnerabilities?.high ?? 0) +
    (data.scanResults?.vulnerabilities?.medium ?? 0) +
    (data.scanResults?.vulnerabilities?.low ?? 0);

const getBadgeWidth = (data: PipelineRunNodeData, font: string = '0.875rem RedHatText'): number => {
  const BADGE_PADDING = 24; // 8 before the badge and 8 on each side of the text inside the badge
  const badgeCount = getTaskBadgeCount(data);

  if (!badgeCount) {
    return 0;
  }
  return BADGE_PADDING + getTextWidth(`${badgeCount}`, font);
};

const getNodeLevel = (
  node: PipelineRunNodeModel<PipelineRunNodeData, PipelineRunNodeType>,
  allNodes: PipelineRunNodeModel<PipelineRunNodeData, PipelineRunNodeType>[],
) => {
  const children = allNodes.filter((n) => n.runAfterTasks?.includes(node.label));
  if (!children.length) {
    return 0;
  }
  const maxChildLevel = children.reduce(
    (maxLevel, child) => Math.max(getNodeLevel(child, allNodes), maxLevel),
    0,
  );

  return maxChildLevel + 1;
};

const hasParentDep = (
  dep: string,
  otherDeps: string[],
  nodes: PipelineRunNodeModel<PipelineRunNodeData, PipelineRunNodeType>[],
): boolean => {
  if (!otherDeps?.length) {
    return false;
  }

  for (const otherDep of otherDeps) {
    if (otherDep === dep) {
      continue;
    }
    const depNode = nodes.find((n) => n.id === otherDep);
    if (depNode.runAfterTasks?.includes(dep) || hasParentDep(dep, depNode.runAfterTasks, nodes)) {
      return true;
    }
  }
  return false;
};

const getGraphDataModel = (
  pipeline: PipelineKind,
  pipelineRun?: PipelineRunKind,
  taskRuns?: TaskRunKind[],
): {
  graph: GraphModel;
  nodes: (PipelineRunNodeModel<PipelineRunNodeData, PipelineRunNodeType> | PipelineNodeModel)[];
  edges: PipelineEdgeModel[];
} => {
  const taskList = appendStatus(pipeline, pipelineRun, taskRuns);

  const nodes: PipelineRunNodeModel<PipelineRunNodeData, PipelineRunNodeType>[] = taskList.map(
    (task) => {
      const runAfterTasks = [...(task.runAfter || [])];
      if (task.params) {
        task.params.map((p) => {
          if (Array.isArray(p.value)) {
            p.value.forEach((paramValue) => {
              runAfterTasks.push(...extractDepsFromContextVariables(paramValue));
            });
          } else {
            runAfterTasks.push(...extractDepsFromContextVariables(p.value));
          }
        });
      }
      if (task?.when) {
        task.when.forEach(({ input, values }) => {
          runAfterTasks.push(...extractDepsFromContextVariables(input));
          values.forEach((whenValue) => {
            runAfterTasks.push(...extractDepsFromContextVariables(whenValue));
          });
        });
      }

      return {
        id: task.name,
        type: PipelineRunNodeType.TASK_NODE,
        label: task.name,
        runAfterTasks,
        height: DEFAULT_NODE_HEIGHT,
        data: {
          namespace: pipelineRun.metadata.namespace,
          status: task.status?.reason,
          testFailCount: task.status.testFailCount,
          testWarnCount: task.status.testWarnCount,
          scanResults: task.status.scanResults,
          whenStatus: taskWhenStatus(task),
          task,
          steps: task.steps,
          taskRun: taskRuns.find(
            (tr) => tr.metadata.labels[TektonResourceLabel.pipelineTask] === task.name,
          ),
        },
      };
    },
  );

  // Remove extraneous dependencies
  nodes.forEach(
    (taskNode) =>
      (taskNode.runAfterTasks = taskNode.runAfterTasks.filter(
        (dep) => !hasParentDep(dep, taskNode.runAfterTasks, nodes),
      )),
  );

  // Set the level and width of each node
  nodes.forEach((taskNode) => {
    taskNode.data.level = getNodeLevel(taskNode, nodes);
    taskNode.width = getLabelWidth(taskNode.label) + getBadgeWidth(taskNode.data);
  });

  // Set the width of nodes to the max width for it's level
  nodes.forEach((taskNode) => {
    const levelNodes = nodes.filter((n) => n.data.level === taskNode.data.level);
    taskNode.width = levelNodes.reduce((maxWidth, n) => Math.max(n.width, maxWidth), 0);
  });

  const finallyTaskList = appendStatus(pipeline, pipelineRun, taskRuns, true);

  const maxFinallyNodeName =
    finallyTaskList.sort((a, b) => b.name.length - a.name.length)[0]?.name || '';
  const finallyNodes = finallyTaskList.map((fTask) => ({
    type: PipelineRunNodeType.FINALLY_NODE,
    id: fTask.name,
    label: fTask.name,
    runAfterTasks: [],
    width: getLabelWidth(maxFinallyNodeName),
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
    NodeType.SPACER_NODE,
    [PipelineRunNodeType.FINALLY_NODE],
  );

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
      id: 'pipelinerun-vis-graph',
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
  const targetNode = scrollPane.querySelector(`[data-id="${node.getId()}"]`);
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
