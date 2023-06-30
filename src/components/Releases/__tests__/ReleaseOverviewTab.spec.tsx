import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { mockRelease } from '../__data__/mock-release-data';
import ReleaseOverviewTab from '../ReleaseOverviewTab';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

describe('ReleaseOverviewTab', () => {
  it('should render correct details', () => {
    render(<ReleaseOverviewTab applicationName="test-app" release={mockRelease} />);
    expect(screen.getByText('Duration')).toBeVisible();
    expect(screen.getByText('10 seconds')).toBeVisible();

    expect(screen.getByText('Release Process')).toBeVisible();
    expect(screen.getByText('Manual')).toBeVisible();

    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getByText('Unknown')).toBeVisible();

    expect(screen.getByText('Release Plan')).toBeVisible();
    expect(screen.getByText('test-plan')).toBeVisible();

    expect(screen.getByText('Snapshot')).toBeVisible();
    expect(screen.getByText('test-snapshot')).toBeVisible();

    expect(screen.getByText('Release Target')).toBeVisible();
    expect(screen.getByText('test-target')).toBeVisible();

    expect(screen.getByText('Release Strategy')).toBeVisible();
    expect(screen.getByText('test-strategy')).toBeVisible();

    expect(screen.getByText('Pipeline Run')).toBeVisible();
    expect(screen.getByText('test-strategy')).toBeVisible();
    expect(screen.getByRole('link', { name: 'test-pipelinerun' }).getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-target/applications/test-app/pipelineruns/test-pipelinerun',
    );
  });
});
