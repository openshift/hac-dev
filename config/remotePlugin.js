const { resolve } = require('path');
const packageInfo = require('../package.json');

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      Applications: resolve(__dirname, '../src/pages/ApplicationsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
    },
  },
  extensions: [
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio',
        exact: true,
        component: {
          $codeRef: 'Applications',
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
        path: '/app-studio/import',
        exact: true,
        component: {
          $codeRef: 'Import',
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
    '@patternfly/quickstarts': { singleton: true, eager: true },
  },
};
