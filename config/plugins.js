const { resolve } = require('path');
const webpack = require('webpack');
const ExtensionsPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/extensions-plugin');

const plugins = [
  new ExtensionsPlugin(
    {
      /**
       * These extensions are offered up as 'console-extensions.json' (a subset are currently supported in HAC-Core)
       */
      extensions: [
        {
          type: 'console.page/route',
          properties: {
            path: '/app-studio',
            exact: true,
            component: {
              $codeRef: 'AppEntry',
            },
          },
        },
        {
          type: 'console.page/route',
          properties: {
            path: '/app-studio/components',
            exact: true,
            component: {
              $codeRef: 'ComponentListView',
            },
          },
        },
        {
          type: 'console.page/route',
          properties: {
            path: '/app-studio/sample-page',
            exact: true,
            component: {
              $codeRef: 'SamplePage',
            },
          },
        },
        {
          type: 'console.page/route',
          properties: {
            path: '/app-studio/k8s-util',
            exact: true,
            component: {
              $codeRef: 'K8sPage',
            },
          },
        },
        {
          type: 'console.navigation/href',
          properties: {
            href: '/app-studio',
            name: 'App studio',
          },
        },
        {
          type: 'console.navigation/href',
          properties: {
            href: '/app-studio/k8s-util',
            name: 'Test k8s',
          },
        },
      ],
    },
    {
      exposes: {
        AppEntry: resolve(__dirname, '../src/components/SamplesFlow.tsx'),
        ComponentListView: resolve(
          __dirname,
          '../src/components/ComponentListView/ComponentListView.tsx',
        ),
        SamplePage: resolve(__dirname, '../src/pages/SamplePage/SamplePage.tsx'),
        K8sPage: resolve(__dirname, '../src/pages/TestK8s.tsx'),
      },
      shared: [
        { 'react-router-dom': { singleton: true } },
        { '@openshift/dynamic-plugin-sdk-utils': { singleton: true, import: false } },
      ],
    },
  ),
];

// Save 20kb of bundle size in prod
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.NormalModuleReplacementPlugin(/redux-logger/, resolve(__dirname, './empty.js')),
  );
}

module.exports = plugins;
