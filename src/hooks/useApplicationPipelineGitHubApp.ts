import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

enum ConsoleDotEnvironments {
  dev = 'dev',
  stage = 'stage',
  qa = 'qa',
  prod = 'prod',
}

type ApplicationPipelineGitHubAppDataType = {
  url: string;
  name: string;
};

export const ApplicationPipelineGitHubAppData: {
  [env: string]: ApplicationPipelineGitHubAppDataType;
} = {
  dev: { url: 'https://github.com/apps/rhtap-staging', name: 'rhtap-staging' },
  stage: {
    url: 'https://github.com/apps/rhtap-staging',
    name: 'rhtap-staging',
  },
  prod: {
    url: 'https://github.com/apps/red-hat-trusted-app-pipeline',
    name: 'red-hat-trusted-app-pipeline',
  },
};

export const useApplicationPipelineGitHubApp = (): ApplicationPipelineGitHubAppDataType => {
  const { getEnvironment } = useChrome();

  const environment = getEnvironment();

  switch (environment) {
    case ConsoleDotEnvironments.prod:
      return ApplicationPipelineGitHubAppData.prod;
    case ConsoleDotEnvironments.dev:
    case ConsoleDotEnvironments.stage:
      return ApplicationPipelineGitHubAppData.stage;
    default:
      return ApplicationPipelineGitHubAppData.dev;
  }
};
