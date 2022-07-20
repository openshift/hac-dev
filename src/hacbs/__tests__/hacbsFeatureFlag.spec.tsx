import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { render } from '@testing-library/react';
import {
  HACBS_FLAG,
  EnableHACBSFlagRoute,
  enableHACBSFlagFromQueryParam,
} from '../hacbsFeatureFlag';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useNavigateMock = useNavigate as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

describe('hacbsFeatureFlag', () => {
  it('should set hacbs flag and navigate to app studio', () => {
    const setFlagMock = jest.fn();
    useFeatureFlagMock.mockReturnValue([false, setFlagMock]);
    const navigateMock = jest.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    render(<EnableHACBSFlagRoute />);

    expect(useFeatureFlag).toHaveBeenCalledWith(HACBS_FLAG);
    expect(setFlagMock).toHaveBeenCalledWith(true);
    expect(navigateMock).toHaveBeenCalledWith('/app-studio', { replace: true });
  });
});

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
