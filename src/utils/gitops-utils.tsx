import * as React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import NotStartedIcon from '@patternfly/react-icons/dist/js/icons/not-started-icon';
import { global_palette_green_400 as greenColor } from '@patternfly/react-tokens/dist/js/global_palette_green_400';
import { global_palette_red_100 as redColor } from '@patternfly/react-tokens/dist/js/global_palette_red_100';
import {
  GitOpsDeploymentKind,
  GitOpsDeploymentHealthStatus,
  GitOpsDeploymentStrategy,
} from '../types/gitops-deployment';
import { runStatus } from './pipeline-utils';

import './gitops-utils.scss';

export const getGitOpsDeploymentHealthStatusIcon = (status: GitOpsDeploymentHealthStatus) => {
  switch (status) {
    case GitOpsDeploymentHealthStatus.Healthy:
      return <CheckCircleIcon color={greenColor.value} />;
    case GitOpsDeploymentHealthStatus.Degraded:
      return <ExclamationCircleIcon color={redColor.value} />;
    case GitOpsDeploymentHealthStatus.Progressing:
      return <InProgressIcon />;
    case GitOpsDeploymentHealthStatus.Suspended:
    case GitOpsDeploymentHealthStatus.Missing:
    case GitOpsDeploymentHealthStatus.Unknown:
      return <NotStartedIcon />;
    default:
      return null;
  }
};

export const getGitOpsDeploymentStrategy = (resource: GitOpsDeploymentKind) => {
  return GitOpsDeploymentStrategy[resource.spec?.type];
};

export const getBuildStatusIcon = (status: runStatus) => {
  switch (status) {
    case runStatus.Succeeded:
      return <CheckCircleIcon color={greenColor.value} />;
    case runStatus.Failed:
      return <ExclamationCircleIcon color={redColor.value} />;
    case runStatus.Running:
    case runStatus['In Progress']:
      return <InProgressIcon className="status-icon-spin" />;
    default:
      return <NotStartedIcon />;
  }
};
