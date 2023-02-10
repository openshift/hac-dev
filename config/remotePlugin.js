const { resolve } = require('path');
const packageInfo = require('../package.json');

const navExtensions = [
  {
    type: 'core.navigation/href',
    properties: {
      href: '/stonesoup',
      name: 'Overview',
    },
  },
  {
    type: 'core.navigation/href',
    properties: {
      href: '/stonesoup/workspaces',
      name: 'Applications',
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
];

const flagExtensions = [
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
];

const contextProviderExtensions = [
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
  {
    type: 'core.context-provider',
    properties: {
      provider: {
        $codeRef: 'WorkspaceContext.WorkspaceProvider',
      },
      useValueHook: {
        $codeRef: 'WorkspaceContext.useActiveWorkspace',
      },
    },
  },
];

const routeExtensions = [
  // Redirect from app-studio for now
  {
    type: 'core.page/route',
    properties: {
      path: '/app-studio',
      component: {
        $codeRef: 'Redirect',
      },
    },
  },
  // sets workspace context for the below route
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces',
      exact: true,
      component: {
        $codeRef: 'WorkspacePage',
      },
    },
  },

  // Stonesoup overview
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup',
      exact: true,
      component: {
        $codeRef: 'OverviewPage',
      },
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces',
      exact: true,
      component: {
        $codeRef: 'OverviewPage',
      },
    },
    flags: {
      disallowed: ['SIGNUP'],
    },
  },

  // Applications page.
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications',
      exact: true,
      component: {
        $codeRef: 'Applications',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // Import
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/import',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/:activeTab',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/:activeTab/:activity',
      exact: true,
      component: {
        $codeRef: 'ApplicationDetails',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // Pipelineruns page.
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/pipelineruns/:plrName',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/pipelineruns/:plrName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'PipelineRuns',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // Integration tests tab.
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/integrationtests/add',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/integrationtests/:name/edit',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/integrationtests/:testName',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/integrationtests/:testName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'IntegrationTestDetails',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },

  // Commits page.
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/commit/:commitName',
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
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/commit/:commitName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'CommitsPage',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },

  // Component settings

  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/component-settings',
      exact: true,
      component: {
        $codeRef: 'ComponentSettings',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // Workspace settings
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/workspace-settings',
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
      path: '/stonesoup/workspaces/:workspaceName/workspace-settings/:activeTab',
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
      path: '/stonesoup/workspaces/:workspaceName/workspace-settings/environment/create',
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
      path: '/stonesoup',
      exact: false,
      component: {
        $codeRef: 'NotFound',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
];

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
      WorkspaceContext: resolve(__dirname, '../src/utils/workspace-context-utils'),
      WorkspacePage: resolve(__dirname, '../src/pages/WorkspacePage'),
      OverviewPage: resolve(__dirname, '../src/pages/OverviewPage'),
      FlagUtils: resolve(__dirname, '../src/utils/flag-utils'),
      Redirect: resolve(__dirname, '../src/pages/RedirectPage'),
      NotFound: resolve(__dirname, '../src/pages/NotFoundPage'),
    },
  },
  extensions: [
    ...navExtensions,
    ...flagExtensions,
    ...contextProviderExtensions,
    ...routeExtensions,
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
