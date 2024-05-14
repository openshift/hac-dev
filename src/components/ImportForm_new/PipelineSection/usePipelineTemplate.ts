import * as React from 'react';
import { k8sGetResource } from '@openshift/dynamic-plugin-sdk-utils';
import YAML from 'js-yaml';
import { ConfigMapModel } from '../../../models';

type PipelineTemplateItems = {
  defaultPipelineName: string;
  pipelines: { name: string; bundle: string }[];
};

export const usePipelineTemplates = (): [PipelineTemplateItems, boolean] => {
  const [data, setdata] = React.useState<PipelineTemplateItems>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await k8sGetResource({
          model: ConfigMapModel,
          // [TODO] change the namepsace to build-service
          queryOptions: { ns: 'sbudhwar-1-tenant', name: 'build-pipeline-config' },
        });
        if (isMounted) {
          const json = YAML.load(res.data['config.yaml'] as string);
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
