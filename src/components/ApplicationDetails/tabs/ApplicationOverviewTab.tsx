import * as React from 'react';
import { useStoneSoupGitHubApp } from '../../../hooks/useStoneSoupGitHubApp';
import componentsIcon from '../../../imgs/illustrations/Components.svg';
import editCodeIcon from '../../../imgs/illustrations/Edit code.svg';
import githubAppIcon from '../../../imgs/illustrations/Github app.svg';
import pipelineIcon from '../../../imgs/illustrations/Pipeline.svg';
import { ComponentModel } from '../../../models';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import CommitsListView from '../../Commits/CommitsListView';
import WhatsNextSection, { WhatsNextItem } from '../../WhatsNext/WhatsNextSection';
import AppWorkflowSection from './overview/sections/AppWorkflowSection';

type ApplicationOverviewTabProps = {
  applicationName: string;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ applicationName }) => {
  const { workspace } = useWorkspaceInfo();
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
      title: 'Customize build pipeline',
      description:
        'Customize your build pipelines to update and manage your application components.',
      icon: pipelineIcon,
      cta: {
        label: 'Open components tab',
        href: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/components`,
      },
      helpId: 'stonesoup-whatsnext-customize-build-pipeline',
    },
  ];

  return (
    <>
      <AppWorkflowSection applicationName={applicationName} />
      <CommitsListView applicationName={applicationName} recentOnly />
      <WhatsNextSection whatsNextItems={whatsNextItems} />
    </>
  );
};

export default ApplicationOverviewTab;
