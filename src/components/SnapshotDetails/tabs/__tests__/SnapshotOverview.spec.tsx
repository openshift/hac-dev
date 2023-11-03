import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { PipelineRunGroupVersionKind, SnapshotGroupVersionKind } from '../../../../models';
import { Snapshot } from '../../../../types/coreBuildService';
import { routerRenderer } from '../../../../utils/test-utils';
import { mockCommits, pipelineWithCommits } from '../../../Commits/__data__/pipeline-with-commits';
import { useCommitStatus } from '../../../Commits/commit-status';
import { MockSnapshots } from '../../../Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import SnapshotOverview from '../SnapshotOverview';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../Commits/commit-status', () => ({
  useCommitStatus: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: () => {},
    useSearchParams: () => React.useState(() => new URLSearchParams()),
  };
});

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const mockSnapshots: Snapshot[] = [...MockSnapshots];

const getMockedResources = (params: WatchK8sResource) => {
  if (params.groupVersionKind === SnapshotGroupVersionKind) {
    return [mockSnapshots.find((t) => !params.name || t.metadata.name === params.name), true];
  }
  if (params.groupVersionKind === PipelineRunGroupVersionKind) {
    return [[pipelineWithCommits[0]], true];
  }
  return [[], true];
};

describe('SnapshotOverview', () => {
  beforeEach(() => {
    (useCommitStatus as jest.Mock).mockReturnValueOnce(['-', true]);
  });

  it('should show relevant Snapshot details', () => {
    mockSnapshots[0].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[0]}
        environments={[
          { kind: 'Environment', apiVersion: 'v1', metadata: { name: 'test' }, spec: null },
        ]}
        buildPipelineName="build-pipeline"
      />,
    );
    expect(screen.getByText('Created at')).toBeInTheDocument();
    expect(screen.getByText('Deployed to')).toBeInTheDocument();
    expect(screen.getByText('Vulnerabilities')).toBeInTheDocument();
  });

  it('should display commit data and link for snapshots with commit data', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[0]}
        buildPipelineName="build-pipeline"
        commit={mockCommits[0]}
      />,
    );
    screen.getByText('Triggered by');
    const anchor = screen.getByTestId('snapshot-commit-link').children[0].children[0];
    const linkAnchor = anchor as HTMLElement;
    expect(linkAnchor.innerHTML).toContain('comm012');
    expect(linkAnchor.children[0].classList).toContain('commit-label'); // commit label
    expect(linkAnchor.getAttribute('href')).toBe(
      '/application-pipeline/workspaces//applications/my-test-output/commit/comm0123456789abcdefghijklmnopqrstuvwxyz',
    );
  });

  it('should display snapshot component list', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[0]}
        buildPipelineName="build-pipeline"
        commit={mockCommits[0]}
      />,
    );
    expect(screen.getByText('Components')).toBeInTheDocument();
  });

  it('should display ErrorAlert when EnvironementProvisionError occurs', async () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[0]}
        buildPipelineName="build-pipeline"
        commit={mockCommits[0]}
      />,
    );

    screen.queryByTestId('env-provision-err-alert');
    screen.queryByText('Failed for app-sample-go-basic-enterprise-contract');
  });

  it('should display failed scenario', async () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[0]}
        buildPipelineName="build-pipeline"
        commit={mockCommits[0]}
      />,
    );
    screen.queryByText('scn 2');
  });

  it('should hide ErrorAlert when different error occurs and display deployment name', () => {
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[0]}
        buildPipelineName="build-pipeline"
        commit={mockCommits[0]}
      />,
    );
    expect(screen.queryByText('Failed for')).not.toBeInTheDocument();
  });
});

describe('SnapshotOverview environments', () => {
  it('should show Environment display name', () => {
    mockSnapshots[2].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[2]}
        environments={[
          {
            kind: 'Environment',
            apiVersion: 'v1',
            metadata: { name: 'test' },
            spec: { displayName: 'test-env', deploymentStrategy: null },
          },
        ]}
        buildPipelineName="build-pipeline"
      />,
    );
    expect(screen.getByText('test-env')).toBeInTheDocument();
  });

  it('should display Environment metadata name when display name not exists', () => {
    mockSnapshots[2].metadata.deletionTimestamp = '1';
    watchResourceMock.mockImplementation(getMockedResources);
    routerRenderer(
      <SnapshotOverview
        snapshot={mockSnapshots[2]}
        environments={[
          {
            kind: 'Environment',
            apiVersion: 'v1',
            metadata: { name: 'test' },
            spec: null,
          },
        ]}
        buildPipelineName="build-pipeline"
      />,
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
