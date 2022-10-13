import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure, cleanup, fireEvent } from '@testing-library/react';
import {
  mockComponents,
  mockGitOpsDeployments,
} from '../../../../components/ApplicationEnvironment/__data__/mock-data';
import { WatchK8sResource } from '../../../../dynamic-plugin-sdk';
import { ComponentGroupVersionKind, EnvironmentGroupVersionKind } from '../../../../models';
import { GitOpsDeploymentGroupVersionKind } from '../../../../models/gitops-deployment';
import { EnvironmentKind } from '../../../../types';
import { mockLocation } from '../../../../utils/test-utils';
import EnvironmentListView from '../EnvironmentListView';
import { EnvironmentType } from '../utils';

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

const testEnvironments: EnvironmentKind[] = Object.keys(EnvironmentType).reduce((acc, t) => {
  for (let i = 1; i <= 2; i++) {
    acc.push({
      kind: 'Environment',
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      metadata: {
        name: `env-${t}-${i}`,
      },
      spec: {
        displayName: `My Env ${t} - ${i}`,
        deploymentStrategy: 'Manual',
        type: 'test',
        tags: [t],
      },
    });
  }
  return acc;
}, [] as EnvironmentKind[]);

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('EnvironmentListView', () => {
  it('should render spinner while environment data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<EnvironmentListView />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should render empty state if no environment is present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<EnvironmentListView />);
    expect(screen.getByText(/No environments found yet./)).toBeVisible();
    expect(
      screen.getByText(
        /Add static environments or link to external, managed environments as your release destination/,
      ),
    ).toBeVisible();
    expect(screen.getByText('Create environment')).toBeVisible();
  });

  it('should render application list when environment(s) is(are) present', () => {
    watchResourceMock.mockReturnValue([testEnvironments, true]);
    render(<EnvironmentListView />);
    expect(screen.getByText('Create environment')).toBeVisible();
    expect(screen.getAllByTestId('environment-card').length).toBe(testEnvironments.length);
  });

  it('should pre-filter environments by type', () => {
    render(<EnvironmentListView validTypes={[]} />);
    expect(screen.getByText(/No environments found yet./)).toBeVisible();
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    cleanup();
    render(<EnvironmentListView validTypes={[EnvironmentType.static]} />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    cleanup();
    render(<EnvironmentListView validTypes={[EnvironmentType.managed]} />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    cleanup();
    render(<EnvironmentListView validTypes={[EnvironmentType.ephemeral]} />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    cleanup();
    render(
      <EnvironmentListView validTypes={[EnvironmentType.static, EnvironmentType.ephemeral]} />,
    );
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);
  });

  it('should filter cards by type', async () => {
    watchResourceMock.mockReturnValue([testEnvironments, true]);
    render(<EnvironmentListView />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    // interact with filters
    const filterMenuButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterMenuButton);

    const staticCb = screen.getByLabelText(/Static/i, { selector: 'input' }) as HTMLInputElement;
    fireEvent.click(staticCb);
    expect(staticCb.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    const managedCb = screen.getByLabelText(/Managed/i, { selector: 'input' }) as HTMLInputElement;
    fireEvent.click(managedCb);
    expect(managedCb.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(4);

    const ephemeralCb = screen.getByLabelText(/Ephemeral/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(ephemeralCb);
    expect(ephemeralCb.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    // filter only some of the envs
    fireEvent.click(staticCb);
    fireEvent.click(ephemeralCb);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(2);

    // clear the filter
    const clearFilterButton = screen.getAllByRole('button', { name: 'Clear filters' })[1];
    fireEvent.click(clearFilterButton);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);
  });

  it('should filter cards by name', () => {
    render(<EnvironmentListView />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    const textFilterInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(textFilterInput, { target: { value: '1' } });
    expect(screen.getAllByTestId('environment-card')).toHaveLength(3);
  });

  it('should clear filters from empty state', () => {
    render(<EnvironmentListView />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    const textFilterInput = screen.getByRole('textbox', { name: 'name filter' });
    fireEvent.change(textFilterInput, { target: { value: 'no match' } });

    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    const clearFilterButton = screen.getByRole('button', { name: 'Clear all filters' });
    fireEvent.click(clearFilterButton);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);
  });

  it('should filter cards by status', async () => {
    watchResourceMock.mockImplementation((params: WatchK8sResource) => {
      if (params.groupVersionKind === EnvironmentGroupVersionKind) {
        return [testEnvironments, true];
      }
      if (params.groupVersionKind === GitOpsDeploymentGroupVersionKind) {
        return [mockGitOpsDeployments, true];
      }
      if (params.groupVersionKind === ComponentGroupVersionKind) {
        return [mockComponents, true];
      }
    });
    render(<EnvironmentListView applicationName="application-to-test" />);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    // interact with filters
    const filterMenuButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterMenuButton);

    const degradedFilter = screen.getByLabelText(/Degraded/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(degradedFilter);
    await expect(degradedFilter.checked).toBe(true);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    const healthyFilter = screen.getByLabelText(/Healthy/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(healthyFilter);
    expect(screen.getAllByTestId('environment-card')).toHaveLength(6);

    fireEvent.click(degradedFilter);
    expect(screen.queryAllByTestId('environment-card')).toHaveLength(0);

    // clear the filter
    const clearFilterButton = screen.getAllByRole('button', { name: 'Clear filters' })[1];
    fireEvent.click(clearFilterButton);
    await expect(screen.getAllByTestId('environment-card')).toHaveLength(6);
  });
});
