import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { act, fireEvent, screen } from '@testing-library/react';
import { useComponents } from '../../../../../hooks/useComponents';
import { useIntegrationTestScenarios } from '../../../../../hooks/useIntegrationTestScenarios';
import { usePipelineRunsForCommit } from '../../../../../hooks/usePipelineRuns';
import { useReleasePlans } from '../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../hooks/useReleases';
import { useSnapshots } from '../../../../../hooks/useSnapshots';
import { useSnapshotsEnvironmentBindings } from '../../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTaskRuns } from '../../../../../hooks/useTaskRuns';
import { getLatestCommitFromPipelineRuns } from '../../../../../utils/commits-utils';
import { routerRenderer } from '../../../../../utils/test-utils';
import { testTaskRuns } from '../../../../TaskRunListView/__data__/mock-TaskRun-data';
import { useCommitStatus } from '../../../commit-status';
import CommitDetailsView from '../../CommitDetailsView';
import {
  MockBuildPipelines,
  MockCommit,
  MockComponents,
  MockIntegrationTests,
  MockReleasePlans,
  MockReleases,
  MockSnapshots,
  MockSnapshotsEB,
  MockTestPipelines,
} from '../../visualization/__data__/MockCommitWorkflowData';

jest.mock('../../../../PipelineRunDetailsView/visualization/utils/pipelinerun-graph-utils', () => {
  const actual = jest.requireActual(
    '../../../../PipelineRunDetailsView/visualization/utils/pipelinerun-graph-utils',
  );
  return {
    ...actual,
    scrollNodeIntoView: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('../../../../../hooks/useIntegrationTestScenarios', () => ({
  useIntegrationTestScenarios: jest.fn(),
}));
jest.mock('../../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));
jest.mock('../../../../../hooks/useReleases', () => ({
  useReleases: jest.fn(),
}));
jest.mock('../../../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));
jest.mock('../../../../../hooks/useSnapshots', () => ({
  useSnapshots: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('../../../commit-status', () => ({
  useCommitStatus: jest.fn(),
}));

jest.mock('../../../../../utils/commits-utils', () => {
  const actual = jest.requireActual('../../../../../utils/commits-utils');
  return {
    ...actual,
    getLatestCommitFromPipelineRuns: jest.fn(),
  };
});

jest.mock('../../../../../hooks/usePipelineRuns', () => {
  const actual = jest.requireActual('../../../../../hooks/usePipelineRuns');
  return {
    ...actual,
    usePipelineRunsForCommit: jest.fn(),
  };
});

jest.mock('../../../../../hooks/useTaskRuns', () => ({
  useTaskRuns: jest.fn(),
}));

const mockUseComponents = useComponents as jest.Mock;
const mockUseIntegrationTestScenarios = useIntegrationTestScenarios as jest.Mock;
const mockUseReleasePlans = useReleasePlans as jest.Mock;
const mockUseReleases = useReleases as jest.Mock;
const mockUseSnapshots = useSnapshots as jest.Mock;
const mockUseSnapshotsEnvironmentBindings = useSnapshotsEnvironmentBindings as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

const mockUseCommitStatus = useCommitStatus as jest.Mock;
const mockGetLatestCommitFromPipelineRuns = getLatestCommitFromPipelineRuns as jest.Mock;
const mockUsePipelineRunsForCommit = usePipelineRunsForCommit as jest.Mock;
const mockUseTaskRuns = useTaskRuns as jest.Mock;

const commit = MockCommit;

describe('CommitSidePanel', () => {
  beforeEach(() => {
    mockGetLatestCommitFromPipelineRuns.mockReturnValue(commit);
    mockUseCommitStatus.mockReturnValue(['Success', true]);
    mockUsePipelineRunsForCommit.mockReturnValue([
      [...MockBuildPipelines, ...MockTestPipelines],
      true,
    ]);
    mockUseTaskRuns.mockReturnValue([testTaskRuns, true, undefined]);

    mockUseComponents.mockReturnValue([MockComponents, true]);
    mockUseIntegrationTestScenarios.mockReturnValue([MockIntegrationTests, true]);
    mockUseReleasePlans.mockReturnValue([MockReleasePlans, true]);
    mockUseReleases.mockReturnValue([MockReleases, true]);
    mockUseSnapshots.mockReturnValue([MockSnapshots, true]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([MockSnapshotsEB, true]);
    useFeatureFlagMock.mockReturnValue([false]);

    (window.SVGElement as any).prototype.getBBox = () => ({
      x: 100,
      y: 100,
    });
    (HTMLCanvasElement as any).prototype.getContext = () => null;
  });

  afterEach(() => {
    jest.clearAllMocks();
    (window.SVGElement as any).prototype.getBBox = undefined;
    (HTMLCanvasElement as any).prototype.getContext = undefined;
  });

  it('should render the commit side panel when the commit node is selected', async () => {
    routerRenderer(
      <CommitDetailsView commitName="Test commit name" applicationName="test-application" />,
    );

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const commitNode = graph.querySelector('[data-id="commit"]');
    expect(commitNode).toBeVisible();
    const clickable = commitNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();
    await act(async () => {
      fireEvent.click(clickable);
    });
    const header = screen.getByTestId('commit-side-panel-head');
    expect(header).toBeVisible();
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'Update README.md',
    );
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'Succeeded',
    );
  });
  it('should render the build side panel when the build node is selected', async () => {
    routerRenderer(
      <CommitDetailsView commitName="Test commit name" applicationName="test-application" />,
    );

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const buildNode = graph.querySelector('[data-id="human-resources-clkq-build"]');
    expect(buildNode).toBeVisible();
    const clickable = buildNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();
    await act(async () => {
      fireEvent.click(clickable);
    });
    const header = screen.getByTestId('build-side-panel-head');
    expect(header).toBeVisible();
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'human-resources-clkq-on-pull-request-fgkpt',
    );
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'Succeeded',
    );
  });
  it('should render the integration side panel when the component test node is selected', async () => {
    routerRenderer(
      <CommitDetailsView commitName="Test commit name" applicationName="test-application" />,
    );

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const compTestNode = graph.querySelector(
      '[data-id="human-resources-clkq--component-integration-test-one"]',
    );
    expect(compTestNode).toBeVisible();
    const clickable = compTestNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();
    await act(async () => {
      fireEvent.click(clickable);
    });
    const header = screen.getByTestId('int-test-side-panel-head');
    expect(header).toBeVisible();
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'component-integration-test-one',
    );
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain('Failed');
  });
  it('should render the integration side panel when the application test node is selected', async () => {
    routerRenderer(
      <CommitDetailsView commitName="Test commit name" applicationName="test-application" />,
    );

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const appTestNode = graph.querySelector('[data-id="human-resources-clkq--kpavic-test-bundle"]');
    expect(appTestNode).toBeVisible();
    const clickable = appTestNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();
    await act(async () => {
      fireEvent.click(clickable);
    });
    const header = screen.getByTestId('int-test-side-panel-head');
    expect(header).toBeVisible();
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'kpavic-test-bundle',
    );
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain(
      'Succeeded',
    );
  });
  it('should render the release side panel when the release node is selected', async () => {
    routerRenderer(
      <CommitDetailsView commitName="Test commit name" applicationName="test-application" />,
    );

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const releaseNode = graph.querySelector('[data-id="human-resources-clkq-release"]');
    expect(releaseNode).toBeVisible();
    const clickable = releaseNode.querySelector('.pf-topology-pipelines__pill');
    expect(clickable).toBeVisible();
    await act(async () => {
      fireEvent.click(clickable);
    });
    const header = screen.getByTestId('release-side-panel-head');
    expect(header).toBeVisible();
    expect(header.querySelector('.commit-side-panel__head-title').textContent).toContain('Release');
  });
});
