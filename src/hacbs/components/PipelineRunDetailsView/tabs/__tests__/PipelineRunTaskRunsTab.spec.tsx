import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ByRoleOptions, configure, render, screen } from '@testing-library/react';
import { useSearchParam } from '../../../../../hooks/useSearchParam';
import { testTaskRuns } from '../../../TaskRunListView/__data__/mock-TaskRun-data';
import { testPipelineRun } from '../../../topology/__data__/pipeline-test-data';
import PipelineRunTaskRunsTab from '../PipelineRunTaskRunsTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;
const mockUseSearchParam = useSearchParam as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('PipelineRunTaskRunsTab', () => {
  it('should not render the TaskRun table if pipelinerun is missing', () => {
    mockUseSearchParam.mockReturnValueOnce(['']);
    render(<PipelineRunTaskRunsTab pipelineRun={null} />);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('should render TaskRun empty state', () => {
    mockUseK8sWatchResource.mockReturnValue([[], true]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    render(<PipelineRunTaskRunsTab pipelineRun={testPipelineRun} />);
    screen.getByTestId('taskrun-empty-state');
  });

  it('should render TaskRun table', () => {
    mockUseK8sWatchResource.mockReturnValue([[testTaskRuns[0]], true]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    render(<PipelineRunTaskRunsTab pipelineRun={testPipelineRun} />);
    screen.queryByRole('grid', { label: 'TaskRun List' } as ByRoleOptions);
  });
});
