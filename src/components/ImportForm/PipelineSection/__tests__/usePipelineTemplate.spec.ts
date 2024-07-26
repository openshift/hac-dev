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
        defaultPipelineName: 'docker-build-oci-ta',
        pipelines: [
          {
            name: 'fbc-builder',
            bundle:
              'quay.io/konflux-ci/tekton-catalog/pipeline-fbc-builder@sha256:33f0a94171afa6ceadfe62a9b0e09bf1b3fe84c20b9fec8d7a28ecd1e771f4c6',
          },
          {
            name: 'docker-build',
            bundle:
              'quay.io/konflux-ci/tekton-catalog/pipeline-docker-build@sha256:effd08d960f33d9957618982244e0d9c06f89eaaca5d125a434eacfc9851a04f',
          },
          {
            name: 'docker-build-oci-ta',
            bundle:
              'quay.io/konflux-ci/tekton-catalog/pipeline-docker-build-oci-ta@sha256:9002db310cd002ddc7ccf94e08f8cd9b02c1bdd5dce36b59173fbc6cd4799f97',
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
