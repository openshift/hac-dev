import * as React from 'react';

type PipelineTemplateItems = {
  defaultPipelineName: string;
  pipelines: { name: string; bundle: string }[];
};

// [TODO] ConfigMap: remove PIPELINE_DATA once permission issue resolved for build-service namespace
const PIPELINE_DATA = {
  'default-pipeline-name': 'docker-build',
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
