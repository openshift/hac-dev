const { resolve } = require('path');
const packageInfo = require('../package.json');

const hacbs = {
  exposedModules: {
    PipelineRuns: resolve(__dirname, '../src/hacbs/pages/PipelineRunPage'),
    HACBSFlag: resolve(__dirname, '../src/hacbs/hacbsFeatureFlag'),
    HACBSImport: resolve(__dirname, '../src/hacbs/pages/ImportPage'),
    EditIntegrationTest: resolve(__dirname, '../src/hacbs/pages/EditIntegrationTestPage'),
    HACBSIntegrationTest: resolve(__dirname, '../src/hacbs/pages/IntegrationTestPage'),
    CommitsPage: resolve(__dirname, '../src/hacbs/pages/CommitsPage'),
    IntegrationTestDetails: resolve(__dirname, '../src/hacbs/pages/IntegrationTestDetailsPage'),
  },
  extensions: [
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/pipelineruns/:plrName',
        exact: true,
        component: {
          $codeRef: 'PipelineRuns',
        },
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/pipelineruns/:plrName',
        exact: true,
        component: {
          $codeRef: 'PipelineRuns',
        },
      },
      flags: {
        required: ['SIGNUP'],
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
        required: ['HACBS', 'SIGNUP'],
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
        required: ['HACBS', 'SIGNUP'],
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
        required: ['HACBS', 'SIGNUP'],
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
        required: ['HACBS', 'SIGNUP'],
      },
    },

    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/integration-test/:name/edit',
        exact: true,
        component: {
          $codeRef: 'EditIntegrationTest',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/integration-test/:name/edit',
        exact: true,
        component: {
          $codeRef: 'EditIntegrationTest',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/:appName/commit/:commitName',
        exact: true,
        component: {
          $codeRef: 'CommitsPage',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/:appName/commit/:commitName',
        exact: true,
        component: {
          $codeRef: 'CommitsPage',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/:appName/test/:testName',
        exact: true,
        component: {
          $codeRef: 'IntegrationTestDetails',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/:appName/test/:testName',
        exact: true,
        component: {
          $codeRef: 'IntegrationTestDetails',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
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
      ApplicationDetails: resolve(__dirname, '../src/pages/ApplicationDetailsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
      ComponentSettings: resolve(__dirname, '../src/pages/ComponentSettingsPage'),
      WorkspaceSettings: resolve(__dirname, '../src/pages/WorkspaceSettingsPage'),
      CreateEnvironment: resolve(__dirname, '../src/pages/CreateEnvironmentPage'),
      NamespaceContext: resolve(__dirname, '../src/utils/namespace-context-utils'),
      SignupView: resolve(__dirname, '../src/components/Signup/SignupView'),
      FlagUtils: resolve(__dirname, '../src/utils/flag-utils'),
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio/applications/:appName',
        exact: true,
        component: {
          $codeRef: 'ApplicationDetails',
        },
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio/applications/:appName',
        exact: true,
        component: {
          $codeRef: 'ApplicationDetails',
        },
      },
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        href: '/app-studio',
        name: 'Applications',
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/app-studio',
        name: 'Applications',
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        href: '/app-studio/workspace-settings',
        name: 'Settings',
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/app-studio/workspace-settings',
        name: 'Settings',
      },
      flags: {
        required: ['SIGNUP'],
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
      type: 'core.flag',
      properties: {
        handler: {
          $codeRef: 'FlagUtils.setSignupFeatureFlags',
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
      flags: {
        required: ['SIGNUP'],
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
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio',
        component: {
          $codeRef: 'SignupView',
        },
      },
      flags: {
        disallowed: ['SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio',
        component: {
          $codeRef: 'SignupView',
        },
      },
      flags: {
        disallowed: ['SIGNUP'],
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        href: '/app-studio',
        name: 'Signup',
      },
      flags: {
        disallowed: ['SIGNUP'],
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/app-studio',
        name: 'Signup',
      },
      flags: {
        disallowed: ['SIGNUP'],
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
    '@openshift/dynamic-plugin-sdk-extensions': { singleton: true, import: false },
    '@openshift/dynamic-plugin-sdk-utils': { singleton: true, import: false },
    '@scalprum/react-core': { singleton: true, import: false },
    '@patternfly/quickstarts': { singleton: true, eager: true },
    '@unleash/proxy-client-react': { singleton: true },
    '@openshift/dynamic-plugin-sdk': { singleton: true, import: false },
  },
};
