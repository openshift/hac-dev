import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { Node, PipelineNodeModel, RunStatus } from '@patternfly/react-topology';
import {
  pipelineRunFilterReducer,
  pipelineRunStatus,
  runStatus,
} from '../../../../../../../shared';
import { PipelineRunKind } from '../../../../../../../shared/components/pipeline-run-logs/types';
import { ComponentKind } from '../../../../../../../types';
import { GitOpsDeploymentHealthStatus } from '../../../../../../../types/gitops-deployment';
import { BUILD_COMPONENT_LABEL } from '../../../../../../../utils/const';
import { DEFAULT_NODE_HEIGHT } from '../../../../../topology/const';
import { NodeType } from '../const';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { getNodeWidth } from './visualization-utils';

const UNKNOWN_STATUS = 'unknown';
const NEEDS_MERGE_STATUS = 'PR needs merge';

const RUN_STATUS_SEVERITIES = [
  UNKNOWN_STATUS,
  runStatus.Succeeded,
  runStatus.Idle,
  runStatus.Skipped,
  runStatus.Pending,
  runStatus['In Progress'],
  runStatus.PipelineNotStarted,
  runStatus.Running,
  NEEDS_MERGE_STATUS,
  runStatus.Cancelled,
  runStatus.FailedToStart,
  runStatus.Failed,
];

const BUILD_PIPELINE_STATUSES: string[] = [
  runStatus.Succeeded,
  runStatus['In Progress'],
  runStatus.Running,
];

const COMPONENT_DESC =
  'A component is an image built from code in a source repository. Applications are sets of components that run together on environments.';
const BUILD_DESC = `Every component requires a build in order to deploy it to an environment. Whenever you create a new component, we send a pull request to merge our build pipeline to your component's source code`;
const TESTS_DESC = `An integration test is a test pipeline you build and add to the application CI/CD definition. It tests each component as it’s added and then tests the entire application as a whole.`;
const STATIC_ENV_DESC = `A static environment is a set of compute resources bundled together. Use static environments for developing, testing, and staging before releasing your application. You can share static environments across all applications within the workspace.`;
const RELEASE_DESC = `After pushing your application to release, your application goes through a series of tests through the release pipeline to ensure the application complies with the  release policy set on the release target, also known as the "managed environment".`;
const MANAGED_ENV_DESC = `A managed environment is your application release target. This release target is an external environment, set up in an external workspace, and managed by another team. It is set for each application and not automatically shared among applications within the workspace.`;

export const TYPE_DESCRIPTIONS = {
  [WorkflowNodeType.COMPONENT]: COMPONENT_DESC,
  [WorkflowNodeType.BUILD]: BUILD_DESC,
  [WorkflowNodeType.TESTS]: TESTS_DESC,
  [WorkflowNodeType.COMPONENT_TEST]: TESTS_DESC,
  [WorkflowNodeType.APPLICATION_TEST]: TESTS_DESC,
  [WorkflowNodeType.STATIC_ENVIRONMENT]: STATIC_ENV_DESC,
  [WorkflowNodeType.RELEASE]: RELEASE_DESC,
  [WorkflowNodeType.MANAGED_ENVIRONMENT]: MANAGED_ENV_DESC,
};

export const statusToRunStatus = (status: string): RunStatus => {
  switch (status) {
    case runStatus.Succeeded:
    case GitOpsDeploymentHealthStatus.Healthy:
      return RunStatus.Succeeded;
    case runStatus.Failed:
    case runStatus.FailedToStart:
    case GitOpsDeploymentHealthStatus.Degraded:
      return RunStatus.Failed;
    case runStatus.Running:
    case GitOpsDeploymentHealthStatus.Progressing:
    case runStatus['In Progress']:
      return RunStatus.Running;
    case 'PR needs merge':
      return RunStatus.Cancelled; // to show a warning
    case RunStatus.Pending:
    case GitOpsDeploymentHealthStatus.Suspended:
    case GitOpsDeploymentHealthStatus.Missing:
    case GitOpsDeploymentHealthStatus.Unknown:
      return RunStatus.Pending;
    default:
      return undefined;
  }
};

export const getLinkForElement = (
  element: Node<PipelineNodeModel, WorkflowNodeModelData>,
): { tab: string; filter?: { name: string; value: string } } => {
  const { workflowType, label, isDisabled, resources, groupNode, status } = element.getData();

  switch (workflowType) {
    case WorkflowNodeType.COMPONENT:
      return {
        tab: 'components',
        filter: !groupNode && !isDisabled ? { name: 'name', value: label } : undefined,
      };
    case WorkflowNodeType.BUILD:
      if (BUILD_PIPELINE_STATUSES.includes(status)) {
        return {
          tab: 'pipelineruns',
          // TODO: filter by build once the PLR tab supports filtering
        };
      }
      return {
        tab: 'components',
        filter:
          !groupNode && !isDisabled
            ? { name: 'name', value: resources?.[0]?.metadata.labels?.[BUILD_COMPONENT_LABEL] }
            : undefined,
      };
    case WorkflowNodeType.TESTS:
    case WorkflowNodeType.COMPONENT_TEST:
    case WorkflowNodeType.APPLICATION_TEST:
      return {
        tab: 'integrationtests',
        filter: !groupNode && !isDisabled ? { name: 'name', value: label } : undefined,
      };
    case WorkflowNodeType.STATIC_ENVIRONMENT:
      return {
        tab: 'environments',
        filter:
          !groupNode && !isDisabled
            ? { name: 'name', value: label }
            : { name: 'envType', value: 'static' },
      };
    case WorkflowNodeType.MANAGED_ENVIRONMENT:
    case WorkflowNodeType.RELEASE:
      return {
        tab: 'environments',
        filter:
          !groupNode && !isDisabled
            ? { name: 'name', value: label }
            : { name: 'envType', value: 'managed' },
      };
    default:
      return {
        tab: 'overview',
      };
  }
};

