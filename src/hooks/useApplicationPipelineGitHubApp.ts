import { useUIInstance } from './useUIInstance';

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
  dev: { url: 'https://github.com/apps/konflux-staging', name: 'konflux-staging' },
  stage: {
    url: 'https://github.com/apps/konflux-staging',
    name: 'konflux-staging',
  },
  prod: {
    url: 'https://github.com/apps/red-hat-konflux',
    name: 'red-hat-konflux',
  },
};

export const useApplicationPipelineGitHubApp = (): ApplicationPipelineGitHubAppDataType => {
  const environment = useUIInstance();

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
