import { Node, PipelineNodeModel, RunStatus } from '@patternfly/react-topology';
import { runStatus } from '../../../../../../../shared';
import { GitOpsDeploymentHealthStatus } from '../../../../../../../types/gitops-deployment';
import { BUILD_COMPONENT_LABEL } from '../../../../../../../utils/const';
import { WorkflowNodeModelData, WorkflowNodeType } from '../types';

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
  const { workflowType, label, isDisabled, resources, groupNode } = element.getData();

  switch (workflowType) {
    case WorkflowNodeType.COMPONENT:
      return {
        tab: 'components',
        filter: !groupNode && !isDisabled ? { name: 'name', value: label } : undefined,
      };
    case WorkflowNodeType.BUILD:
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
    case WorkflowNodeType.MANAGED_ENVIRONMENT:
      return {
        tab: 'environments',
        filter: !groupNode && !isDisabled ? { name: 'name', value: label } : undefined,
      };
    case WorkflowNodeType.RELEASE:
      return {
        tab: 'pipelineruns',
      };
    default:
      return {
        tab: 'overview',
      };
  }
};
