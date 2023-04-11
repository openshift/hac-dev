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
  {
    type: 'core.navigation/href',
    properties: {
      href: '/stonesoup/environments',
      name: 'Environments',
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

  // Main nav routes
  // sets workspace context for the below route
  // For `/workspaces` route redirect to applications page with workspace context added (default).
  // For any other route append workspace context at the end.
  // we need to do this to make sure navigation highlights selected nav item correctly
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces',
      exact: true,
      component: {
        $codeRef: 'WorkspacedPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/environments',
      exact: true,
      component: {
        $codeRef: 'WorkspacedPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
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
  // If user is not signed up, take user to overview page even for applications and environments nav item.
  // Remove this once we have navigation filtering based on feature flags.
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
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/environments',
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
      path: '/stonesoup/workspaces/:workspaceName/import',
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

  // Taskrun details page
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/taskruns/:trName',
      exact: true,
      component: {
        $codeRef: 'TaskRuns',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/workspaces/:workspaceName/applications/:appName/taskruns/:trName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'TaskRuns',
      },
    },
    flags: {
      required: ['SIGNUP'],
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

  // Environments page
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/environments/workspaces/:workspaceName',
      exact: true,
      component: {
        $codeRef: 'EnvironmentsListPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup/environments/workspaces/:workspaceName/create',
      exact: true,
      component: {
        $codeRef: 'CreateEnvironment',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // 404 route
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
      TaskRuns: resolve(__dirname, '../src/pages/TaskRunPage'),
      HACBSFlag: resolve(__dirname, '../src/hacbs/hacbsFeatureFlag'),
      EditIntegrationTest: resolve(__dirname, '../src/pages/EditIntegrationTestPage'),
      IntegrationTest: resolve(__dirname, '../src/pages/IntegrationTestPage'),
      CommitsPage: resolve(__dirname, '../src/pages/CommitsPage'),
      IntegrationTestDetails: resolve(__dirname, '../src/pages/IntegrationTestDetailsPage'),
      Applications: resolve(__dirname, '../src/pages/ApplicationsPage'),
      ApplicationDetails: resolve(__dirname, '../src/pages/ApplicationDetailsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
      ComponentSettings: resolve(__dirname, '../src/pages/ComponentSettingsPage'),
      EnvironmentsListPage: resolve(__dirname, '../src/pages/EnvironmentsListPage'),
      CreateEnvironment: resolve(__dirname, '../src/pages/CreateEnvironmentPage'),
      WorkspaceContext: resolve(__dirname, '../src/utils/workspace-context-utils'),
      WorkspacedPage: resolve(__dirname, '../src/pages/WorkspacedPage'),
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