export const getRunStatusComponent = (component, pipelineRuns: PipelineRunKind[]) => {
  const latestPipelineRun = pipelineRuns
    .filter((pr) => pr.metadata.labels?.[BUILD_COMPONENT_LABEL] === component.metadata.name)
    .sort(
      (a, b) =>
        new Date(b.metadata.creationTimestamp).getTime() -
        new Date(a.metadata.creationTimestamp).getTime(),
    )?.[0];
  return latestPipelineRun ? pipelineRunFilterReducer(latestPipelineRun) : NEEDS_MERGE_STATUS;
};

export const worstWorkflowStatus = (workFlows: PipelineNodeModel[]) =>
  workFlows.reduce((worstStatus, c) => {
    const statusSeverity = RUN_STATUS_SEVERITIES.indexOf(c.data.status) || 0;
    if (statusSeverity > RUN_STATUS_SEVERITIES.indexOf(worstStatus)) {
      return c.data.status;
    }
    return worstStatus;
  }, '');

export const resourceToPipelineNode = (
  resource: K8sResourceCommon,
  workflowType: WorkflowNodeType,
  runAfterTasks: string[] = [],
  status?: runStatus | string,
  label?: string,
): WorkflowNodeModel<WorkflowNodeModelData> => ({
  id: resource.metadata.uid,
  label: label || resource.metadata.name,
  type: NodeType.WORKFLOW_NODE,
  height: DEFAULT_NODE_HEIGHT,
  width: getNodeWidth(resource.metadata.name, status),
  runAfterTasks,
  data: {
    label: label || resource.metadata.name,
    workflowType,
    status,
    resources: [resource],
  },
});

export const emptyPipelineNode = (
  id: string,
  label: string,
  workflowType: WorkflowNodeType,
  runAfterTasks: string[] = [],
): WorkflowNodeModel<WorkflowNodeModelData> => ({
  id,
  label: `No ${label.toLowerCase()} set`,
  type: NodeType.WORKFLOW_NODE,
  height: DEFAULT_NODE_HEIGHT,
  width: getNodeWidth(`No ${label.toLowerCase()} set`),
  runAfterTasks,
  data: {
    label,
    isDisabled: true,
    workflowType,
  },
});

export const groupToPipelineNode = (
  id: string,
  label: string,
  workflowType: WorkflowNodeType,
  runAfterTasks: string[] = [],
  group: boolean,
  children?: string[],
  childNodes?: WorkflowNodeModel<WorkflowNodeModelData>[],
  resources?: K8sResourceCommon[],
  status?: runStatus | string,
): WorkflowNodeModel<WorkflowNodeModelData> => {
  const isDisabled = !resources?.length;
  return {
    id,
    label: isDisabled && !group ? `No ${label.toLowerCase()} set` : label,
    height: DEFAULT_NODE_HEIGHT,
    type: group ? NodeType.WORKFLOW_GROUP : NodeType.WORKFLOW_NODE,
    width: getNodeWidth(label, status, group ? undefined : children),
    group,
    children,
    runAfterTasks: group ? [] : runAfterTasks,
    style: { padding: [35] },
    data: {
      label,
      workflowType,
      isDisabled,
      groupNode: !group,
      status,
      resources,
      children: !isDisabled ? childNodes : undefined,
    },
  };
};

export const getBuildNodeForComponent = (
  component: ComponentKind,
  latestBuilds: PipelineRunKind[],
): WorkflowNodeModel<WorkflowNodeModelData> => {
  const latestbuild = latestBuilds.find(
    (build) => component.metadata.name === build.metadata.labels?.[BUILD_COMPONENT_LABEL],
  );
  if (latestbuild) {
    return resourceToPipelineNode(
      latestbuild,
      WorkflowNodeType.BUILD,
      [component.metadata.uid],
      pipelineRunStatus(latestbuild),
      `Build for ${component.metadata.name}`,
    );
  }
  return {
    id: `${component.metadata.uid}-missing`,
    label: '',
    type: NodeType.WORKFLOW_NODE,
    height: 0,
    width: 0,
    runAfterTasks: [component.metadata.uid],
    data: {
      label: '',
      isDisabled: true,
      workflowType: WorkflowNodeType.BUILD,
      hidden: true,
    },
  };
};
