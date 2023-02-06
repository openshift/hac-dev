import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { render, screen, configure, cleanup, fireEvent } from '@testing-library/react';
import {
  mockSnapshotsEnvironmentBindings,
  mockBuildPipelinesData,
  mockComponentsData,
  mockEnvironmentsData,
  mockIntegrationTestScenariosData,
  mockReleasePlansData,
  mockReleasesData,
  mockTestPipelinesData,
} from '../../../../components/ApplicationDetails/tabs/overview/sections/__data__';
import { EnvironmentType } from '../../../../components/Environment/environment-utils';
import { useAllEnvironments } from '../../../../hooks/useAllEnvironments';
import { useBuildPipelines } from '../../../../hooks/useBuildPipelines';
import { useComponents } from '../../../../hooks/useComponents';
import { useEnvironments } from '../../../../hooks/useEnvironments';
import { useIntegrationTestScenarios } from '../../../../hooks/useIntegrationTestScenarios';
import { useReleasePlans } from '../../../../hooks/useReleasePlans';
import { useReleases } from '../../../../hooks/useReleases';
import { useSnapshotsEnvironmentBindings } from '../../../../hooks/useSnapshotsEnvironmentBindings';
import { useTestPipelines } from '../../../../hooks/useTestPipelines';
import { mockLocation } from '../../../../utils/test-utils';
import { mockAppEnvWithHealthStatus } from '../__data__/mockAppEnvWithHealthStatus';
import EnvironmentListView from '../EnvironmentListView';

mockLocation();

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  useSearchParams: () => {
    const [params, setParams] = React.useState(() => new URLSearchParams());
    const setParamsCb = React.useCallback((newParams: URLSearchParams) => {
      setParams(newParams);
      window.location.search = `?${newParams.toString()}`;
    }, []);
    return [params, setParamsCb];
  },
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));
jest.mock('../../../../hooks/useIntegrationTestScenarios', () => ({
  useIntegrationTestScenarios: jest.fn(),
}));
jest.mock('../../../../hooks/useBuildPipelines', () => ({
  useBuildPipelines: jest.fn(),
}));
jest.mock('../../../../hooks/useEnvironments', () => ({
  useEnvironments: jest.fn(),
}));
jest.mock('../../../../hooks/useReleases', () => ({
  useReleases: jest.fn(),
}));
jest.mock('../../../../hooks/useReleasePlans', () => ({
  useReleasePlans: jest.fn(),
}));
jest.mock('../../../../hooks/useTestPipelines', () => ({
  useTestPipelines: jest.fn(),
}));
jest.mock('../../../../hooks/useSnapshotsEnvironmentBindings', () => ({
  useSnapshotsEnvironmentBindings: jest.fn(),
}));
jest.mock('../../../../hooks/useAllEnvironments', () => ({
  useAllEnvironments: jest.fn(),
}));

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useIntegrationTestScenariosMock = useIntegrationTestScenarios as jest.Mock;
const useBuildPipelinesMock = useBuildPipelines as jest.Mock;
const useEnvironmentsMock = useEnvironments as jest.Mock;
const useReleasesMock = useReleases as jest.Mock;
const useReleasePlansMock = useReleasePlans as jest.Mock;
const useTestPipelinesMock = useTestPipelines as jest.Mock;
const useSnapshotsEnvironmentBindingsMock = useSnapshotsEnvironmentBindings as jest.Mock;
const useAllEnvironmentsMock = useAllEnvironments as jest.Mock;

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

