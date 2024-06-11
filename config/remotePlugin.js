const { resolve } = require('path');
const packageInfo = require('../package.json');

const navExtensions = [
  {
    type: 'core.navigation/href',
    properties: {
      href: '/application-pipeline',
      name: 'Overview',
    },
  },
  {
    type: 'core.navigation/href',
    properties: {
      href: '/application-pipeline/workspaces',
      name: 'Applications',
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.navigation/href',
    properties: {
      href: '/application-pipeline/secrets',
      name: 'Secrets',
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.navigation/href',
    properties: {
      href: '/application-pipeline/release',
      name: 'Releases',
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.navigation/href',
    properties: {
      href: '/application-pipeline/access',
      name: 'User access',
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
  {
    type: 'core.flag',
    properties: {
      handler: {
        $codeRef: 'FlagUtils.setDevFeatureFlag',
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

  // Redirect from stonesoup for now
  {
    type: 'core.page/route',
    properties: {
      path: '/stonesoup',
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
      path: '/application-pipeline/workspaces',
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
      path: '/application-pipeline/environments',
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
      path: '/application-pipeline/release',
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
      path: '/application-pipeline/secrets',
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
      path: '/application-pipeline/access',
      exact: true,
      component: {
        $codeRef: 'WorkspacedPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // application-pipeline overview (use exact if user has signup)
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline',
      exact: true,
      component: {
        $codeRef: 'OverviewPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  // If user doesn't have signup flag enabled redirect the user allways to Overview (exact: false)
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications',
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
      path: '/application-pipeline/workspaces/:workspaceName/import',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/:activeTab',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/:activeTab/:activity',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/pipelineruns/:plrName',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/pipelineruns/:plrName/:activeTab',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/integrationtests/add',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/integrationtests/:name/edit',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/integrationtests/:testName',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/integrationtests/:testName/:activeTab',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/taskruns/:trName',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/taskruns/:trName/:activeTab',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/commit/:commitName',
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
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/commit/:commitName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'CommitsPage',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },

  // Release objects
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/releases/:release',
      exact: true,
      component: {
        $codeRef: 'Release',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // Components
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/components/:componentName',
      exact: true,
      component: {
        $codeRef: 'ComponentDetails',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/components/:componentName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'ComponentDetails',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/components/:componentName/:activeTab/:compActivity',
      exact: true,
      component: {
        $codeRef: 'ComponentDetails',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },

  // Environments page
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/secrets/workspaces/:workspaceName',
      exact: true,
      component: {
        $codeRef: 'SecretsListPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/secrets/workspaces/:workspaceName/create',
      exact: true,
      component: {
        $codeRef: 'CreateSecret',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // snapshot route
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/snapshots/:snapshotName',
      exact: true,
      component: {
        $codeRef: 'SnapshotDetailsPage',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/workspaces/:workspaceName/applications/:appName/snapshots/:snapshotName/:activeTab',
      exact: true,
      component: {
        $codeRef: 'SnapshotDetailsPage',
      },
    },
    flags: {
      required: ['HACBS', 'SIGNUP'],
    },
  },

  // Release Page
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/release/workspaces/:workspaceName/:releaseTab',
      exact: true,
      component: {
        $codeRef: 'ReleaseListPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/release/workspaces/:workspaceName',
      exact: true,
      component: {
        $codeRef: 'ReleaseListPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/release/workspaces/:workspaceName/release-plan/create',
      exact: true,
      component: {
        $codeRef: 'CreateReleasePlan',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/release/workspaces/:workspaceName/application/:appName/release-plan/trigger/',
      exact: true,
      component: {
        $codeRef: 'TriggerReleasePlan',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/release/workspaces/:workspaceName/application/:appName/release-plan/trigger/:name',
      exact: true,
      component: {
        $codeRef: 'TriggerReleasePlan',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/release/workspaces/:workspaceName/release-plan/edit/:name',
      exact: true,
      component: {
        $codeRef: 'EditReleasePlan',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },

  // user access
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/access',
      exact: true,
      component: {
        $codeRef: 'UserAccessPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/access/workspaces/:workspaceName',
      exact: true,
      component: {
        $codeRef: 'UserAccessPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/access/workspaces/:workspaceName/grant',
      exact: true,
      component: {
        $codeRef: 'GrantAccessPage',
      },
    },
    flags: {
      required: ['SIGNUP'],
    },
  },
  {
    type: 'core.page/route',
    properties: {
      path: '/application-pipeline/access/workspaces/:workspaceName/edit/:name',
      exact: true,
      component: {
        $codeRef: 'EditAccessPage',
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
      path: '/application-pipeline',
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

const redirectExtensions = [
  {
    type: 'core.page/route',
    properties: {
      path: [
        '/application-pipeline/ns/:ns',
        '/application-pipeline/ns/:ns/pipelinerun/:pipelineRun',
        '/application-pipeline/ns/:ns/pipelinerun/:pipelineRun/logs',
        '/application-pipeline/ns/:ns/pipelinerun/:pipelineRun/logs/:task',
      ],
      component: {
        $codeRef: 'GithubRedirect',
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
      SnapshotDetailsPage: resolve(__dirname, '../src/pages/SnapshotDetailsPage'),
      Release: resolve(__dirname, '../src/pages/ReleasePage'),
      IntegrationTestDetails: resolve(__dirname, '../src/pages/IntegrationTestDetailsPage'),
      Applications: resolve(__dirname, '../src/pages/ApplicationsPage'),
      ApplicationDetails: resolve(__dirname, '../src/pages/ApplicationDetailsPage'),
      Import: resolve(__dirname, '../src/pages/ImportPage'),
      ComponentDetails: resolve(__dirname, '../src/pages/ComponentDetailsPage'),
      ReleaseListPage: resolve(__dirname, '../src/pages/ReleaseServicesListPage'),
      CreateReleasePlan: resolve(__dirname, '../src/pages/CreateReleasePlanPage'),
      TriggerReleasePlan: resolve(__dirname, '../src/pages/TriggerReleasePlanPage'),
      EditReleasePlan: resolve(__dirname, '../src/pages/EditReleasePlanPage'),
      WorkspaceContext: resolve(__dirname, '../src/utils/workspace-context-utils'),
      WorkspacedPage: resolve(__dirname, '../src/pages/WorkspacedPage'),
      OverviewPage: resolve(__dirname, '../src/pages/OverviewPage'),
      SecretsListPage: resolve(__dirname, '../src/pages/SecretsListPage'),
      CreateSecret: resolve(__dirname, '../src/pages/CreateSecretPage'),
      UserAccessPage: resolve(__dirname, '../src/pages/UserAccessPage'),
      GrantAccessPage: resolve(__dirname, '../src/pages/GrantAccessPage'),
      EditAccessPage: resolve(__dirname, '../src/pages/EditAccessPage'),
      FlagUtils: resolve(__dirname, '../src/utils/flag-utils'),
      Redirect: resolve(__dirname, '../src/pages/RedirectPage'),
      NotFound: resolve(__dirname, '../src/pages/NotFoundPage'),
      GithubRedirect: resolve(__dirname, '../src/pages/GithubRedirectPage'),
    },
  },
  extensions: [
    ...navExtensions,
    ...flagExtensions,
    ...contextProviderExtensions,
    ...routeExtensions,
    ...redirectExtensions,
  ],
  sharedModules: {
    react: { singleton: true },
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
