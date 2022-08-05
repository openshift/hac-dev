import * as React from 'react';
import { ArrowAltCircleDownIcon } from '@patternfly/react-icons/dist/js/icons/arrow-alt-circle-down-icon';
import { CodeBranchIcon } from '@patternfly/react-icons/dist/js/icons/code-branch-icon';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { WorkflowNodeType } from '../types';

export const getWorkflowNodeIcon = (type: WorkflowNodeType): React.ReactNode => {
  switch (type) {
    case WorkflowNodeType.SOURCE:
      return <GithubIcon />;
    case WorkflowNodeType.ENVIRONMENT:
      return <ArrowAltCircleDownIcon />;
    case WorkflowNodeType.PIPELINE:
    default:
      return <CodeBranchIcon />;
  }
};
