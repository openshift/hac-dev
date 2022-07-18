import { renderHook } from '@testing-library/react-hooks';
import { useImportSteps } from '../useImportSteps';

describe('useImportSteps', () => {
  it('should return the all the steps if applicationName is null', () => {
    const { result } = renderHook(() => useImportSteps(null));
    expect(result.current.length).toEqual(4);
  });

  it('should not return application step if applicationName is given', () => {
    const { result } = renderHook(() => useImportSteps('test-app'));
    expect(result.current.length).toEqual(3);
  });
});
