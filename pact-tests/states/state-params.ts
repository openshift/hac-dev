export type ApplicationParams = {
  appName: string;
  namespace: string;
};

export type ComponentsParams = {
  components: [
    {
      app: ApplicationParams;
      repo: string;
      compName: string;
    },
  ];
};

export type CDQParams = {
  url: string;
  name: string;
  namespace: string;
};

export type SPIAccessCheckParams = {
  generateName: string;
  namespace: string;
  repo: string;
};
