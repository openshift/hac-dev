const { resolve } = require('path');
const pckg = import('@openshift/dynamic-plugin-sdk-webpack');
const webpack = require('webpack');
const remotePluginOptions = require('./remotePlugin');

const plugins = [];

// Save 20kb of bundle size in prod
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.NormalModuleReplacementPlugin(/redux-logger/, resolve(__dirname, './empty.js')),
  );
}

module.exports = async () => {
  const { DynamicRemotePlugin } = await pckg;
  plugins.push(new DynamicRemotePlugin(remotePluginOptions));
  return plugins;
};
