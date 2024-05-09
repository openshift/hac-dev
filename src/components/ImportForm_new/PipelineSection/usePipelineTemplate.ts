import * as React from 'react';
import { K8sResourceCommon, k8sGetResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ConfigMapModel } from '../../../models';

export const usePipelineTemplates = () => {
  const [data, setdata] = React.useState<K8sResourceCommon>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await k8sGetResource({
          model: ConfigMapModel,
          queryOptions: { ns: 'build-service', name: 'build-pipeline-config' },
        });
        if (isMounted) {
          setdata(res);
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
