import { useApplicationPipelineGitHubApp } from '../../../hooks/useApplicationPipelineGitHubApp';
import componentsIcon from '../../../imgs/Components.svg';
import editCodeIcon from '../../../imgs/Edit code.svg';
import gitAppIcon from '../../../imgs/git-app.svg';
import integrationTestIcon from '../../../imgs/Integration-test.svg';
import pipelineIcon from '../../../imgs/Pipeline.svg';
import releaseIcon from '../../../imgs/Release.svg';
import { ComponentModel, IntegrationTestScenarioModel, ReleasePlanModel } from '../../../models';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { createCustomizeAllPipelinesModalLauncher } from '../../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../../modal/ModalProvider';
import { WhatsNextItem } from '../../WhatsNext/WhatsNextSection';

export const useWhatsNextItems = (applicationName: string) => {
  const showModal = useModalLauncher();
  const { workspace, namespace } = useWorkspaceInfo();
  const { url: githubAppURL } = useApplicationPipelineGitHubApp();
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');
  const [canCreateIntegrationTest] = useAccessReviewForModel(
    IntegrationTestScenarioModel,
    'create',
  );
  const [canCreateReleasePlan] = useAccessReviewForModel(ReleasePlanModel, 'create');

  const whatsNextItems: WhatsNextItem[] = [
    {
      title: 'Grow your application',
      description: 'Grow your application by adding components.',
      icon: componentsIcon,
      cta: {
        label: 'Add component',
        href: `/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`,
        disabled: !canCreateComponent,
        disabledTooltip: "You don't have access to add a component",
        testId: 'add-component',
        analytics: {
          link_name: 'add-component',
          link_location: 'whats-next',
          app_name: applicationName,
          workspace,
        },
      },
      helpId: 'stonesoup-whatsnext-add-component',
    },
    {
      title: 'Add integration tests',
      description:
        'Integration tests run in parallel, validating each new component build with the latest version of all other components.',
      icon: integrationTestIcon,
      cta: {
        label: 'Add a test',
        href: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests/add`,
        disabled: !canCreateIntegrationTest,
        disabledTooltip: "You don't have access to add an integration test",
        testId: 'add-test',
        analytics: {
          link_name: 'add-test',
          link_location: 'whats-next',
          app_name: applicationName,
          workspace,
        },
      },
      helpLink:
        'https://redhat-appstudio.github.io/docs.appstudio.io/Documentation/main/how-to-guides/testing_applications/proc_adding_an_integration_test/',
    },
    {
      title: 'Create a release plan',
      description:
        'A release object represents deployable snapshot of your application. To release your code, create a release plan with release details.',
      icon: releaseIcon,
      cta: {
        label: 'Create a plan',
        href: `/application-pipeline/release/workspaces/${workspace}/release-plan/create`,
        disabled: !canCreateReleasePlan,
        disabledTooltip: "You don't have access to create a release plan",
        testId: 'add-release-plan',
        analytics: {
          link_name: 'add-release-plan',
          link_location: 'whats-next',
          app_name: applicationName,
          workspace,
        },
      },
      helpLink:
        'https://redhat-appstudio.github.io/docs.appstudio.io/Documentation/main/how-to-guides/con_release_application/',
    },
    {
      title: 'Install our GitHub app',
      description: 'Install the GitHub app to monitor your work from a commit to deployment.',
      icon: gitAppIcon,
      cta: {
        label: 'Start the flow',
        href: githubAppURL,
        external: true,
        analytics: {
          link_name: 'install-github-app',
          link_location: 'whats-next',
          app_name: applicationName,
          workspace,
        },
      },
      helpId: 'stonesoup-whatsnext-install-github-app',
    },
    {
      title: 'Make a code change',
      description: 'Make a change to your source code to automatically trigger a new build.',
      icon: editCodeIcon,
      cta: {
        label: 'View build activity',
        href: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/activity`,
        analytics: {
          link_name: 'view-build-activity',
          link_location: 'whats-next',
          app_name: applicationName,
          workspace,
        },
      },
      helpId: 'stonesoup-whatsnext-make-code-change',
    },
    {
      title: 'Manage build pipelines',
      description:
        'Add some automation by upgrading your default build pipelines to custom build pipelines.',
      icon: pipelineIcon,
      cta: {
        label: 'Manage build pipelines',
        onClick: () =>
          showModal(createCustomizeAllPipelinesModalLauncher(applicationName, namespace)),
        analytics: {
          link_name: 'manage-build-pipelines',
          link_location: 'whats-next',
          app_name: applicationName,
          workspace,
        },
      },
      helpId: 'stonesoup-whatsnext-customize-build-pipeline',
    },
  ];
  return whatsNextItems;
};
