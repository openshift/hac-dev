const { resolve } = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  sassPrefix: '.hacDev',
  deployment: process.env.BETA ? 'beta/api/plugins' : 'api/plugins',
});

module.exports = (env) => {
  return commonPlugins().then((resolvedPlugins) => {
    plugins.push(...resolvedPlugins);

    if (env && env.analyze === 'true') {
      plugins.push(new BundleAnalyzerPlugin());
    }
    return {
      ...webpackConfig,
      plugins,
    };
  });
};
