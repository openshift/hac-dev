import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import { ComponentCard } from '../ComponentCard';
import '@testing-library/jest-dom';

jest.mock('../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunsForApplication: () => [mockPipelineRuns, true, undefined],
}));

describe('ComponentCard', () => {
  it('should render components card', () => {
    render(<ComponentCard applicationName="test-1" isSelected />);
    screen.getByText('Components');
  });

  it('should render Build Succeeded when card is expanded', () => {
    render(<ComponentCard applicationName="test-1" isExpanded isSelected />);
    screen.getByText('Build Succeeded');
    screen.getByText('Last Build');
  });

  it('should render build status in header when card is not expanded', () => {
    render(<ComponentCard applicationName="test-1" isExpanded={false} isSelected />);
    screen.getByText('Succeeded');
    expect(screen.queryByText('Last Build')).not.toBeInTheDocument();
  });
});
