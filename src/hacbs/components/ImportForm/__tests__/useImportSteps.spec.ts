import { renderHook } from '@testing-library/react-hooks';
import { useImportSteps } from '../useImportSteps';

describe('useImportSteps', () => {
  it('should return all import steps', () => {
    const { result } = renderHook(() => useImportSteps('test-app'));
    expect(result.current.length).toEqual(4);
  });
});
