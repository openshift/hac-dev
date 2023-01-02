const { resolve } = require('path');
const packageInfo = require('../package.json');

module.exports = {
  pluginMetadata: {
    name: packageInfo.name,
    version: packageInfo.version,
    exposedModules: {
      PipelineRuns: resolve(__dirname, '../src/pages/PipelineRunPage'),
      HACBSFlag: resolve(__dirname, '../src/hacbs/hacbsFeatureFlag'),
      EditIntegrationTest: resolve(__dirname, '../src/pages/EditIntegrationTestPage'),
      IntegrationTest: resolve(__dirname, '../src/pages/IntegrationTestPage'),
      CommitsPage: resolve(__dirname, '../src/pages/CommitsPage'),
      IntegrationTestDetails: resolve(__dirname, '../src/pages/IntegrationTestDetailsPage'),
      Applications: resolve(__dirname, '../src/pages/ApplicationsPage'),
      ApplicationDetails: resolve(__dirname, '../src/pages/ApplicationDetailsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
      ComponentSettings: resolve(__dirname, '../src/pages/ComponentSettingsPage'),
      WorkspaceSettings: resolve(__dirname, '../src/pages/WorkspaceSettingsPage'),
      CreateEnvironment: resolve(__dirname, '../src/pages/CreateEnvironmentPage'),
      NamespaceContext: resolve(__dirname, '../src/utils/namespace-context-utils'),
      SignupView: resolve(__dirname, '../src/components/Signup/SignupView'),
      FlagUtils: resolve(__dirname, '../src/utils/flag-utils'),
      Redirect: resolve(__dirname, '../src/pages/RedirectPage'),
    },
  },
  extensions: [
    // Redirect from app-studio for now
    {
      type: 'console.page/route',
      properties: {
        path: '/app-studio',
        component: {
          $codeRef: 'Redirect',
        },
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/app-studio',
        component: {
          $codeRef: 'Redirect',
        },
      },
    },

    // Stonesoup
    {
      type: 'console.page/route',
      properties: {
        path: '/stonesoup/pipelineruns/:plrName',
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
        path: '/stonesoup/pipelineruns/:plrName',
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
        path: '/stonesoup/applications/:appName/integration-test',
        exact: true,
        component: {
          $codeRef: 'IntegrationTest',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/stonesoup/applications/:appName/integration-test',
        exact: true,
        component: {
          $codeRef: 'IntegrationTest',
        },
      },
      flags: {
        required: ['HACBS', 'SIGNUP'],
      },
    },

    {
      type: 'console.page/route',
      properties: {
        path: '/stonesoup/integration-test/:name/edit',
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
        path: '/stonesoup/integration-test/:name/edit',
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
        path: '/stonesoup/:appName/commit/:commitName',
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
        path: '/stonesoup/:appName/commit/:commitName',
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
        path: '/stonesoup/:appName/test/:testName',
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
        path: '/stonesoup/:appName/test/:testName',
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
      type: 'console.page/route',
      properties: {
        path: '/stonesoup',
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
        path: '/stonesoup',
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
        path: '/stonesoup/applications/:appName',
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
        path: '/stonesoup/applications/:appName',
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
        path: '/stonesoup/applications',
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
        path: '/stonesoup/applications',
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
        path: '/stonesoup/import',
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
        path: '/stonesoup/import',
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
        path: '/stonesoup/component-settings',
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
        path: '/stonesoup/component-settings',
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
        path: '/stonesoup/workspace-settings',
        exact: true,
        component: {
          $codeRef: 'WorkspaceSettings',
        },
      },
      flags: {
        required: ['SIGNUP'],
        disallowed: ['MVP'],
      },
    },
    {
      type: 'core.page/route',
      properties: {
        path: '/stonesoup/workspace-settings',
        exact: true,
        component: {
          $codeRef: 'WorkspaceSettings',
        },
      },
      flags: {
        required: ['SIGNUP'],
        disallowed: ['MVP'],
      },
    },
    {
      type: 'console.navigation/href',
      properties: {
        href: '/stonesoup',
        name: 'Applications',
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/stonesoup',
        name: 'Applications',
      },
      flags: {
        required: ['SIGNUP'],
      },
    },
    // {
    //   type: 'console.navigation/href',
    //   properties: {
    //     href: '/stonesoup/workspace-settings',
    //     name: 'Settings',
    //   },
    //   flags: {
    //     required: ['SIGNUP'],
    //     disallowed: ['MVP'],
    //   },
    // },
    // {
    //   type: 'core.navigation/href',
    //   properties: {
    //     href: '/stonesoup/workspace-settings',
    //     name: 'Settings',
    //   },
    //   flags: {
    //     required: ['SIGNUP'],
    //     disallowed: ['MVP'],
    //   },
    // },
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
      type: 'core.flag',
      properties: {
        handler: {
          $codeRef: 'FlagUtils.setMvpFeatureFlag',
        },
      },
    },
    {
      type: 'console.page/route',
      properties: {
        path: '/stonesoup/workspace-settings/environment/create',
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
        path: '/stonesoup/workspace-settings/environment/create',
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
        path: '/stonesoup',
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
        path: '/stonesoup',
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
        href: '/stonesoup',
        name: 'Signup',
      },
      flags: {
        disallowed: ['SIGNUP'],
      },
    },
    {
      type: 'core.navigation/href',
      properties: {
        href: '/stonesoup',
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
    '@patternfly/quickstarts': { singleton: true },
    '@unleash/proxy-client-react': { singleton: true },
    '@openshift/dynamic-plugin-sdk': { singleton: true, import: false },
  },
};
