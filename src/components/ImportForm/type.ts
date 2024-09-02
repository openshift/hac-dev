import { ImportSecret } from '../../types';

export type ImportFormValues = {
  application: string;
  inAppContext: boolean;
  showComponent: boolean;
  componentName: string;
  gitProviderAnnotation?: string;
  gitURLAnnotation?: string;
  isPrivateRepo: boolean;
  source: {
    git: {
      url: string;
      revision?: string;
      context?: string;
      dockerfileUrl?: string;
    };
  };
  pipeline: string;
  importSecrets?: ImportSecret[];
  newSecrets?: string[];
};
