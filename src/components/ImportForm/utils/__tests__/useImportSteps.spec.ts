import { renderHook } from '@testing-library/react-hooks';
import { ImportStrategy } from '../types';
import { useImportSteps } from '../useImportSteps';

describe('useImportSteps', () => {
  it('should return the all the steps if applicationName is null', () => {
    const { result } = renderHook(() => useImportSteps(null, ImportStrategy.GIT, jest.fn()));
    expect(result.current.length).toEqual(3);
  });

  it('should not return application step if applicationName is given', () => {
    const { result } = renderHook(() => useImportSteps('test-app', ImportStrategy.GIT, jest.fn()));
    expect(result.current.length).toEqual(2);
  });

  it('should not return review step if strategy is sample', () => {
    const { result } = renderHook(() => useImportSteps(null, ImportStrategy.SAMPLE, jest.fn()));
    expect(result.current.length).toEqual(2);
  });
});
