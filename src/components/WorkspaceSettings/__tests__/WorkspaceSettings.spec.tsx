import * as React from 'react';
import '@testing-library/jest-dom';
import { useSearchParams } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, screen } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { mockLocation, routerRenderer } from '../../../utils/test-utils';
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
    useSearchParams: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
const useSearchParamsMock = useSearchParams as jest.Mock;
const useChromeMock = useChrome as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('WorkspaceSettings', () => {
  let params: URLSearchParams;
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
    params = new URLSearchParams();
    useSearchParamsMock.mockImplementation(() => [
      params,
      (newParams: URLSearchParams) => {
        params = newParams;
        window.location.search = `?${newParams.toString()}`;
      },
    ]);
  });
  it('should render workspace settings', () => {
    routerRenderer(<WorkspaceSettings />);
    expect(screen.getByText('Manage your workspace settings')).toBeVisible();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Environments')).toBeInTheDocument();
  });
  it('should render additional getting started info', () => {
    routerRenderer(<WorkspaceSettings />);
    expect(screen.queryByText('Test Getting Started Info')).toBeNull();

    routerRenderer(<WorkspaceSettings gettingStartedSections={[<>Test Getting Started Info</>]} />);
    expect(screen.getByText('Test Getting Started Info')).toBeVisible();
  });
  it('should render additional tabs', async () => {
    const additionalTab = {
      key: 'test-tab',
      title: 'Test Tab',
      content: <span data-test="test-tab-content">Test Content</span>,
    };
    const original = routerRenderer(<WorkspaceSettings tabs={[additionalTab]} />);
    const testTab = screen.getByText('Test Tab');
    expect(testTab).toBeVisible();
    fireEvent.click(testTab);
    original.unmount();

    const updated = routerRenderer(<WorkspaceSettings tabs={[additionalTab]} />);
    expect(updated.getByTestId('test-tab-content')).toBeVisible();
  });
});
