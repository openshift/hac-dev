import { Node, PipelineNodeModel } from '@patternfly/react-topology';
import { BUILD_STATUS_ANNOTATION } from '../../../../../../../utils/component-utils';
import { runStatus } from '../../../../../../../utils/pipeline-utils';
import { componentCRMocks } from '../../../../../__data__/mock-data';
import { WorkflowNodeModelData, WorkflowNodeType } from '../../types';
import { getBuildNodeForComponent, getLinksForElement } from '../node-utils';

describe('getBuildNodeForComponent', () => {
  it('should return pending status if the build has not started yet for the simple pipeline flow', () => {
    const buildNode = getBuildNodeForComponent(componentCRMocks[0], 'purple-mermaid-app', []);
    expect(buildNode.data.status).toBe('Pending');
  });

  it('should return PR needs merge status only for the components with advanced pipeline flow', () => {
    const componentWithAdvancedPipelineFlow = {
      ...componentCRMocks[0],
      metadata: {
        ...componentCRMocks[0].metadata,
        annotations: {
          [BUILD_STATUS_ANNOTATION]: JSON.stringify({
            pac: { state: 'enabled', 'merge-url': 'example.com' },
          }),
        },
      },
    };
    const buildNode = getBuildNodeForComponent(
      componentWithAdvancedPipelineFlow,
      'purple-mermaid-app',
      [],
    );
    expect(buildNode.data.status).toBe('PR needs merge');
  });

  it('should return correct link data for different component node types', () => {
    // Components group node
    const componentsGroupElement = {
      getData: () => ({
        application: 'test-app',
        workflowType: WorkflowNodeType.COMPONENT,
        groupNode: true,
        name: 'Components',
      }),
      getLabel: () => 'Components',
    };
    let elementLinks = getLinksForElement(
      componentsGroupElement as unknown as Node<PipelineNodeModel, WorkflowNodeModelData>,
      'test-workspace',
    );
    expect(elementLinks.elementRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/components',
    );
    expect(elementLinks.pipelinesRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns',
    );
    expect(elementLinks.appRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app',
    );

    // Component node
    const componentNodeElement = {
      getData: () => ({
        application: 'test-app',
        workflowType: WorkflowNodeType.COMPONENT,
        isDisabled: false,
        groupNode: false,
        status: runStatus.Succeeded,
        name: 'test-component',
        resources: [{ metadata: { name: 'test-build' } }],
      }),
      getLabel: () => 'test-component',
    };
    elementLinks = getLinksForElement(
      componentNodeElement as unknown as Node<PipelineNodeModel, WorkflowNodeModelData>,
      'test-workspace',
    );
    expect(elementLinks.elementRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/components/test-component',
    );
    expect(elementLinks.pipelinesRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns',
    );
    expect(elementLinks.appRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app',
    );
  });

  it('should return correct link data for different build node types', () => {
    // Empty build group node
    const emptyBuildElement = {
      getData: () => ({
        application: 'test-app',
        workflowType: WorkflowNodeType.BUILD,
        isDisabled: true,
        groupNode: true,
        status: runStatus.NeedsMerge,
        name: 'No builds yet',
      }),
      getLabel: () => 'No builds yet',
    };
    let elementLinks = getLinksForElement(
      emptyBuildElement as unknown as Node<PipelineNodeModel, WorkflowNodeModelData>,
      'test-workspace',
    );
    expect(elementLinks.elementRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/components/',
    );
    expect(elementLinks.pipelinesRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns',
    );
    expect(elementLinks.appRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app',
    );

    // Build group node
    const buildGroupElement = {
      getData: () => ({
        application: 'test-app',
        workflowType: WorkflowNodeType.BUILD,
        isDisabled: false,
        groupNode: true,
        status: runStatus.Succeeded,
        name: 'No builds yet',
        resources: [{ metadata: { name: 'test-build' } }],
      }),
      getLabel: () => 'No builds yet',
    };
    elementLinks = getLinksForElement(
      buildGroupElement as unknown as Node<PipelineNodeModel, WorkflowNodeModelData>,
      'test-workspace',
    );
    expect(elementLinks.elementRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns',
    );
    expect(elementLinks.pipelinesRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns',
    );
    expect(elementLinks.appRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app',
    );

    // Build node
    const buildNodeElement = {
      getData: () => ({
        application: 'test-app',
        workflowType: WorkflowNodeType.BUILD,
        isDisabled: false,
        groupNode: false,
        status: runStatus.Succeeded,
        name: 'No builds yet',
        resources: [{ metadata: { name: 'test-build' } }],
      }),
      getLabel: () => 'No builds yet',
    };
    elementLinks = getLinksForElement(
      buildNodeElement as unknown as Node<PipelineNodeModel, WorkflowNodeModelData>,
      'test-workspace',
    );
    expect(elementLinks.elementRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns?name=test-build',
    );
    expect(elementLinks.pipelinesRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app/activity/pipelineruns',
    );
    expect(elementLinks.appRef).toBe(
      '/application-pipeline/workspaces/test-workspace/applications/test-app',
    );
  });
});
