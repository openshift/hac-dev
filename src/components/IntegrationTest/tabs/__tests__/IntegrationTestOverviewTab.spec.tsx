import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MockIntegrationTests } from '../../IntegrationTestsListView/__data__/mock-integration-tests';
import IntegrationTestOverviewTab from '../IntegrationTestOverviewTab';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

describe('IntegrationTestOverviewTab', () => {
  it('should render correct details', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTests[0]} />);
    screen.getByText('test-app-test-1'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('pipeline-1'); // pipeline-to-run
    screen.getByText('Optional'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe(
      'https://quay.io/test-rep/test-bundle:test-1',
    ); // image bundle
    expect(screen.getAllByRole('link')[1].getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-ws/applications/test-app',
    ); // application link
  });

  it('should render correct details', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTests[1]} />);
    screen.getByText('test-app-test-2'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('pipeline-2'); // pipeline-to-run
    screen.getByText('Mandatory'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe(
      'https://quay.io/test-rep/test-bundle:test-2',
    ); // image bundle
    expect(screen.getAllByRole('link')[1].getAttribute('href')).toBe(
      '/application-pipeline/workspaces/test-ws/applications/test-app',
    ); // application link
  });

  it('should use the image url from the spec', () => {
    render(
      <IntegrationTestOverviewTab
        integrationTest={{
          ...MockIntegrationTests[1],
          spec: {
            ...MockIntegrationTests[1].spec,
            bundle: `http://quay.io/test-rep/test-bundle:test-2`,
          },
        }}
      />,
    );
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe(
      'http://quay.io/test-rep/test-bundle:test-2',
    );
  });
  it('should append https to the bundle url if it is not present in the spec', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTests[1]} />);
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe(
      'https://quay.io/test-rep/test-bundle:test-2',
    );
  });
});
