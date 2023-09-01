import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, configure } from '@testing-library/react';
import { useAllEnvironments } from '../../../../hooks/useAllEnvironments';
import { useApplicationRoutes } from '../../../../hooks/useApplicationRoutes';
import { useLatestSuccessfulBuildPipelineRunForComponent } from '../../../../hooks/usePipelineRuns';
import { useSnapshotsEnvironmentBindings } from '../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTaskRuns } from '../../../../hooks/useTaskRuns';
import { routerRenderer } from '../../../../utils/test-utils';
import {
  mockComponent,
  mockEnvironments,
  mockLatestSuccessfulBuild,
  mockSnapshotEBs,
  mockTaskRuns,
  mockRoutes,
} from '../__data__/mockComponentDetails';
import { ComponentDeploymentsTab } from '../tabs/ComponentDeploymentsTab';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<any>('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../../hooks/useAllEnvironments', () => ({
  useAllEnvironments: jest.fn(),
}));
const useAllEnvironmentsMock = useAllEnvironments as jest.Mock;

jest.mock('../../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  ...jest.requireActual<any>('../../../../hooks/useSnapshotsEnvironmentBindings'),
  useSnapshotsEnvironmentBindings: jest.fn(),
}));

jest.mock('../../../../hooks/useApplicationRoutes', () => ({
  useApplicationRoutes: jest.fn(),
}));

jest.mock('../../../../hooks/usePipelineRuns', () => ({
  ...jest.requireActual<any>('../../../../hooks/usePipelineRuns'),
  useLatestSuccessfulBuildPipelineRunForComponent: jest.fn(),
}));
jest.mock('../../../../hooks/useTaskRuns', () => ({
  useTaskRuns: jest.fn(),
}));
const useSnapshotsEnvironmentBindingsMock = useSnapshotsEnvironmentBindings as jest.Mock;
const applicationRoutesMock = useApplicationRoutes as jest.Mock;
const useLatestSuccessfulBuildPipelineRunForComponentMock =
  useLatestSuccessfulBuildPipelineRunForComponent as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;
const useParamsMock = useParams as jest.Mock;
const useTaskRunsMock = useTaskRuns as jest.Mock;

configure({ testIdAttribute: 'data-testid' });

describe('ComponentDeploymentsTab', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    useAllEnvironmentsMock.mockReturnValue([mockEnvironments, true]);
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([mockSnapshotEBs, true]);
    applicationRoutesMock.mockReturnValue([mockRoutes, true]);
    useLatestSuccessfulBuildPipelineRunForComponentMock.mockReturnValue([
      mockLatestSuccessfulBuild,
      true,
    ]);
    useTaskRunsMock.mockReturnValue([mockTaskRuns, true]);
    watchResourceMock.mockReturnValue([{}, true]);
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useParamsMock.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the skeleton table if component deployment data is not loaded', () => {
    useAllEnvironmentsMock.mockReturnValue([[], false]);
    routerRenderer(<ComponentDeploymentsTab component={mockComponent} />);
    const listView = screen.getByTestId('component-deployments-list-view');
    expect(listView.querySelector('.loading-skeleton--table')).toBeTruthy();
  });

  it('should render the empty state if there are no environments', () => {
    useAllEnvironmentsMock.mockReturnValue([[], true]);
    routerRenderer(<ComponentDeploymentsTab component={mockComponent} />);
    expect(
      screen.findByText(
        'Monitor the component builds that are currently deployed to your environments.',
      ),
    ).toBeTruthy();
  });

  it('should render a table when there are integration tests', () => {
    const wrapper = routerRenderer(<ComponentDeploymentsTab component={mockComponent} />);
    expect(wrapper.container.getElementsByTagName('table')).toHaveLength(1);
  });
});
