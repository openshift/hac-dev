import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, configure, fireEvent, waitFor } from '@testing-library/react';
import { ComponentKind, NudgeStats } from '../../../../types';
import { routerRenderer } from '../../../../utils/test-utils';
import ComponentNudgesDependencies from '../ComponentNudgesDependencies';

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));
const mockComponent = {
  metadata: { name: 'component' },
  spec: { application: 'application' },
} as ComponentKind;

const mockAllComponents = [
  { metadata: { name: 'cmp1' }, spec: { application: 'app1' } },
  { metadata: { name: 'cmp2' }, spec: { application: 'app2' } },
  { metadata: { name: 'cmp3' }, spec: { application: 'app3' } },
  { metadata: { name: 'cmp4' }, spec: { application: 'app4' } },
  { metadata: { name: 'cmp5' }, spec: { application: 'app5' } },
] as ComponentKind[];

jest.mock('../../../../hooks/useComponents', () => ({
  useAllComponents: jest.fn(() => [mockAllComponents, true, undefined]),
}));

configure({ testIdAttribute: 'data-test' });

describe('ComponentNudgesDependencies', () => {
  it('should render empty state when no dependencies', async () => {
    routerRenderer(<ComponentNudgesDependencies component={mockComponent} />);
    screen.queryByTestId('nudges-empty-state');
  });

  it('should render 3 nudges dependencies', async () => {
    const cmp = {
      ...mockComponent,
      spec: { [NudgeStats.NUDGES]: ['cmp1', 'cmp2', 'cmp3'] },
    } as ComponentKind;
    routerRenderer(<ComponentNudgesDependencies component={cmp} />);
    fireEvent.click(screen.getByTestId('nudges-radio'));
    await waitFor(() => {
      expect(screen.getByText('cmp1')).toBeInTheDocument();
      expect(screen.getByText('cmp2')).toBeInTheDocument();
      expect(screen.getByText('cmp3')).toBeInTheDocument();
    });
  });

  it('should render 3 connectors', async () => {
    const cmp = {
      ...mockComponent,
      spec: { [NudgeStats.NUDGES]: ['cmp1', 'cmp2', 'cmp3'] },
    } as ComponentKind;
    routerRenderer(<ComponentNudgesDependencies component={cmp} />);

    fireEvent.click(screen.getByTestId('nudges-radio'));

    const connectors = screen.queryAllByTestId('nudges-connector');
    expect(connectors.length).toBe(3);
  });

  it('should render correct links', async () => {
    const cmp = {
      ...mockComponent,
      metadata: { name: 'test' },
      spec: { application: 'testApp', [NudgeStats.NUDGES]: ['cmp1', 'cmp2', 'cmp3'] },
    } as ComponentKind;
    routerRenderer(<ComponentNudgesDependencies component={cmp} />);

    fireEvent.click(screen.getByTestId('nudges-radio'));

    const links = screen.queryAllByTestId('nudges-cmp-link');
    expect(links.length).toBe(3);
    expect(links[0].getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-ws/applications/app1/components/cmp1',
    );
  });
});

describe('ComponentNudgesDependencies nudged by', () => {
  it('should render 4 nudged-by dependencies', async () => {
    const cmp = {
      ...mockComponent,
      status: { [NudgeStats.NUDGED_BY]: ['cmp1', 'cmp2', 'cmp3', 'cmp4'] },
    } as ComponentKind;
    routerRenderer(<ComponentNudgesDependencies component={cmp} />);

    fireEvent.click(screen.getByTestId('nudged-by-radio'));

    await waitFor(() => {
      expect(screen.getByText('cmp1')).toBeInTheDocument();
      expect(screen.getByText('cmp2')).toBeInTheDocument();
      expect(screen.getByText('cmp3')).toBeInTheDocument();
      expect(screen.getByText('cmp4')).toBeInTheDocument();
    });
  });

  it('should render 4 connectors', async () => {
    const cmp = {
      ...mockComponent,
      status: { [NudgeStats.NUDGED_BY]: ['cmp1', 'cmp2', 'cmp3', 'cmp4'] },
      spec: { application: 'testApp' },
    } as ComponentKind;
    routerRenderer(<ComponentNudgesDependencies component={cmp} />);

    fireEvent.click(screen.getByTestId('nudged-by-radio'));

    const connectors = screen.queryAllByTestId('nudges-connector');
    expect(connectors.length).toBe(4);
  });

  it('should render correct links', async () => {
    const cmp = {
      ...mockComponent,
      metadata: { name: 'test' },
      status: { [NudgeStats.NUDGED_BY]: ['cmp1', 'cmp2'] },
      spec: { application: 'testApp' },
    } as ComponentKind;
    routerRenderer(<ComponentNudgesDependencies component={cmp} />);

    fireEvent.click(screen.getByTestId('nudged-by-radio'));

    const links = screen.queryAllByTestId('nudged-by-cmp-link');
    expect(links.length).toBe(2);
    expect(links[1].getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-ws/applications/app2/components/cmp2',
    );
  });
});
