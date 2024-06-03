import { renderHook } from '@testing-library/react';
import { usePipelineTemplates } from '../usePipelineTemplate';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({ k8sGetResource: jest.fn() }));

// [TODO] ConfigMap: uncomment once permission issue resolved for build-service namespace

// const mockGetResource = k8sGetResource as jest.Mock;

// const mockYaml = {
//   apiVersion: 'v1',
//   kind: 'ConfigMap',
//   metadata: {
//     name: 'build-pipeline-config',
//     namespace: 'build-service',
//   },
//   data: {
//     'config.yaml': `
//   default-pipeline-name: docker-builder
//   pipelines:
//   - name: fbc-builder
//     bundle: quay.io/redhat-appstudio-tekton-catalog/pipeline-fbc-builder:032a8745d43a942a247f365fc890b06023ccd67d
//   - name: docker-builder
//     bundle: quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:032a8745d43a942a247f365fc890b06023ccd67d
// `,
//   },
// };

// const mockResolvedValue = {
//   defaultPipelineName: 'docker-builder',
//   pipelines: [
//     {
//       name: 'fbc-builder',
//       bundle:
//         'quay.io/redhat-appstudio-tekton-catalog/pipeline-fbc-builder:032a8745d43a942a247f365fc890b06023ccd67d',
//     },
//     {
//       name: 'docker-builder',
//       bundle:
//         'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:032a8745d43a942a247f365fc890b06023ccd67d',
//     },
//   ],
// };

describe('usePipelineTemplate', () => {
  it('should return undefine and false on initial render', () => {
    const { result } = renderHook(() => usePipelineTemplates());
    expect(result.current).toEqual([
      {
        defaultPipelineName: 'docker-build',
        pipelines: [
          {
            name: 'fbc-builder',
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/pipeline-fbc-builder:032a8745d43a942a247f365fc890b06023ccd67d',
          },
          {
            name: 'docker-build',
            bundle:
              'quay.io/redhat-appstudio-tekton-catalog/pipeline-docker-build:032a8745d43a942a247f365fc890b06023ccd67d',
          },
        ],
      },
      true,
    ]);
  });

  // [TODO] ConfigMap: uncomment once permission issue resolved for build-service namespace
  // it('should return parsed yaml data', async () => {
  //   mockGetResource.mockResolvedValue(mockYaml);
  //   const { result, rerender } = renderHook(() => usePipelineTemplates());
  //   rerender();
  //   expect(mockGetResource).toHaveBeenCalledWith({
  //     model: ConfigMapModel,
  //     queryOptions: { ns: 'build-service', name: 'build-pipeline-config' },
  //   });
  //   await waitFor(() => expect(result.current).toEqual([mockResolvedValue, true]));
  // });

  // it('should return parsed yaml data', async () => {
  //   mockGetResource.mockRejectedValue('');
  //   const { result } = renderHook(() => usePipelineTemplates());
  //   expect(mockGetResource).toHaveBeenCalledWith({
  //     model: ConfigMapModel,
  //     queryOptions: { ns: 'build-service', name: 'build-pipeline-config' },
  //   });
  //   await waitFor(() => expect(result.current).toEqual([undefined, false]));
  // });
});
