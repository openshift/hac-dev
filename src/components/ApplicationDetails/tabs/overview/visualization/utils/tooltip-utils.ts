import { WorkflowNodeType } from '../types';

export const getTooltipText = (type: WorkflowNodeType): string => {
  switch (type) {
    case WorkflowNodeType.COMMIT:
      return 'Source';
    case WorkflowNodeType.STATIC_ENVIRONMENT:
    case WorkflowNodeType.MANAGED_ENVIRONMENT:
      return 'Environment';
    case WorkflowNodeType.PIPELINE:
    default:
      return 'Pipeline';
  }
};
