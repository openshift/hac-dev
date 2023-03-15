import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useClairScanResults } from '../../../../hooks/useClairScanResults';
import { ClairScanDetailStatus } from '../ClairScanDetailStatus';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props: any) => <a href={props.to}>{props.children}</a>,
  };
});

jest.mock('../../../../hooks/useClairScanResults', () => ({
  useClairScanResults: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const mockScanResults = useClairScanResults as jest.Mock;

describe('ClairScanDetailStatus', () => {
  it('shows loading indicator if results are not fetchec', () => {
    mockScanResults.mockReturnValue([null, false]);
    render(<ClairScanDetailStatus pipelineRunName="test" />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('shows empty state if results are not available', () => {
    mockScanResults.mockReturnValue([null, true]);
    const { container } = render(<ClairScanDetailStatus pipelineRunName="test" />);
    expect(container).toHaveTextContent('-');
  });

  it('shows scan results after values are fetched', () => {
    mockScanResults.mockReturnValue([
      { vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } },
      true,
    ]);
    const { container } = render(<ClairScanDetailStatus pipelineRunName="test" />);
    expect(container).toHaveTextContent('Critical 1');
    expect(container).toHaveTextContent('High 2');
    expect(container).toHaveTextContent('Medium 3');
    expect(container).toHaveTextContent('Low 4');
    expect(screen.getByText('View logs')).toHaveAttribute(
      'href',
      '/stonesoup/workspaces/test-ws/applications/test-ns/pipelineruns/test/logs',
    );
  });
});
