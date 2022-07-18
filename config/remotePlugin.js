const { resolve } = require('path');
const packageInfo = require('../package.json');

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      Applications: resolve(__dirname, '../src/pages/ApplicationsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
      ComponentSettings: resolve(__dirname, '../src/pages/ComponentSettingsPage'),
      HACBSFlag: resolve(__dirname, '../src/hacbs/hacbsFeatureFlag'),
      WorkspaceSettings: resolve(__dirname, '../src/pages/WorkspaceSettingsPage'),
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
      type: 'core.page/route',
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
      type: 'core.page/route',
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
      type: 'core.page/route',
      properties: {
        path: '/app-studio/import',
        exact: true,
        component: {
          $codeRef: 'Import',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/component-settings',
        exact: true,
        component: {
          $codeRef: 'ComponentSettings',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/component-settings',
        exact: true,
        component: {
          $codeRef: 'ComponentSettings',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/hacbs',
        exact: true,
        component: {
          $codeRef: 'HACBSFlag.EnableHACBSFlagRoute',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/workspace-settings',
        exact: true,
        component: {
          $codeRef: 'WorkspaceSettings',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/workspace-settings',
        exact: true,
        component: {
          $codeRef: 'WorkspaceSettings',
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
    {
      type: 'core.navigation/href',
      properties: {
        href: '/app-studio',
        name: 'Applications',
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        href: '/app-studio/workspace-settings',
        name: 'Settings',
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/app-studio/workspace-settings',
        name: 'Settings',
      },
    },
    {
      type: 'core.flag',
      properties: {
        handler: {
          $codeRef: 'HACBSFlag.enableHACBSFlagFromQueryParam',
        },
      },
    },
  ],
  sharedModules: {
    'react-router-dom': { singleton: true },
    'react-redux': { singleton: true, import: false },
    '@openshift/dynamic-plugin-sdk-utils': { singleton: true, import: false },
    '@scalprum/react-core': { singleton: true, import: false },
    '@patternfly/quickstarts': { singleton: true, eager: true },
    '@openshift/dynamic-plugin-sdk': { singleton: true, import: false },
  },
};
