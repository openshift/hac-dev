import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

enum ConsoleDotEnvironments {
  dev = 'dev',
  stage = 'stage',
  qa = 'qa',
  prod = 'prod',
}

type StoneSoupGitHubAppDataType = {
  url: string;
  name: string;
};

export const StoneSoupGitHubAppData: { [env: string]: StoneSoupGitHubAppDataType } = {
  dev: { url: 'https://github.com/apps/appstudio-staging-ci', name: 'appstudio-staging-ci' },
  stage: {
    url: 'https://github.com/apps/red-hat-appstudio-ci-cd-staging',
    name: 'red-hat-appstudio-ci-cd-staging',
  },
  prod: { url: 'https://github.com/apps/red-hat-appstudio-ci-cd', name: 'red-hat-appstudio-ci-cd' },
};

export const useStoneSoupGitHubApp = (): StoneSoupGitHubAppDataType => {
  const { getEnvironment } = useChrome();

  const environment = getEnvironment();

  switch (environment) {
    case ConsoleDotEnvironments.prod:
      return StoneSoupGitHubAppData.prod;
    case ConsoleDotEnvironments.dev:
    case ConsoleDotEnvironments.stage:
      return StoneSoupGitHubAppData.stage;
    default:
      return StoneSoupGitHubAppData.dev;
  }
};
