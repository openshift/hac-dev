import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { PipelineRunListRow } from '../../../PipelineRunListView/PipelineRunListRow';
import { pipelineWithCommits } from '../../__data__/pipeline-with-commits';
import CommitsPipelineRunTab from '../CommitsPipelineRunTab';

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
  useK8sWatchResource: jest.fn(),
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

const appName = 'my-test-app';

const watchResourceMock = useK8sWatchResource as jest.Mock;

const commitPlrs = [
  pipelineWithCommits[0],
  {
    ...pipelineWithCommits[1],
    metadata: {
      ...pipelineWithCommits[1].metadata,
      labels: {
        ...pipelineWithCommits[1].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'test',
      },
    },
  },
];

describe('Commit Pipelinerun List', () => {
  it('should render empty state if no pipelinerun is present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<CommitsPipelineRunTab applicationName={appName} pipelineRuns={[]} />);
    screen.getByText(/Keep tabs on components and activity/);
    screen.getByText(/Monitor your components with pipelines and oversee CI\/CD activity./);
    const button = screen.getByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(
      `http://localhost/application-pipeline/workspaces/test-ws/import?application=my-test-app`,
    );
  });

  it('should render pipelineRuns list when pipelineRuns are present', () => {
    render(<CommitsPipelineRunTab applicationName={appName} pipelineRuns={commitPlrs} />);
    screen.getByText(/Pipeline runs/);
    screen.getByText('Name');
    screen.getByText('Started');
    screen.getByText('Duration');
    screen.getByText('Status');
    screen.getByText('Type');
  });

  it('should render both Build and Test pipelineruns in the pipelinerun list', () => {
    render(
      <div style={{ overflow: 'auto' }}>
        <CommitsPipelineRunTab applicationName={appName} pipelineRuns={commitPlrs} />
      </div>,
    );

    screen.getByText('Build');
    screen.getByText('Test');
  });
});
