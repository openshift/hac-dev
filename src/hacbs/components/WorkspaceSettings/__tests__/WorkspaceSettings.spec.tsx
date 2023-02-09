import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, configure, fireEvent, screen } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { MockEnterpriseContractPolicies } from '../../../../components/EnterpriseContractView/__data__/mockEnterpriseContractPolicies';
import { mockLocation, routerRenderer } from '../../../../utils/test-utils';
import WorkspaceSettings from '../WorkspaceSettings';

mockLocation();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));
jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
const useChromeMock = useChrome as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

configure({ testIdAttribute: 'data-testid' });

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(MockEnterpriseContractPolicies),
  } as Response),
);

describe('WorkspaceSettings', () => {
  let navigateMock;

  beforeEach(() => {
    const set = jest.fn();
    const toggle = jest.fn();
    const setActiveTopic = jest.fn();
    const enableTopics = jest.fn();
    const disableTopics = jest.fn();
    useChromeMock.mockReturnValue({
      quickStarts: { set, toggle },
      helpTopics: { setActiveTopic, enableTopics, disableTopics },
    });
    useFeatureFlagMock.mockReturnValue([false]);
    watchResourceMock.mockReturnValue([[], true]);
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render workspace settings', () => {
    routerRenderer(<WorkspaceSettings />);
    expect(screen.getByText('Enterprise Contract')).toBeInTheDocument();
  });
  it('should render additional getting started info', () => {
    routerRenderer(<WorkspaceSettings />);
    expect(screen.getByText('Enterprise Contract')).toBeVisible();
  });
  it('should navigate to the enterprise contract tab when selected', async () => {
    routerRenderer(<WorkspaceSettings />);
    const testTab = screen.getByText('Enterprise Contract');
    expect(testTab).toBeVisible();

    await act(async () => {
      fireEvent.click(testTab);
    });
    expect(navigateMock).toHaveBeenCalledWith(
      '/stonesoup/workspaces/test-ws/workspace-settings/enterprise-contract',
    );
  });
});
