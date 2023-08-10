import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { mockPipelineRuns } from '../../../../components/Components/__data__/mock-pipeline-run';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { usePipelineRuns } from '../../../../hooks/usePipelineRuns';
import { PipelineRunListRow } from '../../../PipelineRunListView/PipelineRunListRow';
import SnapshotPipelineRunsTab from '../SnapshotPipelineRunsTab';

jest.mock('../../../../shared/components/table/VirtualBody', () => {
  return {
    VirtualBody: (props) => {
      return props.data.map((plr, i) => (
        <PipelineRunListRow key={i} columns={props.columns} obj={plr} />
      ));
    },
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../../hooks/usePipelineRuns', () => ({
  usePipelineRuns: jest.fn(),
}));

const usePipelineRunsMock = usePipelineRuns as jest.Mock;

const appName = 'my-test-app';

const snapShotPLRs = [
  mockPipelineRuns[0],
  {
    ...mockPipelineRuns[0],
    metadata: {
      ...mockPipelineRuns[0].metadata,
      labels: {
        ...mockPipelineRuns[0].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'test',
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
  },
  {
    ...mockPipelineRuns[1],
    metadata: {
      ...mockPipelineRuns[1].metadata,
      labels: {
        ...mockPipelineRuns[1].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'build',
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
  },
  {
    ...mockPipelineRuns[2],
    metadata: {
      ...mockPipelineRuns[2].metadata,
      labels: {
        ...mockPipelineRuns[2].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'test',
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
  },
];

describe('SnapshotPipelineruns List', () => {
  it('should render empty state if no pipelinerun is present', () => {
    usePipelineRunsMock.mockReturnValue([[], true, false]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );
    screen.queryByText(/Not found/);
    const button = screen.queryByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(
      `http://localhost/application-pipeline/workspaces/test-ws/import?application=my-test-app`,
    );
  });

  it('should render pipelineRuns list when pipelineRuns are present', () => {
    usePipelineRunsMock.mockReturnValue([[snapShotPLRs], true, false]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );
    screen.queryByText(/Pipeline runs/);
    screen.queryByText('Name');
    screen.queryByText('Started');
    screen.queryByText('Duration');
    screen.queryByText('Status');
    screen.queryByText('Type');
  });

  it('should render both Build and Test pipelineruns in the pipelinerun list', () => {
    usePipelineRunsMock.mockReturnValue([[snapShotPLRs], true, false]);
    render(
      <div style={{ overflow: 'auto' }}>
        {' '}
        render(
        <SnapshotPipelineRunsTab
          applicationName={appName}
          namespace="test"
          snapshotName="test-snapshot"
        />
        , );
      </div>,
    );

    screen.queryByText('Build');
    screen.queryByText('Test');
    screen.queryByText('python-sample-942fq');
    screen.queryByText('go-sample-s2f4f');
  });
});
