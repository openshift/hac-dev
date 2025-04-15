import React from 'react';
import { Helmet } from 'react-helmet';
import { Divider, PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { UserAccessListView } from '../components/UserAccess/UserAccessListView';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { SpaceBindingRequestModel } from '../models';
import { AccessReviewResources } from '../types';
import { useWorkspaceBreadcrumbs } from '../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const UserAccessPage: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  useQuickstartCloseOnUnmount();
  const breadcrumbs = useWorkspaceBreadcrumbs();
  const { workspace } = useWorkspaceInfo();

  const accessReviewResources: AccessReviewResources = [
    { model: SpaceBindingRequestModel, verb: 'list' },
  ];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <Helmet>
          <title>User access | {FULL_APPLICATION_TITLE}</title>
        </Helmet>
        <PageLayout
          title="User access"
          description="Invite users to collaborate with you by granting them access to your workspace."
          breadcrumbs={[
            ...breadcrumbs,
            {
              path: '#',
              name: 'User access',
            },
          ]}
          actions={[
            {
              id: 'grant-access',
              label: 'Grant access',
              disabled: true,
              disabledTooltip: 'You cannot grant access in this workspace',
              cta: {
                href: `/application-pipeline/access/workspaces/${workspace}/grant`,
              },
            },
          ]}
        >
          <Divider style={{ background: 'white', paddingTop: 'var(--pf-v5-global--spacer--md)' }} />
          <PageSection variant={PageSectionVariants.light} isFilled>
            <UserAccessListView />
          </PageSection>
        </PageLayout>
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default UserAccessPage;
