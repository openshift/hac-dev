import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { runStatus } from '../../../../../utils/pipeline-utils';
import PipelineRunNodeTooltip from '../PipelineRunNodeTooltip';

const mockSteps = [
  {
    duration: '55s',
    name: 'build',
    status: runStatus.Succeeded,
  },
  {
    duration: '25s',
    name: 'build-2',
    status: runStatus.Succeeded,
  },
  {
    duration: '2s',
    name: 'mount-container',
    status: runStatus.Cancelled,
  },
  {
    duration: '44s',
    name: 'sbom-get',
    status: runStatus.Running,
  },
  {
    duration: 'less than a sec',
    name: 'analyse-dependencies-java-sbom',
    status: runStatus.Skipped,
  },
  {
    duration: 'less than a sec',
    name: 'merge-sboms',
    status: runStatus.Idle,
  },
  {
    duration: '14s',
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
    tip.unmount();

    render(<PipelineRunNodeTooltip label="task title" />);
    toolTip = screen.getByTestId('pipeline-run-tip');
    expect(toolTip.querySelector('.pipelinerun-node__tooltip--step')).toBeFalsy();
  });
});
