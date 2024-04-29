import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { render, screen } from '@testing-library/react';
import { useComponents } from '../../../../../hooks/useComponents';
import { useIntegrationTestScenarios } from '../../../../../hooks/useIntegrationTestScenarios';
import { usePipelineRunsForCommit } from '../../../../../hooks/usePipelineRuns';
import { useReleasePlans } from '../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../hooks/useReleases';
import { useSnapshots } from '../../../../../hooks/useSnapshots';
import { useSnapshotsEnvironmentBindings } from '../../../../../hooks/useSnapshotsEnvironmentBindings';
import { CustomError } from '../../../../../shared/utils/error/custom-error';
import {
  MockBuildPipelines,
  MockIntegrationTests,
  MockComponents,
  MockReleasePlans,
  MockReleases,
  MockSnapshots,
  MockSnapshotsEB,
  MockTestPipelines,
  MockCommit,
} from '../__data__/MockCommitWorkflowData';
import CommitVisualization from '../CommitVisualization';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true, null]),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../../hooks/useTektonResults');

jest.mock('../../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../../../hooks/usePipelineRuns', () => ({
  usePipelineRunsForCommit: jest.fn(),
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

const mockUsePipelineRunsForCommit = usePipelineRunsForCommit as jest.Mock;
const mockUseComponents = useComponents as jest.Mock;
const mockUseIntegrationTestScenarios = useIntegrationTestScenarios as jest.Mock;
const mockUseReleasePlans = useReleasePlans as jest.Mock;
const mockUseReleases = useReleases as jest.Mock;
const mockUseSnapshots = useSnapshots as jest.Mock;
const mockUseSnapshotsEnvironmentBindings = useSnapshotsEnvironmentBindings as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

const commit = MockCommit;

describe('CommitVisualization', () => {
  beforeEach(() => {
    mockUsePipelineRunsForCommit.mockReturnValue([
      [...MockBuildPipelines, ...MockTestPipelines],
      true,
    ]);
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

  it('should not render the commit visualization graph', () => {
    mockUsePipelineRunsForCommit.mockReturnValue([[], false]);
    mockUseComponents.mockReturnValue([[], false]);
    mockUseIntegrationTestScenarios.mockReturnValue([[], false]);
    mockUseReleasePlans.mockReturnValue([[], false]);
    mockUseReleases.mockReturnValue([[], false]);
    mockUseSnapshots.mockReturnValue([[], false]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], false]);
    render(<CommitVisualization commit={commit} />);
    expect(screen.queryByTestId('commit-graph')).not.toBeInTheDocument();
  });

  it('should render the commit visualization graph', () => {
    render(<CommitVisualization commit={commit} />);
    screen.getByTestId('commit-graph');
  });

  it('should render the commit visualization graph', () => {
    mockUsePipelineRunsForCommit.mockReturnValue([
      [],
      true,
      new CustomError('Model does not exist'),
    ]);
    mockUseComponents.mockReturnValue([[], true]);
    mockUseIntegrationTestScenarios.mockReturnValue([[], true]);
    mockUseReleasePlans.mockReturnValue([[], true]);
    mockUseReleases.mockReturnValue([[], true]);
    mockUseSnapshots.mockReturnValue([[], true]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], true]);

    render(<CommitVisualization commit={commit} />);
    screen.getByText('Model does not exist');
  });
  it('should render the commit visualization graph', async () => {
    render(<CommitVisualization commit={commit} />);

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const nodes = graph.querySelectorAll('[data-kind="node"]');

    expect(nodes).toHaveLength(8);
  });
});
