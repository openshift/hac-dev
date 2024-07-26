import * as React from 'react';

type PipelineTemplateItems = {
  defaultPipelineName: string;
  pipelines: { name: string; bundle: string }[];
};

// [TODO] ConfigMap: remove PIPELINE_DATA once permission issue resolved for build-service namespace
const PIPELINE_DATA = {
  'default-pipeline-name': 'docker-build-oci-ta',
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
};

export const usePipelineTemplates = (): [PipelineTemplateItems, boolean] => {
  const [data, setdata] = React.useState<PipelineTemplateItems>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // [TODO] ConfigMap: uncomment once permission issue resolved for build-service namespace
        // const res = await k8sGetResource({
        //   model: ConfigMapModel,
        //   queryOptions: { ns: 'build-service', name: 'build-pipeline-config' },
        // });
        if (isMounted) {
          //[TODO] ConfigMap: uncomment once permission issue resolved for build-service namespace
          const json = PIPELINE_DATA; // YAML.load(res.data['config.yaml'] as string);
          setdata({
            defaultPipelineName: json['default-pipeline-name'],
            // eslint-disable-next-line dot-notation
            pipelines: json['pipelines'],
          });
          setLoaded(true);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error while fetching ConfigMap', e);
        if (isMounted) {
          setdata(undefined);
          setLoaded(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return [data, loaded];
};
