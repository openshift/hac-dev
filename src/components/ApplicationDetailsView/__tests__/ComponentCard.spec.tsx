import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useGitOpsDeploymentCR } from '../../../hooks/useGitOpsDeploymentCR';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import { ComponentCard } from '../ComponentCard';

jest.mock('../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunsForApplication: () => [mockPipelineRuns, true, undefined],
}));

jest.mock('../../../hooks/useGitOpsDeploymentCR', () => ({
  useGitOpsDeploymentCR: jest.fn(),
}));

const gitOpsDeploymentMock = useGitOpsDeploymentCR as jest.Mock;

describe('ComponentCard', () => {
  beforeEach(() => {
    gitOpsDeploymentMock.mockReturnValue([
      { spec: { type: 'automated' }, status: { health: { status: 'Degraded' } } },
      true,
    ]);
  });

  it('should render components card', () => {
    render(<ComponentCard applicationName="test-1" isSelected onSelect={() => {}} />);
    screen.getByText('Components');
  });

  it('should render Build Succeeded when card is expanded', () => {
    render(<ComponentCard applicationName="test-1" isExpanded isSelected onSelect={() => {}} />);
    screen.getByText('Build Succeeded');
    screen.getByText('Last Build');
  });

  it('should render build status in header when card is not expanded', () => {
    render(
      <ComponentCard applicationName="test-1" isExpanded={false} isSelected onSelect={() => {}} />,
    );
    screen.getByText('Succeeded');
    expect(screen.queryByText('Last Build')).toBeFalsy();
  });
});
