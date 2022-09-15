import * as React from 'react';
import { CatalogItem } from '@openshift/dynamic-plugin-sdk';
import { getDevfileSamples } from '../../../utils/devfile-utils';

export const useDevfileSamples = (): [CatalogItem[], boolean, string] => {
  const [samples, setSamples] = React.useState<CatalogItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<string>();

  React.useEffect(() => {
    let unmounted = false;
    const fetchDevfileSamples = async () => {
      if (unmounted) return;

      try {
        const devfileSamples = await getDevfileSamples();

        if (devfileSamples) {
          setSamples(devfileSamples);
          setLoaded(true);
        }
      } catch (e) {
        setLoadError(`Failed to load devfile samples: ${e.message}`);
      }
    };

    fetchDevfileSamples();
    return () => {
      unmounted = true;
    };
  }, []);

  return [samples, loaded, loadError];
};
