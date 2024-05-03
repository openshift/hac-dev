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

export const getGithubAppForInternalInstance = () => {
  const host = window.location.hostname;
  if (host === 'konflux.apps.stone-prod-p01.wcfb.p1.openshiftapps.com') {
    return ApplicationPipelineGitHubAppData.prod;
  }
  if (host === 'rhtap.apps.rosa.stone-stage-p01.apys.p3.openshiftapps.com') {
    return ApplicationPipelineGitHubAppData.stage;
  }
  return ApplicationPipelineGitHubAppData.dev;
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
      return getGithubAppForInternalInstance();
  }
};
