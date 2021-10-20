const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const environment = process.env.ENVIRONMENT || 'stage';
const betaOrStable = process.env.BETA ? 'beta' : 'stable';
const env = `${environment}-${betaOrStable}`;

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  env, // for accessing prod-beta change this to 'prod-beta'
  appUrl: process.env.BETA ? '/beta/hac/app-studio' : '/hac/app-studio',
  standalone: Boolean(process.env.STANDALONE),
  routes: {
    ...(process.env.API_PORT && {
      '/api/hac/app-studio': { host: `http://localhost:${process.env.API_PORT}` },
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
  debug: true,
  useFileHash: false,
  ...webpackProxy,
});

plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
