import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, fireEvent, act, configure } from '@testing-library/react';
import { useAllEnvironments } from '../../../../hooks/useAllEnvironments';
import { useComponent } from '../../../../hooks/useComponents';
import { useAllGitOpsDeploymentCRs } from '../../../../hooks/useGitOpsDeploymentCR';
import { PACState } from '../../../../hooks/usePACState';
import { useLatestSuccessfulBuildPipelineRunForComponent } from '../../../../hooks/usePipelineRuns';
import { useSnapshotsEnvironmentBindings } from '../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTaskRuns } from '../../../../hooks/useTaskRuns';
import { routerRenderer } from '../../../../utils/test-utils';
import { WorkspaceContext } from '../../../../utils/workspace-context-utils';
import { useModalLauncher } from '../../../modal/ModalProvider';
import {
  mockComponent,
  mockComponentWithoutEnvs,
  mockDeployment,
  mockEnvironments,
  mockGitOpsDeploymentCRs,
  mockLatestSuccessfulBuild,
  mockSnapshotEBs,
  mockTaskRuns,
} from '../__data__/mockComponentDetails';
import ComponentDetailsView from '../ComponentDetailsView';

jest.mock('../../../../utils/analytics', () => ({
  ...jest.requireActual<any>('../../../../utils/analytics'),
  useTrackEvent: jest.fn(() => jest.fn),
}));

jest.mock('../../../modal/ModalProvider', () => ({
  ...jest.requireActual<any>('../../../modal/ModalProvider'),
  useModalLauncher: jest.fn(() => () => {}),
}));

jest.mock('../../../../utils/workspace-context-utils', () => {
  const actual = jest.requireActual('../../../../utils/workspace-context-utils');
  return {
    ...actual,
    useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
  };
});

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../../hooks/useComponents', () => ({
  useComponent: jest.fn(),
}));

jest.mock('../../../../hooks/usePipelineRuns', () => ({
  ...jest.requireActual<any>('../../../../hooks/usePipelineRuns'),
  useLatestSuccessfulBuildPipelineRunForComponent: jest.fn(),
}));

jest.mock('../../../../hooks/useTaskRuns', () => ({
  ...jest.requireActual<any>('../../../../hooks/useTaskRuns'),
  useTaskRuns: jest.fn(),
}));

jest.mock('../../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  ...jest.requireActual<any>('../../../../hooks/useSnapshotsEnvironmentBindings'),
  useSnapshotsEnvironmentBindings: jest.fn(),
}));

jest.mock('../../../../hooks/useGitOpsDeploymentCR', () => ({
  ...jest.requireActual<any>('../../../../hooks/useGitOpsDeploymentCR'),
  useAllGitOpsDeploymentCRs: jest.fn(),
}));

jest.mock('../../../../hooks/useAllEnvironments', () => ({
  ...jest.requireActual<any>('../../../../hooks/useAllEnvironments'),
  useAllEnvironments: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual<any>('@openshift/dynamic-plugin-sdk-utils'),
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock('../../../../hooks/usePACState', () => {
  const actual = jest.requireActual('../../../../hooks/usePACState');
  return {
    ...actual,
    __esModule: true,
    default: () => PACState.pending,
  };
});

const useNavigateMock = useNavigate as jest.Mock;
const useParamsMock = useParams as jest.Mock;
const useComponentMock = useComponent as jest.Mock;
const useLatestSuccessfulBuildPipelineRunForComponentMock =
  useLatestSuccessfulBuildPipelineRunForComponent as jest.Mock;
const useTaskRunsMock = useTaskRuns as jest.Mock;
const useSnapshotsEnvironmentBindingsMock = useSnapshotsEnvironmentBindings as jest.Mock;
const useAllGitOpsDeploymentCRsMock = useAllGitOpsDeploymentCRs as jest.Mock;
const useAllEnvironmentsMock = useAllEnvironments as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useModalLauncherMock = useModalLauncher as jest.Mock;

const ComponentDetailsViewWrapper = ({ children }) => (
  <WorkspaceContext.Provider
    value={{
      namespace: 'test-ns',
      lastUsedWorkspace: 'test-ws',
      workspace: 'test-ws',
      workspaceResource: undefined,
      workspacesLoaded: true,
      workspaces: [],
    }}
  >
    {children}
  </WorkspaceContext.Provider>
);

configure({ testIdAttribute: 'data-test' });

describe('ComponentDetailsView', () => {
  let navigateMock: jest.Mock;
  const showModalMock = jest.fn();

  beforeEach(() => {
    useComponentMock.mockReturnValue([mockComponent, true]);
    useLatestSuccessfulBuildPipelineRunForComponentMock.mockReturnValue([
      mockLatestSuccessfulBuild,
      true,
    ]);
    useTaskRunsMock.mockReturnValue([mockTaskRuns, true]);
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([mockSnapshotEBs, true]);
    useAllGitOpsDeploymentCRsMock.mockReturnValue([mockGitOpsDeploymentCRs, true]);
    useAllEnvironmentsMock.mockReturnValue([mockEnvironments, true]);
    watchResourceMock.mockReturnValue([mockDeployment, true]);

    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useParamsMock.mockReturnValue({});
    useModalLauncherMock.mockImplementation(() => {
      return showModalMock;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component details', () => {
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    screen.queryByLabelText('human-resources');
  });

  it('should show a spinner while loading', () => {
    useComponentMock.mockReturnValue([{}, false]);
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    screen.getByTestId('spinner');
  });

  it('should show an error state when component cannot be loaded', () => {
    useComponentMock.mockReturnValue([{}, false, { code: 404, message: 'Not found' }]);
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    screen.getByText('404: Page not found');
  });

  it('should render two tabs under component details', async () => {
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    screen.getByTestId('details__tabItem componentdetails');
    const activityTab = screen.getByTestId('details__tabItem activity');

    await act(async () => {
      fireEvent.click(activityTab);
    });
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/test-application/components/human-resources/activity',
    );
  });

  it('should show an error state when latest build information is not available', () => {
    useLatestSuccessfulBuildPipelineRunForComponentMock.mockReturnValue([
      {},
      false,
      { code: 404, message: 'Not found' },
    ]);
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    screen.getByText('404: Page not found');
  });

  it('should indicate when there is no container image', async () => {
    useComponentMock.mockReturnValue([
      { ...mockComponent, status: { ...mockComponent.status, containerImage: undefined } },
      true,
    ]);
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    expect(screen.queryByTestId('sbom-test')).toBeNull();
    expect(screen.queryByTestId('build-container-image-test')).toBeNull();
  });

  it('should indicate when there are no environment variables', async () => {
    useComponentMock.mockReturnValue([mockComponentWithoutEnvs, true]);
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    screen.getByText('No environment variables');
  });

  it('should allow the user to edit the pipeline build plan', async () => {
    routerRenderer(
      <ComponentDetailsViewWrapper>
        <ComponentDetailsView applicationName="test-application" componentName="human-resources" />,
      </ComponentDetailsViewWrapper>,
    );
    const buildPipeline = screen.getByTestId('edit-build-pipeline');
    const editButton = buildPipeline.getElementsByClassName('pf-v5-c-label')[0];

    await act(async () => {
      fireEvent.click(editButton);
    });
    await expect(showModalMock).toHaveBeenCalled();
  });
});
