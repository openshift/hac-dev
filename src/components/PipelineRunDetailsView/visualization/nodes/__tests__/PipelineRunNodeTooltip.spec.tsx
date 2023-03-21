import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { runStatus } from '../../../../../utils/pipeline-utils';
import PipelineRunNodeTooltip from '../PipelineRunNodeTooltip';

const mockSteps = [
  {
    startTime: 0,
    endTime: 55000,
    name: 'build',
    status: runStatus.Succeeded,
  },
  {
    startTime: 0,
    endTime: 25000,
    name: 'build-2',
    status: runStatus.Succeeded,
  },
  {
    startTime: 0,
    endTime: 2000,
    name: 'mount-container',
    status: runStatus.Cancelled,
  },
  {
    startTime: 0,
    name: 'sbom-get',
    status: runStatus.Running,
  },
  {
    name: 'analyse-dependencies-java-sbom',
    status: runStatus.Skipped,
  },
  {
    name: 'merge-sboms',
    status: runStatus.Idle,
  },
  {
    startTime: 0,
    endTime: 14000,
    name: 'inject-sbom-and-push',
    status: runStatus.Failed,
  },
];

describe('PipelineRunNodeTooltip', () => {
  it('should display the title of the task', () => {
    render(<PipelineRunNodeTooltip label="task title" steps={mockSteps} />);
    expect(screen.getByText('task title')).toBeTruthy();
  });

  it('should display the steps when set', () => {
    const tip = render(<PipelineRunNodeTooltip label="task title" steps={mockSteps} />);
    let toolTip = screen.getByTestId('pipeline-run-tip');
    expect(toolTip.querySelector('.pipelinerun-node__tooltip--step')).toBeTruthy();
    const success = toolTip.querySelectorAll('.pf-topology-pipelines__status-icon.pf-m-success');
    const cancelled = toolTip.querySelectorAll('.pf-topology-pipelines__status-icon.pf-m-warning');
    const running = toolTip.querySelectorAll(
      '.pf-topology-pipelines__status-icon.pf-m-running.icon-spin',
    );
    const skipped = toolTip.querySelectorAll('.pf-topology-pipelines__status-icon.pf-m-skipped');
    const idle = toolTip.querySelectorAll('.pf-topology-pipelines__status-icon.pf-m-idle');
    const failed = toolTip.querySelectorAll('.pf-topology-pipelines__status-icon.pf-m-danger');
    expect(success).toHaveLength(2);
    expect(cancelled).toHaveLength(1);
    expect(running).toHaveLength(1);
    expect(skipped).toHaveLength(1);
    expect(idle).toHaveLength(1);
    expect(failed).toHaveLength(1);

    expect(toolTip).toHaveTextContent('55 seconds');

    tip.unmount();

    render(<PipelineRunNodeTooltip label="task title" />);
    toolTip = screen.getByTestId('pipeline-run-tip');
    expect(toolTip.querySelector('.pipelinerun-node__tooltip--step')).toBeFalsy();
  });
});
