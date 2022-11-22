import * as React from 'react';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { ServerIcon } from '@patternfly/react-icons/dist/js/icons/server-icon';
import PipelineIcon from '../../../../../../imgs/pipelineIcon.svg';
import { WorkflowNodeType } from '../types';

export const getWorkflowNodeIcon = (type: WorkflowNodeType): React.ReactNode => {
  switch (type) {
    case WorkflowNodeType.COMPONENT:
      return <GithubIcon />;
    case WorkflowNodeType.STATIC_ENVIRONMENT:
    case WorkflowNodeType.MANAGED_ENVIRONMENT:
      return <ServerIcon />;
    case WorkflowNodeType.BUILD:
    case WorkflowNodeType.TESTS:
    case WorkflowNodeType.COMPONENT_TEST:
    case WorkflowNodeType.APPLICATION_TEST:
    case WorkflowNodeType.RELEASE:
    default:
      return <img src={PipelineIcon} />;
  }
};