describe('EnvironmentListView', () => {
  beforeEach(() => {
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
    useIntegrationTestScenariosMock.mockReturnValue([mockIntegrationTestScenariosData, true]);
    useBuildPipelinesMock.mockReturnValue([mockBuildPipelinesData, true]);
    useEnvironmentsMock.mockImplementation(() => [mockEnvironmentsData, true]);
    useReleasePlansMock.mockReturnValue([mockReleasePlansData, true]);
    useReleasesMock.mockReturnValue([mockReleasesData, true]);
    useTestPipelinesMock.mockReturnValue([mockTestPipelinesData, true]);
    useSnapshotsEnvironmentBindingsMock.mockReturnValue([mockSnapshotsEnvironmentBindings, true]);
    useAllEnvironmentsMock.mockReturnValue([mockAppEnvWithHealthStatus, true]);
    useFeatureFlagMock.mockReturnValue([false]);
  });

  it('should render spinner while environment data is not loaded', () => {
    useAllEnvironmentsMock.mockReturnValue([[], false]);
    render(<EnvironmentListView />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should render empty state if no environment is present', () => {
    useAllEnvironmentsMock.mockReturnValue([[], true]);
    render(<EnvironmentListView />);
    expect(screen.getByText(/No environments found yet./)).toBeVisible();
    expect(
      screen.getByText(
        /An environment is a set of compute resources that you can use to develop, test, and stage your applications. You can share static environments across all applications in the workspace./,
      ),
    ).toBeVisible();
    // const createEnv = screen.queryByText('Create environment');
    // expect(createEnv).toBeNull();
  });

  it('should render cards when environment(s) is(are) present', () => {
    render(<EnvironmentListView />);
    // const createEnv = screen.queryByText('Create environment');
    // expect(createEnv)[0].toBeVisible();
    expect(screen.getAllByTestId('environment-card').length).toBe(
      mockAppEnvWithHealthStatus.length,
    );
  });

  it('should pre-filter environments by type', () => {
    render(<EnvironmentListView validTypes={[]} />);
    expect(screen.getByText(/No environments found yet./)).toBeVisible();
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    cleanup();
    render(<EnvironmentListView validTypes={[EnvironmentType.static]} />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    cleanup();
    render(<EnvironmentListView validTypes={[EnvironmentType.managed]} />);
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    cleanup();
    render(<EnvironmentListView validTypes={[EnvironmentType.ephemeral]} />);
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    cleanup();
    render(
      <EnvironmentListView validTypes={[EnvironmentType.static, EnvironmentType.ephemeral]} />,
    );
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);
  });

  it('should filter cards by type', async () => {
    render(<EnvironmentListView />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    // interact with filters
    const filterMenuButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterMenuButton);

    const staticCb = screen.getByLabelText(/Static/i, { selector: 'input' }) as HTMLInputElement;
    fireEvent.click(staticCb);
    expect(staticCb.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    const managedCb = screen.getByLabelText(/Managed/i, { selector: 'input' }) as HTMLInputElement;
    fireEvent.click(managedCb);
    expect(managedCb.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    const ephemeralCb = screen.getByLabelText(/Ephemeral/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(ephemeralCb);
    expect(ephemeralCb.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    // filter only some of the envs
    fireEvent.click(staticCb);
    fireEvent.click(ephemeralCb);
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    // clear the filter
    const clearFilterButton = screen.getAllByRole('button', { name: 'Clear filters' })[1];
    fireEvent.click(clearFilterButton);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);
  });

  it('should filter cards by name', () => {
    render(<EnvironmentListView />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    const textFilterInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(textFilterInput, { target: { value: 'd' } });
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);
    fireEvent.change(textFilterInput, { target: { value: 'dev' } });
    expect(screen.getAllByTestId('environment-card')).toHaveLength(1);
  });

  it('should clear filters from empty state', () => {
    render(<EnvironmentListView />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    const textFilterInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(textFilterInput, { target: { value: 'no match' } });

    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    const clearFilterButton = screen.getByRole('button', { name: 'Clear all filters' });
    fireEvent.click(clearFilterButton);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);
  });

  it('should filter cards by status', async () => {
    render(<EnvironmentListView applicationName="application-to-test" />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    // interact with filters
    const filterMenuButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterMenuButton);

    const missingFilter = screen.getByLabelText(/Missing/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(missingFilter);
    await expect(missingFilter.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    const degradedFilter = screen.getByLabelText(/Degraded/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(degradedFilter);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    fireEvent.click(missingFilter);
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    // clear the filter
    const clearFilterButton = screen.getAllByRole('button', { name: 'Clear filters' })[1];
    fireEvent.click(clearFilterButton);
    await expect(screen.getAllByTestId('environment-card')).toHaveLength(4);
  });

  it('should contain Healthy application status', () => {
    useAllEnvironmentsMock.mockReturnValue([mockAppEnvWithHealthStatus, true]);
    render(<EnvironmentListView applicationName="test" />);
    screen.getByText('Application Healthy');
  });

  it('should contain application Missing status', () => {
    useAllEnvironmentsMock.mockReturnValue([[mockAppEnvWithHealthStatus[0]], true]);
    render(<EnvironmentListView applicationName="test" />);
    screen.queryByText('Application Missing');
  });
});
