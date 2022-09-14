import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import WorkspaceSettings from '../components/WorkspaceSettings/WorkspaceSettings';
import { default as HacbsWorkspaceSettings } from '../hacbs/components/WorkspaceSettings/WorkspaceSettings';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';

const WorkspaceSettingsPage: React.FC = () => {
  useQuickstartCloseOnUnmount();
  const [hacbs] = useFeatureFlag(HACBS_FLAG);
  return (
    <NamespacedPage>
      <Helmet>
        <title>Workspace settings page</title>
      </Helmet>
      {hacbs ? <HacbsWorkspaceSettings /> : <WorkspaceSettings />}
    </NamespacedPage>
  );
};

export default WorkspaceSettingsPage;
