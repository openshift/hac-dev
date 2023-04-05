import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { render, screen } from '@testing-library/react';
import { useBuildPipelines } from '../../../../../hooks/useBuildPipelines';
import { useComponents } from '../../../../../hooks/useComponents';
import { useEnvironments } from '../../../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../../../hooks/useIntegrationTestScenarios';
import { useReleasePlans } from '../../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../../hooks/useReleases';
import { useSnapshots } from '../../../../../hooks/useSnapshots';
import { useSnapshotsEnvironmentBindings } from '../../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTestPipelines } from '../../../../../hooks/useTestPipelines';
import { CustomError } from '../../../../../shared/utils/error/custom-error';
import {
  MockBuildPipelines,
  MockIntegrationTests,
  MockComponents,
  MockEnvironments,
  MockReleasePlans,
  MockReleases,
  MockSnapshots,
  MockSnapshotsEB,
  MockTestPipelines,
  MockCommit,
} from '../__data__/MockCommitWorkflowData';
import CommitVisualization from '../CommitVisualization';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../../hooks/useBuildPipelines', () => ({
  useBuildPipelines: jest.fn(),
}));
jest.mock('../../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('../../../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
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
jest.mock('../../../../../hooks/useTestPipelines', () => ({
  useTestPipelines: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const mockUseBuildPipelines = useBuildPipelines as jest.Mock;
const mockUseComponents = useComponents as jest.Mock;
const mockUseEnvironments = useEnvironments as jest.Mock;
const mockUseIntegrationTestScenarios = useIntegrationTestScenarios as jest.Mock;
const mockUseReleasePlans = useReleasePlans as jest.Mock;
const mockUseReleases = useReleases as jest.Mock;
const mockUseSnapshots = useSnapshots as jest.Mock;
const mockUseSnapshotsEnvironmentBindings = useSnapshotsEnvironmentBindings as jest.Mock;
const mockUseTestPipelines = useTestPipelines as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

const commit = MockCommit;

describe('CommitVisualization', () => {
  beforeEach(() => {
    mockUseBuildPipelines.mockReturnValue([MockBuildPipelines, true]);
    mockUseComponents.mockReturnValue([MockComponents, true]);
    mockUseEnvironments.mockReturnValue([MockEnvironments, true]);
    mockUseIntegrationTestScenarios.mockReturnValue([MockIntegrationTests, true]);
    mockUseReleasePlans.mockReturnValue([MockReleasePlans, true]);
    mockUseReleases.mockReturnValue([MockReleases, true]);
    mockUseSnapshots.mockReturnValue([MockSnapshots, true]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([MockSnapshotsEB, true]);
    mockUseTestPipelines.mockReturnValue([MockTestPipelines, true]);
    useFeatureFlagMock.mockReturnValue([false]);

    (window.SVGElement as any).prototype.getBBox = () => ({
      x: 100,
      y: 100,
    });
    (HTMLCanvasElement as any).prototype.getContext = () => null;
  });

  afterEach(() => {
    jest.resetAllMocks();
    (window.SVGElement as any).prototype.getBBox = undefined;
    (HTMLCanvasElement as any).prototype.getContext = undefined;
  });

  it('should not render the commit visualization graph', () => {
    mockUseBuildPipelines.mockReturnValue([[], false]);
    mockUseComponents.mockReturnValue([[], false]);
    mockUseEnvironments.mockReturnValue([[], false]);
    mockUseIntegrationTestScenarios.mockReturnValue([[], false]);
    mockUseReleasePlans.mockReturnValue([[], false]);
    mockUseReleases.mockReturnValue([[], false]);
    mockUseSnapshots.mockReturnValue([[], false]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], false]);
    mockUseTestPipelines.mockReturnValue([[], false]);
    render(<CommitVisualization commit={commit} />);
    expect(screen.queryByTestId('commit-graph')).not.toBeInTheDocument();
  });

  it('should render the commit visualization graph', () => {
    render(<CommitVisualization commit={commit} />);
    screen.getByTestId('commit-graph');
  });

  it('should render the commit visualization graph', () => {
    mockUseBuildPipelines.mockReturnValue([[], true, new CustomError('Model does not exist')]);
    mockUseComponents.mockReturnValue([[], true]);
    mockUseEnvironments.mockReturnValue([[], true]);
    mockUseIntegrationTestScenarios.mockReturnValue([[], true]);
    mockUseReleasePlans.mockReturnValue([[], true]);
    mockUseReleases.mockReturnValue([[], true]);
    mockUseSnapshots.mockReturnValue([[], true]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], true]);
    mockUseTestPipelines.mockReturnValue([[], true]);

    render(<CommitVisualization commit={commit} />);
    screen.getByText('Model does not exist');
  });
  it('should render the commit visualization graph', async () => {
    render(<CommitVisualization commit={commit} />);

    const graph = screen.getByTestId('commit-graph');
    expect(graph).toBeVisible();

    const nodes = graph.querySelectorAll('[data-kind="node"]');

    expect(nodes).toHaveLength(9);
  });
});
