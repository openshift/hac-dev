import { componentCRMocks } from '../../../../../../ApplicationDetailsView/__data__/mock-data';
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
          'appstudio.openshift.io/pac-provision': 'done',
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
