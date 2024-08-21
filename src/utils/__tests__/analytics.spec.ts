import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useTrackEvent } from '../analytics';

const trackMock = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    analytics: {
      track: trackMock,
    },
  }),
}));

describe('analytics', () => {
  describe('useTrackEvent', () => {
    it('should track event', () => {
      const { result } = renderHook(() => useTrackEvent());
      result.current('test-event', { foo: 'bar' });
      expect(trackMock).toHaveBeenCalledWith('test-event', { current_path: '/', foo: 'bar' });
      trackMock.mockClear();

      result.current('test-event', { current_path: '/foo/bar', foo: 'bar', test: 'testing' });
      expect(trackMock).toHaveBeenCalledWith('test-event', {
        current_path: '/foo/bar',
        foo: 'bar',
        test: 'testing',
      });
    });
  });
});
