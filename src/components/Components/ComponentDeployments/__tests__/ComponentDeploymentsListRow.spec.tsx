import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure } from '@testing-library/react';
import { GitOpsDeploymentGroupVersionKind } from '../../../../models';
import { routerRenderer } from '../../../../utils/test-utils';
import { mockCommits } from '../../../Commits/__data__/pipeline-with-commits';
import {
  mockComponent,
  mockEnvironments,
  mockSnapshotEBs,
  mockTaskRuns,
  mockRoutes,
  mockGitOpsDeploymentCRs,
} from '../../ComponentDetails/__data__/mockComponentDetails';
import ComponentDeploymentsListRow from '../ComponentDeploymentsListRow';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

configure({ testIdAttribute: 'data-testid' });

describe('ComponentDeploymentsListRow', () => {
  let customData;

  beforeEach(() => {
    watchResourceMock.mockImplementation(({ groupVersionKind, isList }) => {
      if (groupVersionKind === GitOpsDeploymentGroupVersionKind) {
        return [mockGitOpsDeploymentCRs, true];
      }
      if (isList) {
        return [[], true];
      }
      return [{}, true];
    });
    customData = {
      component: mockComponent,
      snapshotEBs: mockSnapshotEBs,
      commit: mockCommits[0],
      taskRuns: mockTaskRuns,
      routes: mockRoutes,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the environment and route', () => {
    const wrapper = routerRenderer(
      <ComponentDeploymentsListRow
        obj={mockEnvironments[0]}
        columns={[]}
        customData={customData}
      />,
      {
        container: document.createElement('tr'),
      },
    );
    const cells = wrapper.container.getElementsByTagName('td');
    expect(cells.length).toEqual(5);

    expect(cells[0].children[0].innerHTML).toEqual(mockEnvironments[0]?.spec.displayName);
    const routeLink = cells[0].children[1].children[0] as HTMLElement;
    expect(routeLink.getAttribute('href')).toBe(
      'https://nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com',
    );
    const commitLink = cells[1].children[0] as HTMLElement;
    expect(commitLink.getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-ws/applications/sample-application/commit/comm0123456789abcdefghijklmnopqrstuvwxyz',
    );
    const snapshotLink = cells[2].children[0] as HTMLElement;
    expect(snapshotLink.getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-ws/applications/test-application/snapshots/test-application-xrvgq',
    );
  });
});
