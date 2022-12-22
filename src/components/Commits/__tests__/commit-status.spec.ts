import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { pipelineWithCommits } from '../__data__/pipeline-with-commits';
import { useCommitStatus } from '../commit-status';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('useCommitStatus', () => {
  it('returns empty status if pipelineruns are not loaded', () => {
    watchResourceMock.mockReturnValue([null, false]);
    const { result } = renderHook(() => useCommitStatus('app', 'commit'));
    expect(result.current).toEqual(['-', false, undefined]);
  });

  it('returns empty status if pipelineruns for given commit are not found', () => {
    watchResourceMock.mockReturnValue([pipelineWithCommits, true]);
    const { result } = renderHook(() => useCommitStatus('app', 'commit123'));
    expect(result.current).toEqual(['-', true, undefined]);
  });

  it('returns correct status if pipelineruns are loaded', () => {
    watchResourceMock.mockReturnValue([pipelineWithCommits, true]);
    const { result } = renderHook(() => useCommitStatus('purple-mermaid-app', 'commit14rt'));
    expect(result.current).toEqual(['Succeeded', true, undefined]);
  });

  it('returns status from the latest started pipelinerun', () => {
    watchResourceMock.mockReturnValue([pipelineWithCommits, true]);
    const { result } = renderHook(() => useCommitStatus('purple-mermaid-app', 'commit123'));
    expect(result.current).toEqual(['Failed', true, undefined]);
  });
});
