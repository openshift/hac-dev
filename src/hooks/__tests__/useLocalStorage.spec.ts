import { act, renderHook } from '@testing-library/react-hooks';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  it('should return the inital value', () => {
    const initialState = {
      firstLogin: true,
      lastViewedApp: '',
    };
    const { result } = renderHook(() => useLocalStorage('userDetails', initialState));
    const [data] = result.current;
    expect(data).toBeDefined();
    expect(data.firstLogin).toEqual(true);
  });

  it('should update localstorage is setter is called', () => {
    const initialState = {
      firstLogin: true,
      lastViewedApp: '',
    };
    const { result } = renderHook(() => useLocalStorage('userDetails', initialState));
    const [, setData] = result.current;

    act(() => {
      setData({ firstLogin: false, lastViewedApp: 'test-app' });
    });
    expect(result.current[0].firstLogin).toEqual(false);
    expect(result.current[0].lastViewedApp).toEqual('test-app');
  });
});
