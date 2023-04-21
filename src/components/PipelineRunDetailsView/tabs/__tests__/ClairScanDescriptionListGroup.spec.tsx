import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskRunKind } from '../../../../types';
import ClairScanDescriptionListGroup from '../ClairScanDescriptionListGroup';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props: any) => <a href={props.to}>{props.children}</a>,
  };
});

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const mockTaskRun = {
  metadata: {
    name: 'test-tr',
    labels: {
      'tekton.dev/pipelineTask': 'clair-scan',
      'appstudio.openshift.io/application': 'test-app',
    },
  },
  status: {
    taskResults: [
      {
        name: 'CLAIR_SCAN_RESULT',
        value: '{"vulnerabilities":{"critical":1,"high":2,"medium":3,"low":4}}',
      },
    ],
  },
} as unknown as TaskRunKind;

describe('ClairScanDescriptionListGroup', () => {
  it('should show empty state if results are not available', () => {
    const { container } = render(<ClairScanDescriptionListGroup taskRuns={[]} />);
    expect(container).toHaveTextContent('Vulnerabilities scan');
    expect(container).toHaveTextContent('-');
  });

  it('should show nothing if results are not available and hideIfNotFound=true', () => {
    const { container } = render(<ClairScanDescriptionListGroup taskRuns={[]} hideIfNotFound />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should show vulnerability scans', () => {
    const { container } = render(
      <ClairScanDescriptionListGroup taskRuns={[mockTaskRun]} hideIfNotFound />,
    );
    expect(container).toHaveTextContent('Vulnerabilities scan');
    expect(container).toHaveTextContent('Critical 1');
    expect(container).toHaveTextContent('High 2');
    expect(container).toHaveTextContent('Medium 3');
    expect(container).toHaveTextContent('Low 4');
  });

  it('should render logs link', () => {
    const result = render(<ClairScanDescriptionListGroup taskRuns={[mockTaskRun]} showLogsLink />);

    const logsLink = result.queryByRole('link', { name: 'View logs' });
    expect(logsLink).toBeInTheDocument();

    expect(logsLink).toHaveAttribute(
      'href',
      '/application-pipeline/workspaces/test-ws/applications/test-app/taskruns/test-tr/logs',
    );
  });
});
