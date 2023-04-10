import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, BreadcrumbItem } from '@patternfly/react-core';
import styles from '@patternfly/react-styles/css/components/Breadcrumb/breadcrumb';
import { ApplicationSwitcher } from '../components/ApplicationDetails/ApplicationSwitcher';
import { WorkspaceSwitcher } from '../components/ApplicationDetails/WorkspaceSwitcher';
import { useWorkspaceInfo } from './workspace-context-utils';

export const useApplicationBreadcrumbs = (appDisplayName = null, withLink = true) => {
  const params = useParams();
  const applicationName = params.appName || appDisplayName;

  const { workspace } = useWorkspaceInfo();

  return [
    <Badge key="badge" isRead>
      WS
    </Badge>,
    <span key="badge-divider" className={styles.breadcrumbItemDivider} />,
    <BreadcrumbItem key="workspace-link" to="#" component="div">
      <Link
        className="pf-c-breadcrumb__link"
        to={`/application-pipeline/workspaces/${workspace}/applications`}
      >
        {workspace}
      </Link>
    </BreadcrumbItem>,
    <WorkspaceSwitcher key="workspace" />,
    <span key="workspace-divider" className={styles.breadcrumbItemDivider}>
      |
    </span>,
    <BreadcrumbItem key="app-link" component="div">
      {applicationName ? (
        <Link
          data-test="applications-breadcrumb-link"
          className="pf-c-breadcrumb__link"
          to={`/application-pipeline/workspaces/${workspace}/applications`}
        >
          Applications
        </Link>
      ) : (
        <span>Applications</span>
      )}
    </BreadcrumbItem>,
    ...(applicationName
      ? [
          {
            path: withLink
              ? `/application-pipeline/workspaces/${workspace}/applications/${applicationName}`
              : '',
            name: appDisplayName || applicationName,
          },
          <ApplicationSwitcher key="app" selectedApplication={applicationName} />,
        ]
      : []),
  ];
};
