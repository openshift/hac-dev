import { useNamespace } from '../../../../../../../utils/namespace-context-utils';
import {
  useComponents,
  useEnvironments,
  useIntegrationTestScenarios,
  useReleaseLinks,
  useBuildPipelines,
} from '../../../../../../hooks';
import { Workflow, WorkflowNode, WorkflowNodeType } from '../types';
import { getLastEnvironments, workflowToNodes } from '../utils/visualization-utils';

export const useAppWorkflowData = (
  applicationName: string,
): [nodes: WorkflowNode[], loaded: boolean] => {
  const namespace = useNamespace();

  const [components, componentsLoaded] = useComponents(namespace, applicationName);
  const [integrationTestScenario, integrationTestsLoaded] = useIntegrationTestScenarios(
    namespace,
    applicationName,
  );
  const [environments, environmentsLoaded] = useEnvironments(namespace);
  const [releaseLinks, releaseLinksLoaded] = useReleaseLinks(namespace);
  const [buildPipelines] = useBuildPipelines(namespace, applicationName);
  let componentIntegrationTests = [];
  let applicationIntegrationTests = [];

  const allResourcesLoaded: boolean =
    componentsLoaded && integrationTestsLoaded && environmentsLoaded && releaseLinksLoaded;

  if (!allResourcesLoaded) {
    return [[], allResourcesLoaded];
  }

  componentIntegrationTests = integrationTestScenario?.filter((test) => {
    const contexts = test?.spec?.contexts;
    return contexts?.some((c) => c.name === 'component') ?? false;
  });

  applicationIntegrationTests = integrationTestScenario?.filter((test) => {
    const contexts = test?.spec?.contexts;
    return contexts?.some((c) => c.name === 'application') ?? false;
  });

  const getNodeNames = (resources): string[] => resources?.map((r) => r?.metadata?.name);
  const isResourcesAvailable = (resources): boolean => resources?.length > 0;

  const workflowObject: Workflow = {
    components: {
      id: 'components',
      isAbstractNode: true,
      data: {
        label: 'Components',
        workflowType: WorkflowNodeType.SOURCE,
        isDisabled: components.length === 0,
        resources: components,
      },
      runBefore: [],
      runAfter: [],
    },
    builds: {
      id: 'build',
      isAbstractNode: true,
      data: {
        label: 'Builds',
        workflowType: WorkflowNodeType.PIPELINE,
        isDisabled: buildPipelines.length === 0,
        resources: buildPipelines,
      },
      runBefore: [],
      runAfter: ['components'],
    },
    componentTests: {
      id: 'component-integration-test',
      data: {
        label: 'component integration test',
        workflowType: WorkflowNodeType.PIPELINE,
        isDisabled: componentIntegrationTests.length === 0,
        resources: componentIntegrationTests,
      },
      runBefore: [],
      runAfter: ['build'],
    },
    applicationTests: {
      id: 'application-integration-test',
      data: {
        label: 'app integration test',
        workflowType: WorkflowNodeType.PIPELINE,
        isDisabled: applicationIntegrationTests.length === 0,
        resources: applicationIntegrationTests,
      },
      runBefore: [],
      runAfter: isResourcesAvailable(componentIntegrationTests)
        ? getNodeNames(componentIntegrationTests)
        : ['component-integration-test'],
    },
    staticEnv: {
      id: 'static-env',
      data: {
        label: 'environment',
        workflowType: WorkflowNodeType.ENVIRONMENT,
        isDisabled: environments.length === 0,
        resources: environments,
      },
      runBefore: [],
      runAfterResourceKey: 'spec.parentEnvironment',
      runAfter: isResourcesAvailable(applicationIntegrationTests)
        ? getNodeNames(applicationIntegrationTests)
        : ['application-integration-test'],
    },
    releaseLink: {
      id: 'release-links',
      data: {
        label: 'managed environment',
        workflowType: WorkflowNodeType.ENVIRONMENT,
        isDisabled: releaseLinks.length === 0,
        resources: releaseLinks,
      },
      runBefore: [],
      runAfter: isResourcesAvailable(environments)
        ? getLastEnvironments(environments)
        : ['static-env'],
    },
  };

  const nodes: WorkflowNode[] = workflowToNodes(workflowObject);

  return [nodes, allResourcesLoaded];
};
