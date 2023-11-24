import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { PipelineRunGroupVersionKind, SnapshotGroupVersionKind } from '../../../models';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { routerRenderer } from '../../../utils/test-utils';
import { pipelineWithCommits } from '../../Commits/__data__/pipeline-with-commits';
import { useCommitStatus } from '../../Commits/commit-status';
import {
  MockEnvironments,
  MockEnvironmentsWithoutDisplayName,
  MockSnapshots,
} from '../../Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import SnapshotDetails from '../SnapshotDetailsView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../Commits/commit-status', () => ({
  useCommitStatus: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: () => {},
    useParams: jest.fn(),
  };
});

jest.mock('../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useParamsMock = useParams as jest.Mock;

const watchResourceMock = useK8sWatchResource as jest.Mock;

const mockUseEnvironments = useEnvironments as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const mockSnapshots: IntegrationTestScenarioKind[] = [...MockSnapshots];

const getMockedResources = (params: WatchK8sResource) => {
  if (params?.groupVersionKind === SnapshotGroupVersionKind) {
    return [mockSnapshots.find((t) => !params.name || t.metadata.name === params.name), true];
  }
  if (params?.groupVersionKind === PipelineRunGroupVersionKind) {
    return [[pipelineWithCommits[0]], true];
  }
  return [[], true];
};

const errorSnapshotResources = (params: WatchK8sResource) => {
  if (params?.groupVersionKind === SnapshotGroupVersionKind) {
    return [mockSnapshots[0], true];
  }
  if (params?.groupVersionKind === PipelineRunGroupVersionKind) {
    return [[pipelineWithCommits[0]], true];
  }
  return [[], true];
};

describe('SnapshotDetailsView', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ activeTab: 'overview' });
    mockUseEnvironments.mockReturnValue([MockEnvironments, true]);
    (useCommitStatus as jest.Mock).mockReturnValueOnce(['-', true]);
  });

  it('should render spinner if test data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should show error state if test cannot be loaded', () => {
    watchResourceMock.mockReturnValue([
      [],
      false,
      { message: 'Application does not exist', code: 404 },
    ]);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    screen.getByText('404: Page not found');
  });

  it('should display snapshot data when loaded', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    expect(screen.getByTestId('snapshot-header-details')).toBeInTheDocument();
    expect(screen.getByTestId('snapshot-name').innerHTML).toBe('my-test-output-1');
  });

  it('should display correct breadcrumbs', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    expect(screen.getByText(/Snapshots/)).toBeInTheDocument();
  });

  it('should show environment name in details', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    mockUseEnvironments.mockReturnValue([MockEnvironmentsWithoutDisplayName, true]);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    expect(screen.getByText('Deployed to')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should show environment display name instead of metadata', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    mockUseEnvironments.mockReturnValue([MockEnvironments, true]);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    expect(screen.getByText('Deployed to')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  it('should show environment label in header', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    mockUseEnvironments.mockReturnValue([MockEnvironments, true]);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-1" applicationName="my-test-output" />,
    );
    const envLabel = screen.getByTestId('snapshot-env-label');
    expect(envLabel).toBeInTheDocument();
    expect(envLabel.innerHTML).toBe('Development');
  });

  it('should show correct details', () => {
    mockSnapshots[0].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-2" applicationName="my-test-output" />,
    );
    screen.getByText('Triggered by');
    expect(screen.getByTestId('snapshot-commit-label')).toBeInTheDocument();
    expect(screen.getByTestId('snapshot-name').innerHTML).toBe('my-test-output-2');
  });

  it('should show EnvProvisionError', () => {
    mockSnapshots[0].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(errorSnapshotResources);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-2" applicationName="my-test-output" />,
    );
    screen.queryByTestId('env-provision-err-alert');
    screen.queryByText('Failed for app-sample-go-basic-enterprise-contract');
  });

  it('should show failed scenario on EnvProvisionError', () => {
    mockSnapshots[0].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(errorSnapshotResources);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-2" applicationName="my-test-output" />,
    );
    screen.queryByText('scn 2');
  });

  it('should show pipelinerun details', () => {
    useParamsMock.mockReturnValue({ activeTab: 'pipelineruns' });
    mockSnapshots[0].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotDetails snapshotName="my-test-output-2" applicationName="my-test-output" />,
    );
    expect(screen.getByTestId('snapshot-plr-loading')).toBeInTheDocument();
  });
});
