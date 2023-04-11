import { useApplicationPipelineGitHubApp } from '../../../hooks/useApplicationPipelineGitHubApp';
import componentsIcon from '../../../imgs/illustrations/Components.svg';
import editCodeIcon from '../../../imgs/illustrations/Edit code.svg';
import githubAppIcon from '../../../imgs/illustrations/Github app.svg';
import pipelineIcon from '../../../imgs/illustrations/Pipeline.svg';
import { ComponentModel } from '../../../models';
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

  const whatsNextItems: WhatsNextItem[] = [
    {
      title: 'Add a component',
      description: 'Grow your application by adding components.',
      icon: componentsIcon,
      cta: {
        label: 'Add component',
        href: `/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`,
        disabled: !canCreateComponent,
        disabledTooltip: "You don't have access to add a component",
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
      title: 'Install our GitHub app',
      description: 'Install the GitHub app to monitor your work from a commit to deployment.',
      icon: githubAppIcon,
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
