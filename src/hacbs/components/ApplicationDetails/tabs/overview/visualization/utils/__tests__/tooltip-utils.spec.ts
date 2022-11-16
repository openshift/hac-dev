import { WorkflowNodeType } from '../../types';
import { getTooltipText } from '../tooltip-utils';

describe('getTooltipText', () => {
  test('should return tooltip content for given node type', () => {
    expect(getTooltipText(WorkflowNodeType.PIPELINE)).toBe('Pipeline');
    expect(getTooltipText(WorkflowNodeType.STATIC_ENVIRONMENT)).toBe('Environment');
    expect(getTooltipText(WorkflowNodeType.MANAGED_ENVIRONMENT)).toBe('Environment');
    expect(getTooltipText(WorkflowNodeType.COMMIT)).toBe('Source');

    expect(getTooltipText(WorkflowNodeType.RELEASE)).toBe('Pipeline');
  });
});
