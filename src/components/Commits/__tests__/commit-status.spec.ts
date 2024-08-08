import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { usePipelineRunsForCommit } from '../../../hooks/usePipelineRuns';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import { useCommitStatus } from '../commit-status';

jest.mock('../../../hooks/usePipelineRuns', () => ({
  usePipelineRunsForCommit: jest.fn(),
}));

const usePipelineRunsForCommitMock = usePipelineRunsForCommit as jest.Mock;

describe('useCommitStatus', () => {
  it('returns Pending status if pipelineruns are not loaded', () => {
    usePipelineRunsForCommitMock.mockReturnValue([null, false]);
    const { result } = renderHook(() => useCommitStatus('app', 'commit'));
    expect(result.current).toEqual(['Pending', false, undefined]);
  });

  it('returns Pending status if pipelineruns for given commit are not found', () => {
    usePipelineRunsForCommitMock.mockReturnValue([[], true]);
    const { result } = renderHook(() => useCommitStatus('app', 'commit123'));
    expect(result.current).toEqual(['Pending', true, undefined]);
  });

  it('returns correct status if pipelineruns are loaded', () => {
    usePipelineRunsForCommitMock.mockReturnValue([
      pipelineWithCommits.filter(
        (p) => p.metadata.labels['pipelinesascode.tekton.dev/sha'] === 'commit14rt',
      ),
      true,
    ]);
    const { result } = renderHook(() => useCommitStatus('purple-mermaid-app', 'commit14rt'));
    expect(result.current).toEqual(['Pending', true, undefined]);
  });

  it('returns status from the latest started pipelinerun', () => {
    usePipelineRunsForCommitMock.mockReturnValue([
      pipelineWithCommits.filter(
        (p) => p.metadata.labels['pipelinesascode.tekton.dev/sha'] === 'commit123',
      ),
      true,
    ]);
    const { result } = renderHook(() => useCommitStatus('purple-mermaid-app', 'commit123'));
    expect(result.current).toEqual(['Failed', true, undefined]);
  });
});
