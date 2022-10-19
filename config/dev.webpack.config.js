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
      target: 'http://localhost:3000', // TODO: Switch to Akamai proxy when it becomes available
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      pathRewrite: { '^/api/k8s': '' },
      withCredentials: true,
    },
    {
      context: (path) => path.includes('/wss/k8s'),
      target: 'ws://localhost:3000', // TODO: Switch to Akamai proxy when it becomes available
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      pathRewrite: { '^/wss/k8s': '' },
      withCredentials: true,
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
  sassPrefix: '.hacCore, .hacDev',
  debug: true,
  useFileHash: false,
  bundlePfModules: true,
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
