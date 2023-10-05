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
