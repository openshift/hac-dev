import { HACBS_FLAG, enableHACBSFlagFromQueryParam } from '../hacbs/hacbsFeatureFlag';

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
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, true);

    setFlag.mockReset();

    windowSpy.mockImplementation(() => ({
      location: {
        search: '?hacbs=false',
      },
    }));

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, false);
  });

  it('should set hacbs flag from localStorage', () => {
    const setFlag = jest.fn();

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, true);

    setFlag.mockReset();

    localStorage.setItem('hacbs', 'false');

    enableHACBSFlagFromQueryParam(setFlag);
    expect(setFlag).toHaveBeenCalledWith(HACBS_FLAG, false);

    localStorage.removeItem('hacbs');
  });
});
