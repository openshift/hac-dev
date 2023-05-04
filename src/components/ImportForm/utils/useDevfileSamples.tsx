import * as React from 'react';
import { CatalogItem } from '@openshift/dynamic-plugin-sdk-extensions';
import { getDevfileSamples } from '../../../utils/devfile-utils';

export type SampleAttrs = {
  projectType: string;
  language: string;
  git: {
    remotes: {
      [remote: string]: string;
    };
  };
  deprecated?: boolean;
};

export const useDevfileSamples = (): [CatalogItem<SampleAttrs>[], boolean, string] => {
  const [samples, setSamples] = React.useState<CatalogItem<SampleAttrs>[]>([]);
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
