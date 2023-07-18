import { BUILD_STATUS_ANNOTATION } from '../../../../../../../utils/component-utils';
import { componentCRMocks } from '../../../../../__data__/mock-data';
import { getBuildNodeForComponent } from '../node-utils';

describe('getBuildNodeForComponent', () => {
  it('should return pending status if the build has not started yet for the simple pipeline flow', () => {
    const buildNode = getBuildNodeForComponent(componentCRMocks[0], 'purple-mermaid-app', []);
    expect(buildNode.data.status).toBe('Pending');
  });

  it('should return PR needs merge status only for the componentes with advanced pipeline flow', () => {
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
});
