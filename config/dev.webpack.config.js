const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const environment = process.env.ENVIRONMENT || 'stage';
const betaOrStable = process.env.BETA ? 'beta' : 'stable';
// for accessing prod-beta change this to 'prod-beta'
const env = `${environment}-${betaOrStable}`;

const calculateRemoteConfig = (remoteConfig) => {
  if (remoteConfig === 'stage') {
    return 'https://console.stage.redhat.com';
  } else if (remoteConfig === 'prod') {
    return 'https://console.redhat.com';
  }

  return `https://${remoteConfig}.console.redhat.com`;
};

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/api/plugins' : 'api/plugins',
  useProxy: true,
  env,
  appUrl: process.env.BETA ? '/beta/hac/app-studio' : '/hac/app-studio',
  standalone: Boolean(process.env.STANDALONE),
  ...(process.env.INSIGHTS_CHROME && {
    localChrome: process.env.INSIGHTS_CHROME,
  }),
  customProxy: [
    {
      context: (path) => path.includes('/api/k8s'),
      target:
        'https://api-toolchain-host-operator.apps.appstudio-stage.x99m.p1.openshiftapps.com:443',
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      pathRewrite: { '^/api/k8s': '' },
    },
  ],
  client: {
    overlay: false,
  },
  routes: {
    ...(process.env.REMOTE_CONFIG && {
      [`${process.env.BETA ? '/beta' : ''}/config`]: {
        host: calculateRemoteConfig(process.env.REMOTE_CONFIG),
      },
    }),
    ...(process.env.CONFIG_PORT && {
      [`${process.env.BETA ? '/beta' : ''}/config`]: {
        host: `http://localhost:${process.env.CONFIG_PORT}`,
      },
    }),
  },
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  sassPrefix: '.hacDev',
  debug: true,
  useFileHash: false,
  ...webpackProxy,
});

module.exports = () => {
  return commonPlugins().then((resolvedPlugins) => {
    plugins.push(...resolvedPlugins);
    return {
      ...webpackConfig,
      plugins,
    };
  });
};
