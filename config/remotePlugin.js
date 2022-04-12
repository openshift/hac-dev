const { resolve } = require('path');
const packageInfo = require('../package.json');

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      AppEntry: resolve(__dirname, '../src/components/AppFlow.tsx'),
      ComponentListView: resolve(
        __dirname,
        '../src/components/ComponentListView/ComponentListView.tsx',
      ),
      Applications: resolve(__dirname, '../src/components/ApplicationListView/ApplicationList'),
      Create: resolve(__dirname, '../src/components/SamplesFlow'),
    },
  },
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
        path: '/app-studio/applications',
        exact: true,
        component: {
          $codeRef: 'Applications',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/create',
        exact: true,
        component: {
          $codeRef: 'Create',
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
      type: 'console.navigation/href',
      properties: {
        href: '/app-studio',
        name: 'Applications',
      },
    },
  ],
  sharedModules: {
    'react-router-dom': { singleton: true },
    'react-redux': { singleton: true, import: false },
    '@openshift/dynamic-plugin-sdk-utils': { singleton: true, import: false },
    '@scalprum/react-core': { singleton: true, import: false },
  },
};
