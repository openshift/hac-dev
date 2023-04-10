import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import { ActivityTab } from '../ActivityTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: () => [[], false],
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useNavigateMock = useNavigate as jest.Mock;
const useParamsMock = useParams as jest.Mock;

describe('Activity Tab', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useParamsMock.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Activity Tab', () => {
    routerRenderer(<ActivityTab applicationName="abcd" />);
    screen.getByText('Activity By');
  });

  it('should render two tabs under activity', async () => {
    routerRenderer(<ActivityTab applicationName="abcd" />);
    screen.getByText('Latest commits');
    screen.getByText('Pipeline runs');

    const plrTab = screen.getByTestId('activity__tabItem pipelineruns');

    await act(async () => {
      fireEvent.click(plrTab);
    });
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/abcd/undefined/pipelineruns',
    );
  });
  it('should display the correct tab', async () => {
    useParamsMock.mockReturnValue({ activeTab: 'activity', activity: 'pipelineruns' });
    let activitiesPage = routerRenderer(<ActivityTab applicationName="abcd" />);
    let tabs = activitiesPage.getByTestId('activities-tabs-id');
    let activeTab = tabs.querySelector('.pf-c-tabs__item.pf-m-current .pf-c-tabs__item-text');
    expect(activeTab).toHaveTextContent('Pipeline runs');
    activitiesPage.unmount();

    useParamsMock.mockReturnValue({ activeTab: 'activity', activity: 'latest-commits' });
    activitiesPage = routerRenderer(<ActivityTab applicationName="abcd" />);
    tabs = activitiesPage.getByTestId('activities-tabs-id');
    activeTab = tabs.querySelector('.pf-c-tabs__item.pf-m-current .pf-c-tabs__item-text');
    expect(activeTab).toHaveTextContent('Latest commits');
    activitiesPage.unmount();
  });
});
