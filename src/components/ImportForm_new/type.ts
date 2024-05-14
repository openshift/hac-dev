export type ImportFormValues = {
  application: string;
  inAppContext: boolean;
  showComponent: boolean;
  componentName: string;
  source: {
    git: {
      url: string;
      revision?: string;
      context?: string;
    };
  };
  pipeline: {
    name: string;
    bundle?: string;
  };
};
