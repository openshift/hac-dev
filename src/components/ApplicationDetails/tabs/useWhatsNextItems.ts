import { useStoneSoupGitHubApp } from '../../../hooks/useStoneSoupGitHubApp';
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
  const { url: githubAppURL } = useStoneSoupGitHubApp();
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  const whatsNextItems: WhatsNextItem[] = [
    {
      title: 'Add a component',
      description: 'Grow your application by adding components.',
      icon: componentsIcon,
      cta: {
        label: 'Add component',
        href: `/stonesoup/workspaces/${workspace}/import?application=${applicationName}`,
        disabled: !canCreateComponent,
        disabledTooltip: "You don't have access to add a component",
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
      },
      helpId: 'stonesoup-whatsnext-install-github-app',
    },
    {
      title: 'Make a code change',
      description: 'Make a change to your source code to automatically trigger a new build.',
      icon: editCodeIcon,
      cta: {
        label: 'View build activity',
        href: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/activity`,
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
      },
      helpId: 'stonesoup-whatsnext-customize-build-pipeline',
    },
  ];
  return whatsNextItems;
};
