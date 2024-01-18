import React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { ReleaseService } from '../components/ReleaseService/ReleaseService';
import { ReleasePlanModel } from '../models';
import { useWorkspaceBreadcrumbs } from '../utils/breadcrumb-utils';
import { useAccessReviewForModel } from '../utils/rbac';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const ReleaseListPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workspace } = useWorkspaceInfo();
  const breadcrumbs = useWorkspaceBreadcrumbs();
  const [canCreateReleasePlan] = useAccessReviewForModel(ReleasePlanModel, 'create');

  return (
    <NamespacedPage>
      <PageLayout
        title="Releases"
        description="Manage all your releases in this workspace."
        actions={[
          {
            id: 'create-release-plan',
            label: 'Create release plan',
            cta: {
              href: `/application-pipeline/release/workspaces/${workspace}/release-plan/create`,
            },
            disabled: !canCreateReleasePlan,
            disabledTooltip: "You don't have access to create a release plan",
          },
        ]}
        breadcrumbs={[
          ...breadcrumbs,
          {
            path: '#',
            name: 'Releases',
          },
        ]}
      >
        <PageSection variant={PageSectionVariants.light} isFilled>
          <ReleaseService />
        </PageSection>
      </PageLayout>
    </NamespacedPage>
  );
};

export default ReleaseListPage;
