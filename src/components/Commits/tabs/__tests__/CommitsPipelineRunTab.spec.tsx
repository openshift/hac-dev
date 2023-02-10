import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { mockPLRs } from '../../__data__/pipeline-with-commits';
import CommitsPipelineRunTab from '../CommitsPipelineRunTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspace: jest.fn(() => 'test-ws'),
}));

const appName = 'my-test-app';

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('Commit Pipelinerun List', () => {
  it('should render empty state if no pipelinerun is present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<CommitsPipelineRunTab applicationName={appName} pipelineRuns={[]} />);
    screen.getByText(/Keep tabs on components and activity/);
    screen.getByText(/Monitor your components with pipelines and oversee CI\/CD activity./);
    const button = screen.getByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(
      `http://localhost/stonesoup/workspaces/test-ws/applications/import?application=my-test-app`,
    );
  });

  it('should render pipelineRuns list when pipelineRuns are present', () => {
    render(<CommitsPipelineRunTab applicationName={appName} pipelineRuns={mockPLRs} />);
    screen.getByText(/Pipeline runs/);
    screen.getByText('Name');
    screen.getByText('Started');
    screen.getByText('Duration');
    screen.getByText('Status');
    screen.getByText('Type');
  });
});
