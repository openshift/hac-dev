import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { render } from '@testing-library/react';
import { HACBS_FLAG, EnableHACBSFlagRoute } from '../hacbsFeatureFlag';

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
