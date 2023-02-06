import { useBuildPipelines } from '../../../hooks/useBuildPipelines';
import { useComponents } from '../../../hooks/useComponents';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../hooks/useIntegrationTestScenarios';
import { useReleasePlans } from '../../../hooks/useReleasePlans';
import { useReleases } from '../../../hooks/useReleases';
import { useSnapshotsEnvironmentBindings } from '../../../hooks/useSnapshotsEnvironmentBindings';
import { useTestPipelines } from '../../../hooks/useTestPipelines';
import {
  mockBuildPipelinesData,
  mockComponentsData,
  mockEnvironmentsData,
  mockIntegrationTestScenariosData,
  mockReleasePlansData,
  mockReleasesData,
  mockSnapshotsEnvironmentBindings,
  mockTestPipelinesData,
} from './index';

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('../../../hooks/useIntegrationTestScenarios', () => ({
  useIntegrationTestScenarios: jest.fn(),
}));
jest.mock('../../../hooks/useBuildPipelines', () => ({
  useBuildPipelines: jest.fn(),
}));
jest.mock('../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));
jest.mock('../../../hooks/useReleases', () => ({
  useReleases: jest.fn(),
}));
jest.mock('../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));
jest.mock('../../../hooks/useTestPipelines', () => ({
  useTestPipelines: jest.fn(),
}));
jest.mock('../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));

export const getMockWorkflows = () => {
  const workflowMocks = {
    useComponentsMock: useComponents as jest.Mock,
    useIntegrationTestScenariosMock: useIntegrationTestScenarios as jest.Mock,
    useBuildPipelinesMock: useBuildPipelines as jest.Mock,
    useEnvironmentsMock: useEnvironments as jest.Mock,
    useReleasesMock: useReleases as jest.Mock,
    useReleasePlansMock: useReleasePlans as jest.Mock,
    useTestPipelinesMock: useTestPipelines as jest.Mock,
    useSnapshotsEnvironmentBindingsMock: useSnapshotsEnvironmentBindings as jest.Mock,
  };

  const applyWorkflowMocks = (mockFns) => {
    mockFns.useComponentsMock.mockReturnValue([mockComponentsData, true]);
    mockFns.useIntegrationTestScenariosMock.mockReturnValue([
      mockIntegrationTestScenariosData,
      true,
    ]);
    mockFns.useBuildPipelinesMock.mockReturnValue([mockBuildPipelinesData, true]);
    mockFns.useEnvironmentsMock.mockReturnValue([mockEnvironmentsData, true]);
    mockFns.useReleasePlansMock.mockReturnValue([mockReleasePlansData, true]);
    mockFns.useReleasesMock.mockReturnValue([mockReleasesData, true]);
    mockFns.useTestPipelinesMock.mockReturnValue([mockTestPipelinesData, true]);
    mockFns.useSnapshotsEnvironmentBindingsMock.mockReturnValue([
      mockSnapshotsEnvironmentBindings,
      true,
    ]);
  };
  return { workflowMocks, applyWorkflowMocks };
};
