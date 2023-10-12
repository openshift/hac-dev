import { useComponents, useSortedComponents } from '../../../hooks/useComponents';
import { useEnvironments } from '../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../hooks/useIntegrationTestScenarios';
import { useLatestBuildPipelines } from '../../../hooks/useLatestBuildPipelines';
import { useLatestIntegrationTestPipelines } from '../../../hooks/useLatestIntegrationTestPipelines';
import { useReleasePlans } from '../../../hooks/useReleasePlans';
import { useReleases } from '../../../hooks/useReleases';
import { useSnapshotsEnvironmentBindings } from '../../../hooks/useSnapshotsEnvironmentBindings';
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
  useSortedComponents: jest.fn(),
}));
jest.mock('../../../hooks/useIntegrationTestScenarios', () => ({
  useIntegrationTestScenarios: jest.fn(),
}));
jest.mock('../../../hooks/useLatestBuildPipelines', () => ({
  useLatestBuildPipelines: jest.fn(),
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
jest.mock('../../../hooks/useLatestIntegrationTestPipelines', () => ({
  useLatestIntegrationTestPipelines: jest.fn(),
}));
jest.mock('../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));

export const getMockWorkflows = () => {
  const workflowMocks = {
    useComponentsMock: useComponents as jest.Mock,
    useSortedComponentsMock: useSortedComponents as jest.Mock,
    useIntegrationTestScenariosMock: useIntegrationTestScenarios as jest.Mock,
    useLatestBuildPipelinesMock: useLatestBuildPipelines as jest.Mock,
    useEnvironmentsMock: useEnvironments as jest.Mock,
    useReleasesMock: useReleases as jest.Mock,
    useReleasePlansMock: useReleasePlans as jest.Mock,
    useLatestIntegrationTestPipelinesMock: useLatestIntegrationTestPipelines as jest.Mock,
    useSnapshotsEnvironmentBindingsMock: useSnapshotsEnvironmentBindings as jest.Mock,
  };

  const applyWorkflowMocks = (mockFns) => {
    mockFns.useComponentsMock.mockReturnValue([mockComponentsData, true]);
    mockFns.useSortedComponentsMock.mockReturnValue([[], false]);
    mockFns.useIntegrationTestScenariosMock.mockReturnValue([
      mockIntegrationTestScenariosData,
      true,
    ]);
    mockFns.useLatestBuildPipelinesMock.mockReturnValue([mockBuildPipelinesData, true]);
    mockFns.useEnvironmentsMock.mockReturnValue([mockEnvironmentsData, true]);
    mockFns.useReleasePlansMock.mockReturnValue([mockReleasePlansData, true]);
    mockFns.useReleasesMock.mockReturnValue([mockReleasesData, true]);
    mockFns.useLatestIntegrationTestPipelinesMock.mockReturnValue([mockTestPipelinesData, true]);
    mockFns.useSnapshotsEnvironmentBindingsMock.mockReturnValue([
      mockSnapshotsEnvironmentBindings,
      true,
    ]);
  };
  return { workflowMocks, applyWorkflowMocks };
};
