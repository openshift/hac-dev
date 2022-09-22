import { HACBS_FLAG, enableHACBSFlagFromQueryParam } from '../hacbsFeatureFlag';

describe('hacbsFeatureFlag#enableHACBSFlagFromQueryParam', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('should set hacbs flag with URL query param', () => {
    windowSpy.mockImplementation(() => ({
      location: {
        search: '',
      },
    }));

    const setFlag = jest.fn();

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, false);

    setFlag.mockReset();

    windowSpy.mockImplementation(() => ({
      location: {
        search: '?hacbs=true',
      },
    }));

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, true);
  });

  it('should set hacbs flag from localStorage', () => {
    const setFlag = jest.fn();

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, false);

    setFlag.mockReset();

    localStorage.setItem('hacbs', 'true');

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, true);

    localStorage.removeItem('hacbs');
  });

  it('should use params over localStorage', () => {
    windowSpy.mockImplementation(() => ({
      location: {
        search: '?hacbs=false',
      },
    }));
    localStorage.setItem('hacbs', 'true');

    const setFlag = jest.fn();

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, false);

    setFlag.mockReset();

    windowSpy.mockImplementation(() => ({
      location: {
        search: '?hacbs=wrong',
      },
    }));

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, true);

    localStorage.removeItem('hacbs');
  });
});
