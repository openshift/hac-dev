import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ByRoleOptions, configure, render, screen } from '@testing-library/react';
import { useSearchParam } from '../../../../hooks/useSearchParam';
import { TektonResourceLabel } from '../../../../types';
import { testTaskRuns } from '../../../TaskRunListView/__data__/mock-TaskRun-data';
import { testPipelineRun } from '../../../topology/__data__/pipeline-test-data';
import PipelineRunTaskRunsTab from '../PipelineRunTaskRunsTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;
const mockUseSearchParam = useSearchParam as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('PipelineRunTaskRunsTab', () => {
  it('should not render the TaskRun table if taskruns are missing', () => {
    mockUseSearchParam.mockReturnValueOnce(['']);
    render(<PipelineRunTaskRunsTab taskRuns={[]} loaded={false} />);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('should render TaskRun empty state', () => {
    mockUseK8sWatchResource.mockReturnValue([[], true]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    render(<PipelineRunTaskRunsTab taskRuns={[]} loaded={true} />);
    screen.getByTestId('taskrun-empty-state');
  });

  it('should render TaskRun table', () => {
    mockUseK8sWatchResource.mockReturnValue([[testTaskRuns[0]], true]);
    mockUseSearchParam.mockReturnValueOnce(['']);
    render(
      <PipelineRunTaskRunsTab
        taskRuns={Object.values(testPipelineRun.status.taskRuns).map((tr) => ({
          apiVersion: 'v1alpha1',
          kind: 'TaskRun',
          metadata: {
            labels: {
              [TektonResourceLabel.pipelineTask]: tr.pipelineTaskName,
            },
          },
          spec: {},
          status: tr.status,
        }))}
        loaded={true}
      />,
    );
    screen.getByTestId('taskrun-list-toolbar');
    expect(
      screen.queryByRole('grid', { ['aria-label']: 'TaskRun List' } as ByRoleOptions),
    ).toBeInTheDocument();
  });
});
