import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

export enum ConsoleDotEnvironments {
  dev = 'dev',
  stage = 'stage',
  qa = 'qa',
  prod = 'prod',
  internalProd = ConsoleDotEnvironments.prod,
  internalStage = ConsoleDotEnvironments.stage,
}

const internalInstance = (host: string) => (env: 'prod' | 'stage') =>
  new RegExp(`stone-${env}-([A-Za-z0-9]+).([a-z]+).([a-z0-9]+).openshiftapps.com`, 'g').test(host);

const getInternalInstance = () => {
  const matchInternalInstance = internalInstance(window.location.host);
  if (matchInternalInstance('prod')) {
    return ConsoleDotEnvironments.internalProd;
  } else if (matchInternalInstance('stage')) {
    return ConsoleDotEnvironments.internalStage;
  }
  return undefined;
};

export const useUIInstance = (): ConsoleDotEnvironments => {
  const env = useChrome((chrome) => chrome.getEnvironment());
  return getInternalInstance() ?? (env as ConsoleDotEnvironments);
};

const SBOM_PLACEHOLDER = '<PLACEHOLDER>';
const getSBOMEnvUrl = (env: ConsoleDotEnvironments) => (imageHash: string) => {
  if (env === ConsoleDotEnvironments.prod) {
    return `https://atlas.devshift.net/sbom/content/${SBOM_PLACEHOLDER}`.replace(
      SBOM_PLACEHOLDER,
      imageHash,
    );
  }
  return `https://atlas.stage.devshift.net/sbom/content/${SBOM_PLACEHOLDER}`.replace(
    SBOM_PLACEHOLDER,
    imageHash,
  );
};

const getBambinoUrl = (env: ConsoleDotEnvironments) => {
  if (env === ConsoleDotEnvironments.prod) {
    return 'https://bombino.api.redhat.com/v1/sbom/quay/push';
  }
  return 'https://bombino.preprod.api.redhat.com/v1/sbom/quay/push';
};

export const useSbomUrl = () => getSBOMEnvUrl(useUIInstance());

export const useBambinoUrl = () => getBambinoUrl(useUIInstance());
