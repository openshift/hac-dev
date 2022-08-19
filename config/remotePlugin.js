const { resolve } = require('path');
const packageInfo = require('../package.json');

const hacbs = {
  exposedModules: {
    PipelineRuns: resolve(__dirname, '../src/hacbs/pages/PipelineRunPage'),
    HACBSFlag: resolve(__dirname, '../src/hacbs/hacbsFeatureFlag'),
    HACBSImport: resolve(__dirname, '../src/hacbs/pages/ImportPage'),
    HACBSIntegrationTest: resolve(__dirname, '../src/hacbs/pages/IntegrationTestPage'),
  },
  extensions: [
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/pipelineruns',
        exact: true,
        component: {
          $codeRef: 'PipelineRuns',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/pipelineruns',
        exact: true,
        component: {
          $codeRef: 'PipelineRuns',
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
        path: '/app-studio/import',
        exact: true,
        component: {
          $codeRef: 'HACBSImport',
        },
      },
      flags: {
        required: ['HACBS'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/import',
        exact: true,
        component: {
          $codeRef: 'HACBSImport',
        },
      },
      flags: {
        required: ['HACBS'],
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/applications/:appName/integration-test',
        exact: true,
        component: {
          $codeRef: 'HACBSIntegrationTest',
        },
      },
      flags: {
        required: ['HACBS'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/applications/:appName/integration-test',
        exact: true,
        component: {
          $codeRef: 'HACBSIntegrationTest',
        },
      },
      flags: {
        required: ['HACBS'],
      },
    },
  ],
};

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      // HACBS
      ...hacbs.exposedModules,

      // App Studio
      Applications: resolve(__dirname, '../src/pages/ApplicationsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
      ComponentSettings: resolve(__dirname, '../src/pages/ComponentSettingsPage'),
      WorkspaceSettings: resolve(__dirname, '../src/pages/WorkspaceSettingsPage'),
      CreateEnvironment: resolve(__dirname, '../src/pages/CreateEnvironmentPage'),
      NamespaceContext: resolve(__dirname, '../src/utils/namespace-context-utils'),
    },
  },
  extensions: [
    // HACBS
    ...hacbs.extensions,

    // App Studio
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
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/workspace-settings/environment/create',
        exact: true,
        component: {
          $codeRef: 'CreateEnvironment',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/workspace-settings/environment/create',
        exact: true,
        component: {
          $codeRef: 'CreateEnvironment',
        },
      },
    },
    {
      type: 'core.context-provider',
      properties: {
        provider: {
          $codeRef: 'NamespaceContext.NamespaceProvider',
        },
        useValueHook: {
          $codeRef: 'NamespaceContext.useActiveNamespace',
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
