import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskRunKind } from '../../../../types';
import ScanDescriptionListGroup from '../ScanDescriptionListGroup';

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
    uid: 1,
    labels: {
      'tekton.dev/pipelineTask': 'clair-scan',
      'appstudio.openshift.io/application': 'test-app',
    },
  },
  status: {
    results: [
      {
        name: 'CVE_SCAN_RESULT',
        value: '{"vulnerabilities":{"critical":1,"high":2,"medium":3,"low":4}}',
      },
    ],
  },
} as unknown as TaskRunKind;

const mockTaskRun2 = {
  metadata: {
    name: 'test-tr-2',
    uid: 2,
    labels: {
      'tekton.dev/pipelineTask': 'crda',
      'appstudio.openshift.io/application': 'test-app',
    },
  },
  status: {
    results: [
      {
        name: 'CVE_SCAN_RESULT',
        value: '{"vulnerabilities":{"critical":1,"high":2,"medium":3,"low":4}}',
      },
    ],
  },
} as unknown as TaskRunKind;

describe('ScanDescriptionListGroup', () => {
  it('should show empty state if results are not available', () => {
    const { container } = render(<ScanDescriptionListGroup taskRuns={[]} />);
    expect(container).toHaveTextContent('Vulnerabilities scan');
    expect(container).toHaveTextContent('-');
  });

  it('should show nothing if results are not available and hideIfNotFound=true', () => {
    const { container } = render(<ScanDescriptionListGroup taskRuns={[]} hideIfNotFound />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should show vulnerability scans', () => {
    const { container } = render(
      <ScanDescriptionListGroup taskRuns={[mockTaskRun]} hideIfNotFound />,
    );
    expect(container).toHaveTextContent('Vulnerabilities scan');
    expect(screen.getByTestId('scan-status-critical-test-id')).toHaveTextContent('Critical1');
    expect(screen.getByTestId('scan-status-high-test-id')).toHaveTextContent('High2');
    expect(screen.getByTestId('scan-status-medium-test-id')).toHaveTextContent('Medium3');
    expect(screen.getByTestId('scan-status-low-test-id')).toHaveTextContent('Low4');
  });

  it('should render logs link', () => {
    const result = render(<ScanDescriptionListGroup taskRuns={[mockTaskRun]} showLogsLink />);

    const logsLink = result.queryByRole('link', { name: 'View logs' });
    expect(logsLink).toBeInTheDocument();

    expect(logsLink).toHaveAttribute(
      'href',
      '/application-pipeline/workspaces/test-ws/applications/test-app/taskruns/test-tr/logs',
    );
  });

  it('should aggregate scan results from multiple tasks', () => {
    render(<ScanDescriptionListGroup taskRuns={[mockTaskRun, mockTaskRun2]} showLogsLink />);

    expect(screen.getByTestId('scan-status-critical-test-id')).toHaveTextContent('Critical2');
    expect(screen.getByTestId('scan-status-high-test-id')).toHaveTextContent('High4');
    expect(screen.getByTestId('scan-status-medium-test-id')).toHaveTextContent('Medium6');
    expect(screen.getByTestId('scan-status-low-test-id')).toHaveTextContent('Low8');
  });

  it('should render a popover for multiple tasks', async () => {
    render(
      <ScanDescriptionListGroup
        taskRuns={[mockTaskRun, mockTaskRun2]}
        showLogsLink
        popoverAppendTo={false}
      />,
    );

    const logsLink = screen.getByTestId('view-logs-popover-trigger-test-id');
    expect(logsLink).toBeInTheDocument();
    act(() => logsLink.click());

    await waitFor(() => screen.getByTestId('scan-description-list-popover-test-id'));

    expect(screen.getByTestId('clair-scan-link-test-id')).toBeInTheDocument();
    expect(screen.getByTestId('crda-link-test-id')).toBeInTheDocument();
  });
});
