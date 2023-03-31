import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import WorkspaceSettings from '../components/WorkspaceSettings/WorkspaceSettings';
import { default as HacbsWorkspaceSettings } from '../hacbs/components/WorkspaceSettings/WorkspaceSettings';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { EnvironmentModel } from '../models';
import { AccessReviewResources } from '../types';

const WorkspaceSettingsPage: React.FC = () => {
  useQuickstartCloseOnUnmount();
  const [hacbs] = useFeatureFlag(HACBS_FLAG);

  const accessReviewResources: AccessReviewResources = [
    { model: EnvironmentModel, verb: 'patch' },
    { model: EnvironmentModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <Helmet>
          <title>Workspace settings page</title>
        </Helmet>
        {hacbs ? <HacbsWorkspaceSettings /> : <WorkspaceSettings />}
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default WorkspaceSettingsPage;
