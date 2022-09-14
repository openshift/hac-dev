import * as React from 'react';
import '@testing-library/jest-dom';
import { useSearchParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, fireEvent, screen } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { mockLocation, routerRenderer } from '../../../../utils/test-utils';
import { MockEnterpriseContractPolicies } from '../../EnterpriseContractView/__data__/mockEnterpriseContractPolicies';
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
const useSearchParamsMock = useSearchParams as jest.Mock;
const useChromeMock = useChrome as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-testid' });

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(MockEnterpriseContractPolicies),
  } as Response),
);

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
  it('should render hacbs workspace settings', () => {
    routerRenderer(<WorkspaceSettings />);
    expect(screen.getByText('Enterprise Contract')).toBeInTheDocument();
  });
  it('should render additional getting started info', () => {
    routerRenderer(<WorkspaceSettings />);
    expect(screen.getByText('Enterprise Contract')).toBeVisible();
  });
  it('should render the enterprise contract view when selected', async () => {
    const original = routerRenderer(<WorkspaceSettings />);
    const testTab = screen.getByText('Enterprise Contract');
    expect(testTab).toBeVisible();
    fireEvent.click(testTab);
    original.unmount();

    const updated = routerRenderer(<WorkspaceSettings />);
    expect(updated.getByTestId('enterprise-contract-title')).toBeVisible();
  });
});
